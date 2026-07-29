// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputItemsPopup = void 0;
const { ListContainerPopup } = require("../flash/popup/ListContainerPopup");
const { Localisation } = require("../localisation/Localisation");
const { InputPopup, EInputPopupType } = require("./InputPopup");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { InputItem } = require("../flash/popup/button/InputItem");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { BSDPlusManager } = require("../validation/BSDPlusManager");
const { NativeDialog } = require("../../laser/titan/client/native/NativeDialog");
const { LogicTime } = require("../logic/LogicTime");

class InputItemsPopup extends ListContainerPopup {
  constructor() {
    super({ Title: Localisation.getString("InputItemsPopup") });
    this.ITEMS = [
      { name: "VisualNameChange", id: EInputPopupType.CHANGE_NAME },
      { name: "OpenPlayerProfile", id: EInputPopupType.OPEN_PROFILE },
      { name: "FollowPlayerByTag", id: EInputPopupType.FOLLOW_PLAYER, disabled: true },
      { name: "LinkBSDPlus", id: EInputPopupType.PLUS_LINK },
      {
        name: "BSDPlusState",
        disabled: true,
        callback: InputItemsPopup.getBSDPlusState,
        id: EInputPopupType.GET_BSD_PLUS_STATE,
      },
    ];
    this.adjustPopupHeaderButtons("input");
    this.refreshItems();
  }
  refreshItems() {
    this.container.clearEntries();
    for (const entry of this.ITEMS) {
      if (entry.disabled) continue;
      const item = new InputItem(entry);
      item.setCustomButtonListener(
        this.buttonPressed.bind(this),
        "".concat(entry.id, "_input_button"),
      );
      this.container.addEntry(item);
    }
    const height = this.getNaviHeight();
    this.container.refreshEntryPositions(true, 1.75 * height, 8, false, false, false, -1);
    this.container.refreshBounds(height);
  }
  buttonPressed(_button, movieClip) {
    const id = new GameButton(movieClip).id;
    const item = this.ITEMS.find((entry) => entry.id === id);
    if (item.callback) item.callback();
    else GUI.showPopup(new InputPopup(id), true, true, false);
  }
  static getBSDPlusState() {
    NativeDialog.show(
      "BSD+",
      BSDPlusManager.EXPIRES_TS
        ? "Expires/Истекает:\n".concat(LogicTime.timestampToDate(1000 * BSDPlusManager.EXPIRES_TS))
        : "No active subscription\nНет активной подписки",
      "OK",
      "",
      "",
    );
  }
}
exports.InputItemsPopup = InputItemsPopup;
