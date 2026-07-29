// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.KillEffectTypePopup = void 0;
const { ListContainerPopup } = require("../flash/popup/ListContainerPopup");
const { Localisation } = require("../localisation/Localisation");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { KillEffectTypeItem } = require("../flash/popup/button/KillEffectTypeItem");
const { KillEffectSelectorPopup } = require("./KillEffectSelector");
const { GUI } = require("../../laser/client/game/gui/GUI");

class KillEffectTypePopup extends ListContainerPopup {
  constructor() {
    super({ Title: Localisation.getString("KillEffectTypePopup") });
    this.adjustPopupHeaderButtons("kill_effect_type_popup");
    this.refreshItems();
  }
  refreshItems() {
    this.container.clearEntries();
    let id = 0;
    for (const type of KillEffectTypePopup.KILL_EFFECT_TYPE) {
      const item = new KillEffectTypeItem(type);
      item.setCustomButtonListener(this.buttonClicked.bind(this), "killEffectType_".concat(id));
      item.id = id++;
      this.container.addEntry(item);
    }
    const height = this.getNaviHeight();
    this.container.refreshEntryPositions(true, 2.5 * height, false, false, false, false, -1);
    this.container.refreshBounds(height);
  }
  buttonClicked(_button, movieClip) {
    const id = new GameButton(movieClip).id;
    if (!KillEffectTypePopup.KILL_EFFECT_TYPE[id]) return;
    GUI.showPopup(new KillEffectSelectorPopup(id), true, true, false);
  }
}
KillEffectTypePopup.KILL_EFFECT_TYPE = [
  { name: "KillEffectTypeCommon" },
  { name: "KillEffectTypeCustom" },
];
exports.KillEffectTypePopup = KillEffectTypePopup;
