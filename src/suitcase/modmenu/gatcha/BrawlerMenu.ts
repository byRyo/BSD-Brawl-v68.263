// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrawlerMenuPopup = void 0;
const { ListContainerPopup } = require("../../flash/popup/ListContainerPopup");
const { Localisation } = require("../../localisation/Localisation");
const { LogicDataTables } = require("../../../laser/client/logic/data/LogicDataTables");
const { BrawlerItem } = require("../../flash/popup/button/BrawlerItem");
const { GUI } = require("../../../laser/client/game/gui/GUI");
const { GameButton } = require("../../../laser/client/game/gui/GameButton");
const { SkinMenuPopup } = require("./SkinMenu");
const { HomeScreen } = require("../../../laser/client/game/screen/home/HomeScreen");
const { LogicClientAvatar } = require("../../../laser/client/logic/avatar/LogicClientAvatar");
const { HomeMode } = require("../../../laser/client/game/state/homemode/HomeMode");
const { LogInfo } = require("../../../..");
const { PrestigeSelectorPopup } = require("../prestige/PrestigeSelectorPopup");
class BrawlerMenuPopup extends ListContainerPopup {
  constructor(isForSkins = false, gatchaType, isForSkinChanger = false, onPick) {
    let title;
    if (gatchaType === HomeMode.gatchaType.Character)
      title = Localisation.getString("BrawlerMenuPopupTitle");
    else if (gatchaType === HomeMode.gatchaType.PowerPoints)
      title = Localisation.getString("PowerPointsMenuPopupTitle");
    else if (gatchaType === HomeMode.gatchaType.Gadget)
      title = Localisation.getString("GadgetMenuPopupTitle");
    else if (gatchaType === HomeMode.gatchaType.StarPower)
      title = Localisation.getString("StarPowerMenuPopupTitle");
    else if (gatchaType === HomeMode.gatchaType.Hypercharge)
      title = Localisation.getString("HyperchargeMenuPopupTitle");
    else if (gatchaType === -1) title = Localisation.getString("PrestigeMenuPopupTitle");
    super({ Title: title });
    this.adjustPopupHeaderButtons("brawler_menu");
    this.refreshItems();
    this.isForSkins = isForSkins;
    this.gatchaType = gatchaType;
    this.isForSkinChanger = isForSkinChanger;
    this.brawlerItemsCount = 0;
    this.onPick = onPick;
  }
  refreshItems() {
    this.container.clearEntries();
    const table = LogicDataTables.getTable(LogicDataTables.table.Characters);
    this.brawlerItemsCount = table.getItemCount();
    for (let i = 0; i < this.brawlerItemsCount; i++) {
      const character = table.getItemAt(i);
      const name = character.getName();
      if (
        !character.isDisabled() &&
        character.getTID() !== "" &&
        (character.isHero() || name === "Lightyear") &&
        ![
          "MechaDudeBig",
          "CannonGirlSmall",
          "Godzilla",
          "DiggerDrill",
          "GeishaTransformed",
        ].includes(name)
      ) {
        const item = new BrawlerItem(character);
        item.setCustomButtonListener(this.buttonPressed.bind(this));
        this.container.addEntry(item);
      }
    }
    const height = this.getNaviHeight();
    this.container.refreshEntryPositions(4, height, 2, 0, 0, 0, -1);
    this.container.refreshBounds(height);
  }
  buttonPressed(_button, instance) {
    const button = new GameButton(instance);
    const character = LogicDataTables.getTable(LogicDataTables.table.Characters).getItemAt(
      button.id,
    );
    if (this.onPick) {
      this.onPick(character);
      return;
    }
    if (this.isForSkins) {
      try {
        GUI.showPopup(new SkinMenuPopup(character, this.isForSkinChanger), true, true, false);
      } catch (error) {
        LogInfo(error.stack);
      }
      return;
    }
    const type = this.gatchaType;
    if (type === HomeMode.gatchaType.Character)
      HomeScreen.doOfflineGatcha(HomeMode.gatchaType.Character, character);
    else if (type === HomeMode.gatchaType.PowerPoints) {
      if (
        HomeMode.getPlayerAvatar().getHeroPower(character) !== LogicClientAvatar.maxHeroPowerPoints
      )
        HomeScreen.doOfflineGatcha(HomeMode.gatchaType.PowerPoints, character);
    } else if (type === HomeMode.gatchaType.Gadget)
      HomeScreen.doOfflineGatcha(HomeMode.gatchaType.Gadget, character);
    else if (type === HomeMode.gatchaType.StarPower)
      HomeScreen.doOfflineGatcha(HomeMode.gatchaType.StarPower, character);
    else if (type === HomeMode.gatchaType.Hypercharge)
      HomeScreen.doOfflineGatcha(HomeMode.gatchaType.Hypercharge, character);
    else if (type === -1) GUI.showPopup(new PrestigeSelectorPopup(character), true, true, false);
  }
}
exports.BrawlerMenuPopup = BrawlerMenuPopup;