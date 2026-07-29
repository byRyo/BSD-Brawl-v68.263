// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");

const validationAddress = Libg.offset(12305848, 11237788);
const restrictedAreaAddress = Libg.offset(12314892, 11245560);
const validationCallback = new NativeCallback(() => 0, "int", ["pointer", "pointer", "int", "int"]);
const restrictedAreaCallback = new NativeCallback(() => 0, "int", [
  "pointer",
  "int",
  "int",
  "int",
  "int",
  "uint",
]);

class LogicPlayerMapUtil {
  static setValidationBypassed(value) {
    if (value === this.validationBypassed) return;
    this.validationBypassed = value;
    value
      ? Interceptor.replace(validationAddress, validationCallback)
      : Interceptor.revert(validationAddress);
  }
  static isValidationBypassed() {
    return this.validationBypassed;
  }
  static setRestrictedAreaBypassed(value) {
    if (value === this.restrictedAreaBypassed) return;
    this.restrictedAreaBypassed = value;
    value
      ? Interceptor.replace(restrictedAreaAddress, restrictedAreaCallback)
      : Interceptor.revert(restrictedAreaAddress);
  }
  static isRestrictedAreaBypassed() {
    return this.restrictedAreaBypassed;
  }
}
LogicPlayerMapUtil.validationBypassed = false;
LogicPlayerMapUtil.restrictedAreaBypassed = false;
exports.LogicPlayerMapUtil = LogicPlayerMapUtil;
