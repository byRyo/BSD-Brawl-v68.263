// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Libc } = require("../../../../../lib/Libc");
const { GenericPopup } = require("../../../../titan/client/common/flash/GenericPopup");
const { GUI } = require("../GUI");

const RANKED_POPUP_TYPE = 91;
const RankedSeasonEndPopup_ctor = new NativeFunction(Libg.offset(7756248, 7511720), "void", [
  "pointer",
  "pointer",
]);
const RankedSeasonEndPopup_init = new NativeFunction(Libg.offset(12659220, 11509264), "void", [
  "pointer",
  "int",
  "int",
  "int",
]);
const rankedSeasonEndValueOffset = 80;
const allocationSize = 584;

class RankedSeasonEndPopup extends GenericPopup {
  static allocationSize = allocationSize;
  constructor(data) {
    const instance = Libc.calloc(allocationSize, 1);
    RankedSeasonEndPopup_ctor(instance, data);
    super(instance);
  }
  static show(a = 30, b = 12, c = 11) {
    const instance = Libc.calloc(allocationSize, 1);
    RankedSeasonEndPopup_init(instance, a, b, c);
    const popup = new RankedSeasonEndPopup(instance);
    GUI.showPopup(popup.instance, true, false, true);
  }
}

module.exports = { RankedSeasonEndPopup, RANKED_POPUP_TYPE };
