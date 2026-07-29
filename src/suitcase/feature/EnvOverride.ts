// @ts-nocheck
const { Libg } = require("../../lib/Libg");
const { Logcat } = require("../debug/Logcat");
const environmentAddress = Libg.offset(19851124, 18157100);
class EnvOverride {
  static get current() {
    return environmentAddress.readS32();
  }
  static set(value) {
    environmentAddress.writeS32(value);
  }
  static isStage() {
    return this.current !== this.PROD_ENV;
  }
  static patch() {
    const before = environmentAddress.readS32();
    environmentAddress.writeS32(this.PROD_ENV);
    const after = environmentAddress.readS32();
    Logcat.logDebug(
      `[EnvOverride] dword_1235A1C@${environmentAddress} before=${before} target=${this.PROD_ENV} after=${after}`,
    );
  }
}
EnvOverride.PROD_ENV = 3;
EnvOverride.STAGE_ENV = 2;
exports.PROD_ENV = EnvOverride.PROD_ENV;
exports.STAGE_ENV = EnvOverride.STAGE_ENV;
exports.EnvOverride = EnvOverride;
