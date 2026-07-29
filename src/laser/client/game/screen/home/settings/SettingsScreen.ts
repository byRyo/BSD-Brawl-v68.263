// @ts-nocheck
const { Libg } = require("../../../../../../lib/Libg");
const { StringTable } = require("../../../text/StringTable");
const { GameButton } = require("../../../gui/GameButton");
const { Localisation } = require("../../../../../../suitcase/localisation/Localisation");
const { DropGUIContainer } = require("../../../../../titan/client/common/flash/DropGUIContainer");
const { GUI } = require("../../../gui/GUI");
const { FPSLimitPopup } = require("../../../../../../suitcase/modmenu/FPSLimit");
const {
  ModConfigurationPopup,
} = require("../../../../../../suitcase/modconfiguration/ModConfiguration");
const { ModMenuPopup } = require("../../../../../../suitcase/modmenu/ModMenu");

const settingsScreenCtor = Libg.offset(10135828, 9525468);

class SettingsScreen extends DropGUIContainer {
  static patch() {
    Interceptor.attach(settingsScreenCtor, {
      onEnter(args) {
        this.self = args[0];
      },
      onLeave() {
        const container = new DropGUIContainer(this.self);
        const fpsClip = StringTable.getMovieClip("sc/ui.sc", "settings_popup");
        const modMenuClip = StringTable.getMovieClip("sc/ui.sc", "settings_popup");
        const configClip = StringTable.getMovieClip("sc/ui.sc", "settings_popup");

        const fpsMovieClip = StringTable.getMovieClip(
          "sc/ui.sc",
          "settings_popup",
        ).getMovieClipByName("button_edit_controls");
        const fpsButton = new GameButton();
        fpsButton.setMovieClip(fpsMovieClip, 1);
        const fpsText = fpsMovieClip.getTextFieldByName("TID_EDIT_CONTROLS");
        fpsButton.setCustomButtonListener(() => {
          GUI.showPopup(new FPSLimitPopup(), true, false, false);
        }, "openFPSLimitButton");
        fpsText.setTextScaleIfNecessary(Localisation.getString("FPSLimitButton"));
        fpsButton.setXY(-5, 100);
        container.addChild(fpsButton);

        const modMenuMovieClip = modMenuClip.getMovieClipByName("button_edit_controls");
        const modMenuButton = new GameButton();
        modMenuButton.setMovieClip(modMenuMovieClip, 1);
        const modMenuText = modMenuMovieClip.getTextFieldByName("TID_EDIT_CONTROLS");
        modMenuButton.setCustomButtonListener(() => {
          GUI.showPopup(new ModMenuPopup(), true, false, true);
        }, "openModConfigurationButton");
        modMenuText.setTextScaleIfNecessary(Localisation.getString("ModMenuPopup"));
        modMenuButton.setXY(-310, 100);
        container.addChild(modMenuButton);

        const configMovieClip = configClip.getMovieClipByName("button_edit_controls");
        const configButton = new GameButton();
        configButton.setMovieClip(configMovieClip, 1);
        const configText = configMovieClip.getTextFieldByName("TID_EDIT_CONTROLS");
        configButton.setCustomButtonListener(() => {
          GUI.showPopup(new ModConfigurationPopup().instance, true, false, true);
        }, "openModMenuButton");
        configText.setTextScaleIfNecessary(Localisation.getString("ModConfigurationPopup"));
        configButton.setXY(-160, 100);
        container.addChild(configButton);

        container.getMovieClip().getChildById(37).removeFromParent();
        container
          .getMovieClip()
          .getTextFieldByName("TID_SETTINGS_CONSENT_CHOICES")
          ?.removeFromParent();
      },
    });
  }
}

exports.SettingsScreen = SettingsScreen;
