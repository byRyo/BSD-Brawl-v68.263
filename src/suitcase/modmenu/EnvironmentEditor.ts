// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentEditorPopup = void 0;
const { ListContainerPopup } = require("../flash/popup/ListContainerPopup");
const { Localisation } = require("../localisation/Localisation");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { EnvironmentEditorItem } = require("../flash/popup/button/EnvironmentEditorItem");
const { FogSelectorPopup } = require("./FogSelector");
const { KillEffectTypePopup } = require("./KillEffectType");

class EnvironmentEditorPopup extends ListContainerPopup {
  constructor() {
    super({ Title: Localisation.getString("EnvironmentEditorPopup") });
    this.adjustPopupHeaderButtons("environment_popup");
    this.refreshItems();
  }
  refreshItems() {
    this.container.clearEntries();
    for (const element of EnvironmentEditorPopup.ELEMENTS) {
      if (element.disabled) continue;
      const item = new EnvironmentEditorItem(element);
      item.setCustomButtonListener(
        EnvironmentEditorPopup.buttonPressed,
        "element_".concat(element.id, "_button"),
      );
      item.id = element.id;
      this.container.addEntry(item);
    }
    const height = this.getNaviHeight();
    this.container.refreshEntryPositions(true, 2.5 * height, false, false, false, false, -1);
    this.container.refreshBounds(height);
  }
  static buttonPressed(_button, movieClip) {
    const button = new GameButton(movieClip);
    EnvironmentEditorPopup.ELEMENTS[button.id].callback();
  }
  static openFogSelectorPopup() {
    GUI.showPopup(new FogSelectorPopup(), true, true, false);
  }
  static openKillEffectSelectorPopup() {
    GUI.showPopup(new KillEffectTypePopup(), true, true, false);
  }
}
EnvironmentEditorPopup.ELEMENTS = [
  {
    name: "FogSelector",
    id: 0,
    disabled: false,
    callback: EnvironmentEditorPopup.openFogSelectorPopup,
  },
  {
    name: "KillEffectSelector",
    id: 1,
    disabled: false,
    callback: EnvironmentEditorPopup.openKillEffectSelectorPopup,
  },
];
exports.EnvironmentEditorPopup = EnvironmentEditorPopup;
