// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Libc } = require("../../../../../lib/Libc");
const { GenericPopup } = require("../../../../titan/client/common/flash/GenericPopup");
const { GUI } = require("../GUI");
const EsportTournamentsPopup_ctor = new NativeFunction(Libg.offset(7337036, 7141996), "void", [
  "pointer",
]);
class EsportTournamentsPopup extends GenericPopup {
  static allocationSize = 432;
  constructor() {
    const instance = Libc.calloc(EsportTournamentsPopup.allocationSize, 1);
    EsportTournamentsPopup_ctor(instance);
    super(instance);
  }
  static show() {
    const popup = new EsportTournamentsPopup();
    GUI.showPopup(popup.instance, false, false, false);
  }
}
module.exports = { EsportTournamentsPopup };
