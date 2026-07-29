// @ts-nocheck
const { GameMain } = require("../../laser/client/GameMain");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { Config } = require("../config/Config");
const { FileManager } = require("../filesystem/FileManager");
const QUALITY_NAMES = ["Low", "Mid", "High", "Highest"];
class GfxDebugKnobs {
  static isLowResAssets() {
    return Config.config.UseLowResGraphics;
  }
  static toggleLowResAssets() {
    Config.config.UseLowResGraphics = !Config.config.UseLowResGraphics;
    this.persistAndApply();
    GUI.showFloaterTextAtDefaultPosition(
      `Low-res assets: ${Config.config.UseLowResGraphics ? "ON" : "OFF"}`,
    );
  }
  static getGfxQualityLevel() {
    return Config.config.GfxQualityLevel;
  }
  static cycleGfxCapability() {
    Config.config.GfxQualityLevel = this.nextQualityLevel(Config.config.GfxQualityLevel);
    this.persistAndApply();
    GUI.showFloaterTextAtDefaultPosition(
      `GFX quality: ${QUALITY_NAMES[Config.config.GfxQualityLevel]}`,
    );
  }
  static getMemQualityLevel() {
    return Config.config.MemQualityLevel;
  }
  static cycleMemCapability() {
    Config.config.MemQualityLevel = this.nextQualityLevel(Config.config.MemQualityLevel);
    this.persistAndApply();
    GUI.showFloaterTextAtDefaultPosition(
      `Memory quality: ${QUALITY_NAMES[Config.config.MemQualityLevel]}`,
    );
  }
  static nextQualityLevel(level) {
    return (level + 1) % QUALITY_NAMES.length;
  }
  static persistAndApply() {
    FileManager.updateConfigFile();
    GameMain.applyGraphicsConfig();
  }
}
exports.GfxDebugKnobs = GfxDebugKnobs;
