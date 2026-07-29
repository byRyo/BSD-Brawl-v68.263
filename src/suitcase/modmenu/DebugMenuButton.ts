// @ts-nocheck
const { DebugGameButton } = require("./debugmenu/DebugGameButton");
const { DebugMenu } = require("./debugmenu/DebugMenu");
const { GameMain } = require("../../laser/client/GameMain");
const { StringTable } = require("../../laser/client/game/text/StringTable");
const { Stage } = require("../../laser/titan/client/common/flash/Stage");
const { Logcat } = require("../debug/Logcat");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { Config } = require("../config/Config");
const { FileManager } = require("../filesystem/FileManager");
const { Localisation } = require("../localisation/Localisation");
const { QuestionPopup } = require("../flash/popup/QuestionPopup");

class DebugMenuButton extends DebugGameButton {
  static ensureAssetLoaded() {
    if (!this.isAssetLoaded) {
      GameMain.loadAsset("sc/debug.sc");
      this.isAssetLoaded = true;
      Logcat.logInfo("DebugMenuButton: loaded sc/debug.sc");
    }
  }

  constructor() {
    super();
    DebugMenuButton.ensureAssetLoaded();
    this.setMovieClip(StringTable.getMovieClip("sc/debug.sc", "debug_button"), true);
    this.setTextFieldText("D");
    this.setXY(10, Stage.getMatrixY());
    this.setCustomButtonListener(this.callback.bind(this));
  }

  callback() {
    try {
      if (!DebugMenuButton.debugMenu) {
        DebugMenuButton.debugMenu = new DebugMenu();
        DebugMenuButton.debugMenu.hide();
        Stage.addChild(DebugMenuButton.debugMenu.instance);
        GUI.registerUpdateable(DebugMenuButton.debugMenu);
      }
      DebugMenuButton.debugMenu.toggle();
    } catch (_error) {}
  }

  static destroy() {
    if (this.debugMenu) {
      GUI.unregisterUpdateable(this.debugMenu);
      Stage.removeChild(this.debugMenu.instance);
      this.debugMenu.destruct();
      this.debugMenu = undefined;
    }
    if (this.buttonInstance) {
      Stage.removeChild(this.buttonInstance.instance);
      this.buttonInstance = undefined;
    }
  }

  static spawn() {
    if (this.buttonInstance) return this.buttonInstance;
    try {
      const button = new DebugMenuButton();
      Stage.addChild(button.instance);
      this.buttonInstance = button;
      return button;
    } catch (_error) {
      return null;
    }
  }

  static showFirstEnableWarning() {
    if (Config.config.DebugMenuButtonWarningShown) return;
    Config.config.DebugMenuButtonWarningShown = true;
    FileManager.updateConfigFile();
    const popup = new QuestionPopup(
      Localisation.getString("DebugMenuWarningTitle"),
      Localisation.getString("DebugMenuWarningText"),
      4294967040,
    );
    GUI.showPopup(popup, true, false, true);
  }

  static getDebugMenu() {
    return this.debugMenu;
  }

  static toggleButtonVisibility() {
    if (!this.buttonInstance) return;
    const colorTransform = this.buttonInstance.colorTransform;
    colorTransform.alpha = colorTransform.alpha === 0 ? 255 : 0;
  }
}

DebugMenuButton.isAssetLoaded = false;

exports.DebugMenuButton = DebugMenuButton;
