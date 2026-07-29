// @ts-nocheck
const { HomeScreen } = require("../../laser/client/game/screen/home/HomeScreen");
const { DownloadedImage } = require("../../laser/titan/client/common/flash/DownloadedImage");
const { Stage } = require("../../laser/titan/client/common/flash/Stage");
const { Config } = require("../config/Config");
const { FileManager } = require("../filesystem/FileManager");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { ClipboardImage } = require("./ClipboardImage");
const { Localisation } = require("../localisation/Localisation");
const FILE_NAME = "bsd_custom_bg";
class CustomBackground {
  static setFromFile(path) {
    const staged = this.stage(path);
    if (staged && this.apply(staged)) {
      Config.config.CustomThemeName = staged;
      FileManager.updateConfigFile();
      return true;
    }
    return false;
  }
  static setFromClipboard() {
    if (this.stageFromClipboard()) {
      const result = this.applyPending();
      if (result) GUI.showFloaterTextAtDefaultPosition(Localisation.getString("CustomBgSet"));
      return !!result;
    }
    GUI.showFloaterTextAtDefaultPosition(Localisation.getString("CustomBgNoImage"));
    return false;
  }
  static stageFromClipboard() {
    const path = `${FileManager.saveDirPath}/${FILE_NAME}.png`;
    this.pendingStagedPath = ClipboardImage.readImageTo(path) ? path : null;
    return this.pendingStagedPath !== null;
  }
  static applyPending() {
    const path = this.pendingStagedPath;
    this.pendingStagedPath = null;
    if (path && this.apply(path)) {
      Config.config.CustomThemeName = path;
      FileManager.updateConfigFile();
      return true;
    }
    return false;
  }
  static onHomeRebuilt() {
    this.current = null;
  }
  static hide() {
    this.removeCurrent();
  }
  static reapply() {
    if (Config.config.CustomThemeName) this.apply(Config.config.CustomThemeName);
  }
  static discard() {
    this.removeCurrent();
  }
  static clear() {
    this.removeCurrent();
    if (Config.config.CustomThemeName) {
      Config.config.CustomThemeName = "";
      FileManager.updateConfigFile();
    }
  }
  static apply(path) {
    if (!FileManager.isFilepath(path)) return false;
    const sprite = HomeScreen.getSprite();
    if (sprite.isNull()) return false;
    const theme = HomeScreen.getThemeMovieClip();
    if (theme.instance.isNull()) return false;
    this.removeCurrent();
    const image = DownloadedImage.fromLocalFile(path, theme.instance, true);
    this.coverScreen(image, theme);
    sprite.addChildAt(image, 1);
    this.current = image;
    return true;
  }
  static coverScreen(image, theme) {
    const natural = DownloadedImage.getNaturalSize(image.instance),
      width = Stage.getBackgroundCoverWidth(),
      height = Stage.getBackgroundCoverHeight();
    if (!natural || width <= 0 || height <= 0) return;
    const scale = Math.max(width / natural.width, height / natural.height);
    image.setSize(natural.width * scale, natural.height * scale);
    image.setPixelSnappedXY(theme.x, theme.y);
  }
  static removeCurrent() {
    if (this.current) {
      try {
        HomeScreen.getSprite().removeChild(this.current.instance);
      } catch (_) {}
      this.current = null;
    }
  }
  static stage(path) {
    if (!FileManager.isFilepath(path)) {
      GUI.showFloaterTextAtDefaultPosition(Localisation.getString("CustomBgError"));
      return null;
    }
    if (path.startsWith(FileManager.saveDirPath)) return path;
    const lower = path.toLowerCase(),
      extension = lower.endsWith(".jpg") || lower.endsWith(".jpeg") ? "jpg" : "png";
    const target = `${FileManager.saveDirPath}/${FILE_NAME}.${extension}`;
    try {
      const bytes = FileManager.readFile(path, "b");
      if (bytes && bytes.byteLength) {
        FileManager.writeToFile(target, "wb", bytes);
        return target;
      }
    } catch (_) {}
    GUI.showFloaterTextAtDefaultPosition(Localisation.getString("CustomBgError"));
    return null;
  }
}
CustomBackground.current = null;
CustomBackground.pendingStagedPath = null;
exports.CustomBackground = CustomBackground;
