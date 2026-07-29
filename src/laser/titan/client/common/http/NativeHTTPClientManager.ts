// @ts-nocheck
const { HostRewriter } = require("./HostRewriter"),
  { StringObject } = require("../../native/StringObject"),
  { Libg } = require("../../../../../lib/Libg"),
  { Libc } = require("../../../../../lib/Libc"),
  { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory"),
  { EDebugger } = require("../../../../../suitcase/debug/EDebugger"),
  { NativeHTTPClient } = require("../../native/NativeHTTPClient"),
  { SafeJNI } = require("../../application/SafeJNI"),
  Offsets = require("./IOSHTTPOffsets");
const androidGet = new NativeFunction(Libg.offset(15781408, 0), "int", [
    "pointer",
    "pointer",
    "pointer",
    "pointer",
  ]),
  androidPost = new NativeFunction(Libg.offset(15779128, 0), "int", [
    "pointer",
    "pointer",
    "pointer",
  ]),
  dispatchGet = Libg.offset(15349948, 0),
  dispatchPost = Libg.offset(15350172, 0),
  dispatchGetNative = new NativeFunction(dispatchGet, "void", [
    "int",
    "int",
    "pointer",
    "int",
    "int",
  ]),
  dispatchPostNative = new NativeFunction(dispatchPost, "void", [
    "int",
    "int",
    "pointer",
    "int",
    "int",
  ]),
  dataEndOffset = LogicMemory.offset(8),
  dataCapacityOffset = LogicMemory.offset(16);
class NativeHTTPClientManager {
  static nativeHTTPGetRequest(hostName, callback, fileSavePath = "") {
    if (Process.platform === "darwin" || SafeJNI.isAvailable()) {
      StringObject.withMany([hostName, Date.now().toString(), "", fileSavePath], (v) => {
        if (Process.platform !== "darwin") {
          try {
            const id = androidGet(v[0], v[1], v[2], v[3]);
            this.queuedRequests[id.toString()] = callback;
          } catch {
            this.pendingDownloads.push({ hostName, callback, fileSavePath });
          }
        } else
          NativeHTTPClient.nativeHTTPGetRequest(
            v[0],
            (data, status) => {
              EDebugger.addMessage(
                status === 200 ? EDebugger.INFO : EDebugger.ERROR,
                `${status === 200 ? "Downloaded" : "Failed to download"} ${hostName}${status === 200 ? "" : ` - ${status}`}`,
              );
              if (callback) callback(data, status);
            },
            v[3],
          );
      });
    } else this.pendingDownloads.push({ hostName, callback, fileSavePath });
  }
  static nativeHTTPPostRequest(url, headers, postData) {
    if (!postData.instance) {
      EDebugger.addMessage(EDebugger.ERROR, "Missing post data!");
      return;
    }
    const vec = Libc.malloc(24),
      bytes = postData.instance.length > 0 ? postData.instance : new Uint8Array(),
      data = Libc.malloc(bytes.byteLength);
    data.writeByteArray(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
    vec.writePointer(data);
    vec.add(dataEndOffset).writePointer(data.add(bytes.byteLength));
    vec.add(dataCapacityOffset).writePointer(data.add(bytes.byteLength));
    StringObject.withMany([url, Date.now().toString()], (v) => {
      if (Process.platform === "darwin") NativeHTTPClient.nativeHTTPPostRequest(v[0], v[1], vec);
      else {
        const id = androidPost(v[0], v[1], vec);
        this.queuedRequests[id.toString()] = headers;
      }
    });
  }
  static onNativeHTTPResponse(id, data, status) {
    const key = id.toString();
    if (Object.keys(this.queuedRequests).indexOf(key) !== -1) {
      this.queuedRequests[key](data, status);
      delete this.queuedRequests[key];
    }
  }
  static applyRewrite(args, index) {
    try {
      const old = StringObject.read(args[index]),
        rewritten = HostRewriter.rewrite(old);
      if (!rewritten) return null;
      const value = StringObject.create(rewritten);
      args[index] = value;
      return value;
    } catch {
      return null;
    }
  }
  static freeRewroteSO(value) {
    if (value && !value.isNull())
      try {
        StringObject.clear(value);
      } catch {}
  }
  static flushPendingDownloads() {
    if (this.pendingDownloads.length === 0) return;
    const pending = this.pendingDownloads.splice(0);
    setTimeout(() => {
      for (const request of pending)
        this.nativeHTTPGetRequest(request.hostName, request.callback, request.fileSavePath);
    }, 0);
  }
  static dispatchFinishedHook(args) {
    try {
      this.onNativeHTTPResponse(
        args[1].toInt32(),
        args[2].readByteArray(args[3].toInt32()),
        args[4].toInt32(),
      );
    } catch {}
  }
  static patch() {
    Process.platform !== "darwin" ? this.patchAndroid() : this.patchIos();
  }
  static patchIos() {
    const enter = function (args) {
        this.rewroteSO = NativeHTTPClientManager.applyRewrite(args, 1);
      },
      leave = function () {
        NativeHTTPClientManager.freeRewroteSO(this.rewroteSO);
      };
    [Offsets.HTTPClient_get, Offsets.HTTPClient_post, Offsets.HTTPClient_download].forEach((p) =>
      Interceptor.attach(p, { onEnter: enter, onLeave: leave }),
    );
  }
  static patchAndroid() {
    Interceptor.attach(dispatchGet, { onEnter: this.dispatchFinishedHook });
    Interceptor.attach(dispatchPost, { onEnter: this.dispatchFinishedHook });
    Interceptor.attach(androidGet, {
      onEnter(args) {
        this.rewroteSO = NativeHTTPClientManager.applyRewrite(args, 0);
        NativeHTTPClientManager.flushPendingDownloads();
      },
      onLeave() {
        NativeHTTPClientManager.freeRewroteSO(this.rewroteSO);
      },
    });
  }
}
NativeHTTPClientManager.queuedRequests = {};
NativeHTTPClientManager.pendingDownloads = [];
module.exports = { NativeHTTPClientManager };
