// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Libc } = require("../../../../../lib/Libc");
const { PopupBase } = require("../../../../titan/client/common/flash/PopupBase");
const { GUI } = require("../GUI");

const UnlockAccountMenu_ctor = new NativeFunction(Libg.offset(8387976, 8055956), "void", [
  "pointer",
]);

class UnlockAccountMenu extends PopupBase {
  static allocationSize = 472;
  constructor() {
    const instance = Libc.calloc(UnlockAccountMenu.allocationSize, 1);
    UnlockAccountMenu_ctor(instance);
    super(instance);
  }
  static show() {
    const popup = new UnlockAccountMenu();
    GUI.showPopup(popup.instance, true, false, true);
  }
}
module.exports = { UnlockAccountMenu };
