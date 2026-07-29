// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const downloadDeferredFiles = new NativeFunction(Libg.offset(8424008, 8079516), "void", [
  "pointer",
]);
const instance = Libg.offset(19845848, 18155176);
class GameDownloadManager {
  static getInstance() {
    return instance.readPointer();
  }
  static downloadDeferredFiles() {
    const value = this.getInstance();
    if (!value.isNull()) downloadDeferredFiles(value);
  }
}
exports.GameDownloadManager = GameDownloadManager;
