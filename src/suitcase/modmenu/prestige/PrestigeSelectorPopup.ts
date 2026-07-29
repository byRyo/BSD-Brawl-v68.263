// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrestigeSelectorPopup = void 0;
const { GameButton } = require("../../../laser/client/game/gui/GameButton");
const {
  PrestigeLevelUpPopup,
} = require("../../../laser/client/game/gui/popup/PrestigeLevelUpPopup");
const { UniItem } = require("../../flash/popup/button/UniItem");
const { ListContainerPopup } = require("../../flash/popup/ListContainerPopup");
const { Localisation } = require("../../localisation/Localisation");
class PrestigeSelectorPopup extends ListContainerPopup {
  constructor(character) {
    super({ Title: Localisation.getString("PrestigeMenuPopupTitle") });
    this.character = character;
    this.adjustPopupHeaderButtons("prestige_selector");
    this.refreshItems();
  }
  refreshItems() {
    this.container.clearEntries();
    let i = 0;
    for (const type of PrestigeSelectorPopup.PRESTIGE_TYPE) {
      const item = new UniItem(type.name);
      item.setCustomButtonListener(this.buttonClicked.bind(this), "particleStyle_".concat(i));
      item.id = i;
      item.setText(Localisation.getString("Prestige").replace("{int}", type.level.toString()));
      this.container.addEntry(item);
      i++;
    }
    const height = this.getNaviHeight();
    this.container.refreshEntryPositions(1, 2.5 * height, 0, 0, 0, 0, -1);
    this.container.refreshBounds(height);
  }
  buttonClicked(_button, instance) {
    const level = new GameButton(instance).id + 1;
    PrestigeLevelUpPopup.prestigeUp(this.character, level);
  }
}
exports.PrestigeSelectorPopup = PrestigeSelectorPopup;
PrestigeSelectorPopup.PRESTIGE_TYPE = [
  { name: "Prestige", level: 1 },
  { name: "Prestige", level: 2 },
  { name: "Prestige", level: 3 },
];
