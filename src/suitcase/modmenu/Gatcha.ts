// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatchaPopup = void 0;
const { ListContainerPopup } = require("../flash/popup/ListContainerPopup");
const { Localisation } = require("../localisation/Localisation");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { BrawlerMenuPopup } = require("./gatcha/BrawlerMenu");
const { HomeMode } = require("../../laser/client/game/state/homemode/HomeMode");
const { GatchaItem } = require("../flash/popup/button/GatchaItem");
const { HomeScreen } = require("../../laser/client/game/screen/home/HomeScreen");

class GatchaPopup extends ListContainerPopup {
  constructor() {
    super({ Title: Localisation.getString("GatchaPopupTitle") });
    this.adjustPopupHeaderButtons("gatcha");
    this.refreshItems();
  }
  refreshItems() {
    this.container.clearEntries();
    for (const [id, entry] of GatchaPopup.gatchaPopupItemsArray.entries()) {
      if (entry.disabled) continue;
      const item = new GatchaItem(entry);
      item.setCustomButtonListener(
        this.buttonPressed.bind(this),
        "gatcha_".concat(Localisation.getString(entry.name)),
      );
      item.id = id;
      this.container.addEntry(item);
    }
    const height = this.getNaviHeight();
    this.container.refreshEntryPositions(3, height, 8, false, false, false, -1);
    this.container.refreshBounds(height);
  }
  buttonPressed(_button, movieClip) {
    const entry = GatchaPopup.gatchaPopupItemsArray[new GameButton(movieClip).id];
    const { callback, gatchaType } = entry;
    if (callback) callback(gatchaType);
    else HomeScreen.doOfflineGatcha(gatchaType);
  }
  static openBrawlerMenuPopup(type) {
    GUI.showPopup(new BrawlerMenuPopup(false, type), true, true, false);
  }
  static openSkinMenuPopup() {
    GUI.showPopup(new BrawlerMenuPopup(true, HomeMode.gatchaType.Skin), true, true, false);
  }
}
GatchaPopup.gatchaPopupItemsArray = [
  {
    name: "BrawlerMenuPopup",
    callback: GatchaPopup.openBrawlerMenuPopup,
    gatchaType: HomeMode.gatchaType.Character,
  },
  {
    name: "SkinMenuPopup",
    callback: GatchaPopup.openSkinMenuPopup,
    gatchaType: HomeMode.gatchaType.Skin,
  },
  {
    name: "GadgetMenuPopup",
    callback: GatchaPopup.openBrawlerMenuPopup,
    gatchaType: HomeMode.gatchaType.Gadget,
  },
  {
    name: "StarPowerMenuPopup",
    callback: GatchaPopup.openBrawlerMenuPopup,
    gatchaType: HomeMode.gatchaType.StarPower,
  },
  {
    name: "HyperchargeMenuPopup",
    callback: GatchaPopup.openBrawlerMenuPopup,
    gatchaType: HomeMode.gatchaType.Hypercharge,
  },
  { name: "PrestigeMenuPopup", callback: GatchaPopup.openBrawlerMenuPopup, gatchaType: -1 },
  { name: "CoinsGatcha", gatchaType: HomeMode.gatchaType.Coins },
  { name: "TokenDoublersGatcha", gatchaType: HomeMode.gatchaType.TokenDoublers },
  { name: "PlayerIconGatcha", gatchaType: HomeMode.gatchaType.PlayerIcon },
  { name: "BoxGatcha", gatchaType: HomeMode.gatchaType.Box },
];
exports.GatchaPopup = GatchaPopup;
