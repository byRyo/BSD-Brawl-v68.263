// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectedSkinPreviewPopup = void 0;
const {
  PreviewBrawlerOrSkinRewardPopup,
} = require("../../laser/client/game/gui/popup/PreviewBrawlerOrSkinRewardPopup");
const { StringTable } = require("../../laser/client/game/text/StringTable");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { LogicMemory } = require("../logic/LogicMemory");
const { Localisation } = require("../localisation/Localisation");
const { Config } = require("../config/Config");
const { GUIContainer } = require("../../laser/titan/client/common/flash/GUIContainer");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { HomePage } = require("../../laser/client/game/screen/home/homepage/HomePage");
const { FileManager } = require("../filesystem/FileManager");
const { HeroScreenPopup } = require("../../laser/client/game/gui/popup/HeroScreenPopup");
const { LogicDailyData } = require("../../laser/client/logic/data/LogicDailyData");
const { HomeMode } = require("../../laser/client/game/state/homemode/HomeMode");
const { LogicHomeMode } = require("../../laser/client/logic/mode/LogicHomeMode");
const TITLE_OFFSET = LogicMemory.offset(416);
class SelectedSkinPreviewPopup extends PreviewBrawlerOrSkinRewardPopup {
  constructor(skinMenuPopup, skin) {
    super(skin);
    this.isSkinAlreadySelected = false;
    this.skin = skin;
    this.skinMenuPopup = skinMenuPopup;
    GUIContainer.getTextField(
      this.instance.add(TITLE_OFFSET).readPointer(),
      "TID_SHOP_SPECIAL_OFFER",
      Localisation.getString("SelectedSkinPreviewPopupTitle"),
    );
    const popup = this.getMovieClip();
    popup.getMovieClipByName("purchase_info").visibility = false;
    popup.getMovieClipByName("unlock_info").visibility = false;
    const button = new GameButton();
    const clip = StringTable.getMovieClip("sc/ui.sc", "country_item");
    button.setMovieClip(clip, true);
    button.setCustomButtonListener(this.buttonPressed.bind(this), "color_picker_preview_button");
    const skinName = skin.getName();
    const characterName = skin.getConf().getCharacter().getName();
    this.isSkinAlreadySelected = Config.config.SkinOverrides[characterName] === skinName;
    const text = Localisation.getString(
      this.isSkinAlreadySelected ? "SkinChangerUnselectButton" : "SkinChangerSelectButton",
    );
    const label = clip.getTextFieldByName("Text");
    label.colorTag = true;
    label.setTextScaleIfNecessary(text);
    clip.gotoAndStopFrameIndex(1);
    button.setXY(285, 220);
    popup.addChild(button);
  }
  buttonPressed() {
    const displayName = StringTable.getString(this.skin.getTID());
    for (const skin of [this.skin, this.skin.getPetSkin(), this.skin.getPetSkin2()]) {
      if (!skin) continue;
      const characterName = skin.getConf().getCharacter().getName();
      if (this.isSkinAlreadySelected) {
        if (Config.config.SkinOverrides[characterName])
          delete Config.config.SkinOverrides[characterName];
      } else Config.config.SkinOverrides[characterName] = skin.getName();
    }
    if (this.isSkinAlreadySelected) {
      const character = this.skin.getCharacter();
      if (character)
        this.skin = LogicDailyData.getSkin(
          HomeMode.getPlayerData(),
          LogicHomeMode.getPlayerAvatar(),
          character,
        );
    }
    GUI.showFloaterTextAtDefaultPosition(
      Localisation.getString(
        this.isSkinAlreadySelected ? "SkinChangerSkinUnselected" : "SkinChangerSkinSelected",
      ).replace("{skinName}", displayName),
    );
    const hero = HeroScreenPopup.getInstance();
    if (hero) hero.skinChanged(this.skin);
    HomePage.reload();
    FileManager.updateConfigFile();
    this.backButtonPressed(NULL, NULL);
    this.skinMenuPopup.closeButtonPressed(NULL, NULL);
  }
}
exports.SelectedSkinPreviewPopup = SelectedSkinPreviewPopup;
