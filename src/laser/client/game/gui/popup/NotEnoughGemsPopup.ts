// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Libc } = require("../../../../../lib/Libc");
const { GenericPopup } = require("../../../../titan/client/common/flash/GenericPopup");
const { GUI } = require("../GUI");
const NotEnoughGemsPopup_ctor = new NativeFunction(Libg.offset(7549096, 7336032), "void", [
  "pointer",
  "int",
]);
class NotEnoughGemsPopup extends GenericPopup {
  static allocationSize = 448;
  constructor(amount) {
    const instance = Libc.calloc(NotEnoughGemsPopup.allocationSize, 1);
    NotEnoughGemsPopup_ctor(instance, amount);
    super(instance);
  }
  static show(amount = 0) {
    const popup = new NotEnoughGemsPopup(amount);
    GUI.showPopup(popup.instance, true, false, true);
  }
}
module.exports = { NotEnoughGemsPopup };
