// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrestigeIntroPopupPreview = void 0;
const Libc_1 = require("../../lib/Libc");
const GUI_1 = require("../../laser/client/game/gui/GUI");
const RewardCompensationPopup_1 = require("../../laser/client/game/gui/popup/RewardCompensationPopup");
const PRESTIGE_NOTIFICATION_SIZE = 64;
const PRESTIGE_COUNT_OFFSET = 52;
const PRESTIGE_COUNT = 1;
const BUTTONS = ["button_ok", "button_close"];
class PrestigeIntroPopupPreview {
  static show() {
    const popup = new RewardCompensationPopup_1.RewardCompensationPopup(
      this.buildPrestigeNotification(),
    );
    this.routeAllButtonsToClose(popup);
    GUI_1.GUI.showPopup(popup.instance, true, false, true);
  }
  static buildPrestigeNotification() {
    const notification = Libc_1.Libc.calloc(PRESTIGE_NOTIFICATION_SIZE, 1);
    notification.add(PRESTIGE_COUNT_OFFSET).writeU32(PRESTIGE_COUNT);
    return notification;
  }
  static routeAllButtonsToClose(popup) {
    for (const name of BUTTONS)
      popup.addGameButton(name, true).setCustomButtonListener(() => popup.fadeOut());
  }
}
exports.PrestigeIntroPopupPreview = PrestigeIntroPopupPreview;
