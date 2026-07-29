// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { PopupBase } = require("../../../../titan/client/common/flash/PopupBase");
const PrestigeLevelUpPopup_prestigeUp = new NativeFunction(Libg.offset(7599608, 7379424), "void", [
  "pointer",
  "int",
]);
class PrestigeLevelUpPopup extends PopupBase {
  static prestigeUp(popup, level) {
    PrestigeLevelUpPopup_prestigeUp(popup.instance, level);
  }
}
module.exports = { PrestigeLevelUpPopup };
