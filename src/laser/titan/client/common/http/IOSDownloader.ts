// @ts-nocheck
const { Libc } = require("../../../../../lib/Libc"),
  { Logcat } = require("../../../../../suitcase/debug/Logcat"),
  { StringObject } = require("../../native/StringObject"),
  Offsets = require("./IOSHTTPOffsets");
class IOSDownloader {
  static download(url, savePath, extra, callback) {
    if (Process.platform !== "darwin") {
      this.failCallback(callback, "IOSDownloader.download called on non-darwin", 0);
      return;
    }
    this.installHooksIfNeeded();
    const holder = this.allocateHolder();
    if (!holder) {
      this.failCallback(callback, "IOSDownloader: holder allocation failed", 0);
      return;
    }
    const wrapper = holder.add(8).readPointer();
    if (wrapper.isNull()) {
      try {
        Libc.free(holder);
      } catch {}
      this.failCallback(callback, "IOSDownloader: HTTPClientImpl alloc returned nil", 0);
      return;
    }
    this.pendingByWrapper.set(wrapper.toString(), { holder, savePath, url, callback });
    try {
      StringObject.withMany([url, savePath, extra || ""], (v) =>
        Offsets.HTTPClient_download(wrapper, v[0], v[1], v[2]),
      );
    } catch (e) {
      this.pendingByWrapper.delete(wrapper.toString());
      try {
        Libc.free(holder);
      } catch {}
      this.failCallback(callback, `IOSDownloader: dispatch error: ${e}`, 0);
    }
  }
  static allocateHolder() {
    try {
      const p = Libc.malloc(16);
      if (p.isNull()) return null;
      Offsets.HTTPClient_initWrapper(p);
      return p;
    } catch (e) {
      Logcat.logError(`IOSDownloader: holder alloc threw: ${e}`);
      return null;
    }
  }
  static failCallback(callback, message, status) {
    Logcat.logError(message);
    try {
      callback(message, status);
    } catch {}
  }
  static installHooksIfNeeded() {
    if (!this.hooksInstalled) {
      this.hooksInstalled = true;
      Interceptor.attach(Offsets.HTTPClient_downloadFinalize, {
        onEnter: (args) => this.onDownloadFinalize(args[0]),
      });
    }
  }
  static onDownloadFinalize(request) {
    let key, item;
    try {
      key = request.add(32).readPointer().toString();
      item = this.pendingByWrapper.get(key);
    } catch {
      return;
    }
    if (!item || !key) return;
    this.pendingByWrapper.delete(key);
    let state = 0,
      size = 0;
    try {
      state = request.add(40).readU32();
      size = request.add(44).readU32();
    } catch {}
    const ok = state === 2;
    try {
      item.callback(ok ? item.savePath : null, ok ? size : 0);
    } catch (e) {
      Logcat.logError(`IOSDownloader callback failed for ${item.url}: ${e}`);
    }
    try {
      Libc.free(item.holder);
    } catch {}
  }
}
IOSDownloader.pendingByWrapper = new Map();
IOSDownloader.hooksInstalled = false;
module.exports = { IOSDownloader };
