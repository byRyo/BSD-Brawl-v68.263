// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.FogSelectorPopup = void 0;
const { ListContainerPopup } = require("../flash/popup/ListContainerPopup");
const { Localisation } = require("../localisation/Localisation");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { FogItem } = require("../flash/popup/button/FogItem");
const { Config } = require("../config/Config");
const { FileManager } = require("../filesystem/FileManager");
const { LogicDataTables } = require("../../laser/client/logic/data/LogicDataTables");

class FogSelectorPopup extends ListContainerPopup {
  constructor() {
    super({ Title: Localisation.getString("FogSelectorPopup") });
    this.adjustPopupHeaderButtons("fog_popup");
    this.refreshItems();
  }
  refreshItems() {
    this.container.clearEntries();
    for (const fog of FogSelectorPopup.FOG_TYPE) {
      if (fog.disabled) continue;
      if (fog.name === "FogReset" && Config.config.FogType === "") continue;
      const effect = LogicDataTables.getEffectByName(fog.effect_name);
      if (!effect || effect.instance.isNull()) continue;
      const item = new FogItem(fog);
      item.setCustomButtonListener(this.buttonClicked.bind(this), "fog_".concat(fog.id, "_button"));
      item.id = fog.id;
      this.container.addEntry(item);
    }
    const height = this.getNaviHeight();
    this.container.refreshEntryPositions(3, height, 8, false, false, false, -1);
    this.container.refreshBounds(height);
  }
  buttonClicked(_button, movieClip) {
    const id = new GameButton(movieClip).id;
    const fog = FogSelectorPopup.FOG_TYPE.find((entry) => entry.id === id);
    if (fog) {
      Config.config.FogType = fog.effect_name;
      FileManager.updateConfigFile();
      this.fadeOut();
    }
  }
}
FogSelectorPopup.FOG_TYPE = [
  ["FogReset", 0, "", false],
  ["FogDefault", 1, "poison_fog", false],
  ["FogCN", 2, "poison_fog_cn", false],
  ["FogStrangerForest", 3, "poison_fog_stranger_forest", false],
  ["FogStrangerLair", 4, "poison_fog_stranger_lair", false],
  ["FogBSDWhiteClouds", 5, "bsd_white_clouds", false],
  ["FogBSDSmallDust", 6, "bsd_small_dust", false],
  ["FogBSDMagicClouds", 7, "bsd_magic_clouds", false],
  ["FogBSDOvercharge", 8, "bsd_overcharge", true],
].map(([name, id, effect_name, disabled]) => ({ name, id, disabled, effect_name }));
exports.FogSelectorPopup = FogSelectorPopup;
