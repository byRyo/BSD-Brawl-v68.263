// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Libc } = require("../../../../../lib/Libc");
const { GenericPopup } = require("../../../../titan/client/common/flash/GenericPopup");
const { GUI } = require("../GUI");
const NotificationSettingsPopup_ctor = new NativeFunction(Libg.offset(7549688, 7336604), "void", [
  "pointer",
]);
class NotificationSettingsPopup extends GenericPopup {
  static allocationSize = 560;
  constructor() {
    const instance = Libc.calloc(NotificationSettingsPopup.allocationSize, 1);
    NotificationSettingsPopup_ctor(instance);
    super(instance);
  }
  static show() {
    const popup = new NotificationSettingsPopup();
    GUI.showPopup(popup.instance, true, false, true);
  }
}
module.exports = { NotificationSettingsPopup };
