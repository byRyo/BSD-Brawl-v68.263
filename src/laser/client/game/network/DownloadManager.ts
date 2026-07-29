// @ts-nocheck
const { FileManager } = require("../../../../suitcase/filesystem/FileManager");
const {
  NativeHTTPClientManager,
} = require("../../../titan/client/common/http/NativeHTTPClientManager");
const { Logcat } = require("../../../../suitcase/debug/Logcat");
const { LogInfo } = require("../../../../..");
const { Breadcrumbs } = require("../../../../suitcase/debug/Breadcrumbs");
const { Libc } = require("../../../../lib/Libc");
class DownloadManager {
  static init() {
    Logcat.logDebug("Initializing download entry...");
    this.removeStaleAssets();
    for (const asset of this.DOWNLOAD_ASSETS) this.checkAndQueue(asset);
    this.updateDownloadingStatus();
  }
  static removeStaleAssets() {
    const root =
      Process.platform === "darwin"
        ? `${FileManager.rootDirPath}/bsd`
        : `${FileManager.rootDirPath}/update/bsd`;
    if (!FileManager.isFilepath(root)) return;
    const keep = this.DOWNLOAD_ASSETS.map((a) =>
      Process.platform === "darwin"
        ? `${FileManager.rootDirPath}/${a.path}`
        : `${FileManager.rootDirPath}/update/${a.path}`,
    );
    let command = `find "${root}" -type f`;
    for (const path of keep) command += ` -not -path "${path}"`;
    command += ` -delete && find "${root}" -type d -empty -delete`;
    Logcat.logDebug(`Cleaning stale assets in ${root} (keeping ${keep.length})`);
    Libc.system(Memory.allocUtf8String(command));
  }
  static startDownloads() {
    if (this.downloadQueue.length !== 0) {
      Logcat.logDebug(`Starting ${this.downloadQueue.length} downloads`);
      this.processQueue();
    }
  }
  static checkAndQueue(asset) {
    let path = asset.path;
    path =
      Process.platform !== "darwin"
        ? `${FileManager.rootDirPath}/update/${path}`
        : `${FileManager.rootDirPath}/${path}`;
    const parts = path.split("/");
    let directory = "";
    for (let i = 0; i < parts.length - 1; i++) {
      directory += i === 0 ? parts[i] : `/${parts[i]}`;
      if (!FileManager.isFilepath(directory)) FileManager.createDirectory(directory);
    }
    if (FileManager.isFilepath(path)) {
      const checksum = new Checksum("sha1");
      checksum.update(FileManager.readFile(path));
      if (checksum.getString() === asset.hash) {
        asset.loadingDone = true;
        this.downloadedAssets++;
        this.updateDownloadingStatus();
        return;
      }
    }
    this.downloadQueue.push(asset);
  }
  static processQueue() {
    while (this.activeDownloads < this.MAX_CONCURRENT && this.downloadQueue.length > 0)
      this.startDownload(this.downloadQueue.shift());
  }
  static startDownload(asset) {
    this.activeDownloads++;
    asset.retries ??= 0;
    const host = asset.retries < 2 ? "https://rubsd.meowfox.net" : "https://bsd.meowfox.net";
    const path =
      Process.platform !== "darwin"
        ? `${FileManager.rootDirPath}/update/${asset.path}`
        : `${FileManager.rootDirPath}/${asset.path}`;
    LogInfo("started downloading", asset.urlPath, `(attempt ${asset.retries + 1}, host: ${host})`);
    Breadcrumbs.push(`Started downloading ${asset.urlPath} attempt ${asset.retries + 1}`);
    NativeHTTPClientManager.nativeHTTPGetRequest(
      host + asset.urlPath,
      (_data, status) => {
        this.activeDownloads--;
        if (status === 200) {
          this.downloadedAssets++;
          asset.loadingDone = true;
          LogInfo(`Downloaded asset ${asset.path}`);
          Breadcrumbs.push(`Downloaded asset ${asset.path}`);
          Logcat.logDebug(`Downloaded asset ${asset.path}`);
          if (this.downloadedAssets === this.DOWNLOAD_ASSETS.length) {
            this.downloadingFinished = true;
            Logcat.logDebug(`Downloading finished (${this.downloadedAssets} assets)`);
          }
        } else if (++asset.retries < 4) {
          Logcat.logDebug(
            `Failed to download ${asset.path} (status ${status}), retry ${asset.retries}/4`,
          );
          this.downloadQueue.push(asset);
        } else {
          Logcat.logDebug(`Failed to download ${asset.path} after 4 attempts, giving up`);
          this.downloadedAssets++;
          this.updateDownloadingStatus();
        }
        this.processQueue();
      },
      path,
    );
  }
  static updateDownloadingStatus() {
    this.downloadingFinished = this.downloadedAssets === this.DOWNLOAD_ASSETS.length;
  }
  static isFileDownloaded(path) {
    const asset = this.DOWNLOAD_ASSETS.find((a) =>
      a.path.toLowerCase().includes(path.toLowerCase()),
    );
    return !!asset && (asset.loadingDone ?? false);
  }
  static downloadIfNotExists(urlPath, _hash, _path, _callback) {
    const asset = this.DOWNLOAD_ASSETS.find((a) => a.urlPath === urlPath);
    if (asset && !asset.loadingDone) {
      this.downloadQueue.push(asset);
      this.processQueue();
    }
  }
  static clear() {
    const root = `${FileManager.rootDirPath}/update/`;
    for (const asset of this.DOWNLOAD_ASSETS) {
      const path = root + asset.path;
      if (FileManager.isFilepath(path)) Libc.unlink(Memory.allocUtf8String(path));
    }
    Libc.kill(Libc.getpid(), 15);
  }
}
DownloadManager.pathContainer = FileManager.rootDirPath;
DownloadManager.DOWNLOAD_ASSETS = [];
DownloadManager.downloadedAssets = 0;
DownloadManager.downloadingFinished = false;
DownloadManager.MAX_CONCURRENT = 3;
DownloadManager.activeDownloads = 0;
DownloadManager.downloadQueue = [];
exports.DownloadManager = DownloadManager;
