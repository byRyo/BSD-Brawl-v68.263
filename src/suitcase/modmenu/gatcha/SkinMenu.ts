// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkinMenuPopup = void 0;
const { ListContainerPopup } = require("../../flash/popup/ListContainerPopup");
const { Localisation } = require("../../localisation/Localisation");
const { StringTable } = require("../../../laser/client/game/text/StringTable");
const { LogicDataTables } = require("../../../laser/client/logic/data/LogicDataTables");
const { SkinItem } = require("../../flash/popup/button/SkinItem");
const { CustomButton } = require("../../../laser/titan/client/common/flash/CustomButton");
const { HomeScreen } = require("../../../laser/client/game/screen/home/HomeScreen");
const { Config } = require("../../config/Config");
const { GUI } = require("../../../laser/client/game/gui/GUI");
const { SelectedSkinPreviewPopup } = require("../SelectedSkinPreviewPopup");
class SkinMenuPopup extends ListContainerPopup {
  constructor(character, isForSkinChanger) {
    super({
      Title: Localisation.getString("SkinsOfSelectedCharacterPopupTitle").replace(
        "{characterName}",
        StringTable.getString(character.getTID()),
      ),
    });
    this.skinButtonMap = new Map();
    this.adjustPopupHeaderButtons("skin_menu");
    this.character = character;
    this.isForSkinChanger = isForSkinChanger;
    this.refreshItems();
  }
  refreshItems() {
    this.container.clearEntries();
    const table = LogicDataTables.getTable(LogicDataTables.table.Skins);
    const count = table.getItemCount();
    for (let i = 0; i < count; i++) {
      const skin = table.getItemAt(i);
      if (!skin || skin.getTID() == "") continue;
      const conf = skin.getConf();
      if (!conf) continue;
      const character = conf.getCharacter();
      if (!character || character.getName() !== this.character.getName()) continue;
      let selected = false;
      if (
        this.isForSkinChanger &&
        Config.config.SkinOverrides.hasOwnProperty(character.getName()) &&
        Config.config.SkinOverrides[character.getName()] === skin.getName()
      )
        selected = true;
      const item = new SkinItem(skin, selected);
      const id = "skin_button_".concat(i.toString());
      this.skinButtonMap.set(id, skin);
      item.setCustomButtonListener(this.buttonPressed.bind(this), id);
      this.container.addEntry(item);
    }
    const height = this.getNaviHeight();
    this.container.refreshEntryPositions(4, height, 2, 0, 0, 0, -1);
    this.container.refreshBounds(height);
  }
  buttonPressed(_button, instance) {
    const key = [...this.skinButtonMap.keys()].find((key) =>
      CustomButton._buttonMap.get(key)?.instance.equals(instance),
    );
    const skin = key ? this.skinButtonMap.get(key) : null;
    if (!skin) return;
    const character = skin.getConf().getCharacter();
    if (this.isForSkinChanger)
      GUI.showPopup(new SelectedSkinPreviewPopup(this, skin), true, false, true);
    else HomeScreen.doOfflineGatcha(0, character, skin);
  }
}
exports.SkinMenuPopup = SkinMenuPopup;