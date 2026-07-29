// @ts-nocheck
const { LogicColor } = require("../logic/LogicColor");
const { MovieClip } = require("../../laser/titan/client/common/flash/MovieClip");
const { StringTable } = require("../../laser/client/game/text/StringTable");
const { Stage } = require("../../laser/titan/client/common/flash/Stage");
const { Config } = require("../config/Config");
const { FileManager } = require("../filesystem/FileManager");

class FPSCounter {
  static toggleEnabled() {
    Config.config.ShowFPSCounter = !Config.config.ShowFPSCounter;
    FileManager.updateConfigFile();
    FPSCounter.toggle(Config.config.ShowFPSCounter);
    return Config.config.ShowFPSCounter;
  }

  static isEnabled() {
    return Boolean(Config.config.ShowFPSCounter);
  }

  static toggle(enabled) {
    if (enabled && !this.fpsTextField) {
      const textField = MovieClip.getTextFieldByName(
        StringTable.getMovieClip("sc/ui.sc", "popover_text_left").instance,
        "text",
      );
      if (!textField || textField.instance.isNull()) return;
      this.fpsTextField = textField;
      this.fpsTextField.x = 20;
      this.fpsTextField.y = 5;
      this.fpsTextField.fontOutline = true;
      try {
        Stage.addChild(this.fpsTextField.instance);
      } catch (_error) {
        return;
      }
      return;
    }

    if (this.fpsTextField) {
      if (!this.fpsTextField.instance.isNull()) {
        try {
          Stage.removeChild(this.fpsTextField.instance);
        } catch (_error) {}
      }
      this.fpsTextField = null;
    }
  }

  static update() {
    if (this.fpsTextField) {
      if (this.bySecondTrigger) {
        const color = this.framecounter < 60 ? this.fpsGradientArray[this.framecounter] : 3329330;
        this.fpsTextField.color = 3489660928 + color;
        this.fpsTextField.text = "FPS: ".concat(this.framecounter);
        this.bySecondTrigger = false;
        this.framecounter = 0;
      }
      this.framecounter++;
    }
  }
}

FPSCounter.bySecondTrigger = false;
FPSCounter.fpsGradientArray = LogicColor.generateColorArray(16776960, 16711680, 30).concat(
  LogicColor.generateColorArray(3329330, 16776960, 30),
);
FPSCounter.framecounter = 0;

exports.FPSCounter = FPSCounter;
