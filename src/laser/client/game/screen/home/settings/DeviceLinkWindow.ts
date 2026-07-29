// @ts-nocheck
const { Libg } = require("../../../../../../lib/Libg");
const { Libc } = require("../../../../../../lib/Libc");
const { PopupBase } = require("../../../../../titan/client/common/flash/PopupBase");
const { GUI } = require("../../../gui/GUI");

const deviceLinkWindowCtor = new NativeFunction(Libg.offset(5274388, 5381768), "void", [
  "pointer",
  "bool",
  "bool",
]);
const allocationSize = 480;

class DeviceLinkWindow extends PopupBase {
  constructor() {
    const instance = Libc.calloc(allocationSize, 1);
    deviceLinkWindowCtor(instance, true, true);
    super(instance);
  }

  static show() {
    const popup = new DeviceLinkWindow();
    GUI.showPopup(popup.instance, true, false, true);
  }
}

exports.DeviceLinkWindow = DeviceLinkWindow;
