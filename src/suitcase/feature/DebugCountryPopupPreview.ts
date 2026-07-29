// @ts-nocheck
const { GUI } = require("../../laser/client/game/gui/GUI");
const { PlayerCountryPopup } = require("../../laser/client/game/gui/popup/PlayerCountryPopup");
class DebugCountryPopupPreview {
  static show() {
    GUI.showPopup(new PlayerCountryPopup().instance, true, false, false);
  }
}
exports.DebugCountryPopupPreview = DebugCountryPopupPreview;
