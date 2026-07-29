// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Libc } = require("../../../../../lib/Libc");
const { GenericPopup } = require("../../../../titan/client/common/flash/GenericPopup");
const { GUI } = require("../GUI");
const FirstGearTutorialPopup_ctor = new NativeFunction(Libg.offset(7361296, 7166184), "void", [
  "pointer",
  "pointer",
]);
class FirstGearTutorialPopup extends GenericPopup {
  static allocationSize = 440;
  constructor(data) {
    const instance = Libc.calloc(FirstGearTutorialPopup.allocationSize, 1);
    FirstGearTutorialPopup_ctor(instance, data.instance);
    super(instance);
  }
  static show(data) {
    const popup = new FirstGearTutorialPopup(data);
    GUI.showPopup(popup.instance, false, false, false);
  }
}
module.exports = { FirstGearTutorialPopup };
