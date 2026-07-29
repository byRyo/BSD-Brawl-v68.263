// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Libc } = require("../../../../../lib/Libc");
const { GenericPopup } = require("../../../../titan/client/common/flash/GenericPopup");
const FameLevelUpPopup_ctor = new NativeFunction(Libg.offset(7353472, 7159480), "void", [
  "pointer",
  "uint",
  "int",
]);
class FameLevelUpPopup extends GenericPopup {
  static allocationSize = 536;
  constructor(level, points) {
    const instance = Libc.calloc(FameLevelUpPopup.allocationSize, 1);
    FameLevelUpPopup_ctor(instance, level, points);
    super(instance);
  }
}
module.exports = { FameLevelUpPopup };
