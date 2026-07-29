// @ts-nocheck
const { StringObject } = require("../../laser/titan/client/native/StringObject");
const { Libg } = require("../../lib/Libg");
const { Libc } = require("../../lib/Libc");
const { Config } = require("../config/Config");
const { Json } = require("./Json");
const { AAsset } = require("../../laser/titan/client/native/AAsset");

const rootDirectoryAddress = Libg.offset(19860048, 0);
const assetManagerAddress = Libg.offset(19929536, 0);

class FileManager {
  static get rootDirPath() {
    if (this._rootDir === "") {
      this._rootDir =
        Process.platform == "darwin"
          ? Process.getHomeDir() + "/Documents/updated"
          : StringObject.read(rootDirectoryAddress);
    }
    return this._rootDir;
  }

  static set rootDirPath(value) {
    this._rootDir = value;
  }

  static init() {
    if (this.rootDirPath?.endsWith("/")) {
      this.rootDirPath = this.rootDirPath.substring(0, this.rootDirPath.length - 1);
    }

    this.saveDirPath =
      Process.platform === "darwin"
        ? "".concat(this.rootDirPath.replace("/updated", ""), "/saved")
        : "".concat(this.rootDirPath, "/save");
    this.logFilePath = "".concat(this.saveDirPath, "/debugger_log.txt");
    this.modSaveFilePath = "".concat(this.saveDirPath, "/bsd_save.json");

    if (!this.isFilepath(this.saveDirPath)) this.createDirectory(this.saveDirPath);
    if (!this.isFilepath(this.modSaveFilePath)) this.updateConfigFile();
    if ("" === this.readFile(this.modSaveFilePath, "r")) this.updateConfigFile();
  }

  static updateConfigFile() {
    this.writeToFile(FileManager.modSaveFilePath, "w", Json.formatJSONString(Config.config));
  }

  static writeToFile(path, mode, contents) {
    const file = new File(path, mode);
    file.write(contents);
    file.close();
  }

  static readFile(path, mode = "text/html") {
    try {
      return mode === "r" ? File.readAllText(path) : File.readAllBytes(path);
    } catch (_error) {
      return mode === "r" ? "" : new ArrayBuffer(0);
    }
  }

  static isFilepath(path) {
    return Libc.access(Memory.allocUtf8String(path), 0) === 0;
  }

  static createDirectory(path) {
    if (path === "" || path === "/") return;

    const parts = path.split("/").filter((part) => part.length > 0);
    path.startsWith("/");
    let currentPath = "";

    for (const part of parts) {
      currentPath += "/" + part;
      if (!this.isFilepath(currentPath)) {
        try {
          Libc.mkdir(Memory.allocUtf8String(currentPath), 504);
        } catch (_error) {}
      }
    }
  }

  static readAAsset(path, mode = "text/html") {
    if (Process.platform == "darwin") {
      path = FileManager.getFilePath(path);
      if (!FileManager.isFilepath(path)) {
        return mode === "r" ? "" : new ArrayBuffer(0);
      }
      try {
        return mode === "r" ? File.readAllText(path) : File.readAllBytes(path);
      } catch (_error) {
        return mode === "r" ? "" : new ArrayBuffer(0);
      }
    }

    const asset = AAsset.open(assetManagerAddress.readPointer(), Memory.allocUtf8String(path), 0);
    if (!asset.isNull()) {
      const length = AAsset.getLength64(asset);
      const buffer = Libc.malloc(length);
      const bytesRead = AAsset.read(asset, buffer, length);
      if (bytesRead > 0) {
        const result =
          mode === "r" ? buffer.readUtf8String(bytesRead) : buffer.readByteArray(bytesRead);
        Libc.free(buffer);
        return result;
      }
      AAsset.close(asset);
    }
  }

  static getResourcePath() {
    if (this._resourcePath !== null) return this._resourcePath;
    const module = Process.getModuleByName("laser");
    const separator = module.path.lastIndexOf("/");
    this._resourcePath = separator > 0 ? module.path.substring(0, separator) : "";
    return this._resourcePath;
  }

  static getFilePath(path) {
    if (Process.platform != "darwin") return path;
    const resourceFile = this.getResourcePath() + "/res/" + path;
    if (FileManager.isFilepath(resourceFile)) return resourceFile;
    return FileManager.rootDirPath + "/" + path;
  }
}

FileManager._rootDir = "";
FileManager._resourcePath = null;

exports.FileManager = FileManager;
