// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { StringTable } = require("../../text/StringTable");
const { GameButton } = require("../GameButton");
const { LogicCharacterData } = require("../../../logic/data/LogicCharacterData");
const { Config } = require("../../../../../suitcase/config/Config");
const { Stage } = require("../../../../titan/client/common/flash/Stage");
const { Localisation } = require("../../../../../suitcase/localisation/Localisation");
const { GUIContainer } = require("../../../../titan/client/common/flash/GUIContainer");
const { GUI } = require("../GUI");
const { SkinMenuPopup } = require("../../../../../suitcase/modmenu/gatcha/SkinMenu");
const { SkinSelector } = require("../../../../../suitcase/feature/SkinSelector");
const { Logcat } = require("../../../../../suitcase/debug/Logcat");

const HeroScreenPopup_ctor = Libg.offset(10055004, 9459548);

class SkinSelectorPopup {
  static skinSelectorButtonX = 460;
  static skinSelectorButtonY = 42;

  static patch() {
    Interceptor.attach(HeroScreenPopup_ctor, {
      onEnter(args) {
        this.popup = new GUIContainer(args[0]);
        this.character = new LogicCharacterData(args[1]);
        SkinSelectorPopup.selectedCharacter = this.character;
      },
      onLeave() {
        try {
          const clip = StringTable.getMovieClip("sc/ui.sc", "player_name_color_entry");
          const button = new GameButton();
          button.setCustomButtonListener(
            SkinSelectorPopup.buttonPressed.bind(this),
            "open_own_skin_changer_button",
          );
          button.setMovieClip(clip, 1);
          const characterName = this.character.getName();
          clip.gotoAndStopFrameIndex(+!Config.config.SkinOverrides.hasOwnProperty(characterName));
          const label = clip.getTextFieldByName("label_txt");
          label.fontOutline = true;
          label.setTextScaleIfNecessary(Localisation.getString("SkinChanger"));
          button.x = SkinSelectorPopup.skinSelectorButtonX;
          button.y = Stage.getMatrixY() - SkinSelectorPopup.skinSelectorButtonY;
          this.popup.addChild(button);
        } catch (error) {
          Logcat.logError(
            `SkinSelectorPopup button error: ${error.stack || error.message || error}`,
          );
        }
      },
    });
  }

  static buttonPressed(_button, _event) {
    if (!SkinSelector.isAvailable()) {
      return GUI.showFloaterTextAtDefaultPosition(Localisation.getString("SkinChangerWIP"));
    }
    GUI.showPopup(new SkinMenuPopup(this.selectedCharacter, true), true, false, true);
  }
}

module.exports = { SkinSelectorPopup };
