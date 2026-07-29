// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Libc } = require("../../../../../lib/Libc");
const { GenericPopup } = require("../../../../titan/client/common/flash/GenericPopup");
const { GUI } = require("../GUI");
const InviteFriendWithCodePopup_ctor = new NativeFunction(Libg.offset(7400040, 7202104), "void", [
  "pointer",
]);
class InviteFriendWithCodePopup extends GenericPopup {
  static allocationSize = 464;
  constructor() {
    const instance = Libc.calloc(InviteFriendWithCodePopup.allocationSize, 1);
    InviteFriendWithCodePopup_ctor(instance);
    super(instance);
  }
  static show() {
    const popup = new InviteFriendWithCodePopup();
    GUI.showPopup(popup.instance, true, false, true);
  }
}
module.exports = { InviteFriendWithCodePopup };
