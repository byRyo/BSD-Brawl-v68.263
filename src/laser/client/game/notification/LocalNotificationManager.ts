// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const refresh = new NativeFunction(Libg.offset(8513628, 8145172), "void", ["pointer"]);
const instance = Libg.offset(19846296, 1134715),
  forceFlag = LogicMemory.offset(24, 48);
const RESET = -1,
  ACTIVE = 0,
  ALL = 1;
class LocalNotificationManager {
  static getInstance() {
    return instance.readPointer();
  }
  static forceActiveNotifications() {
    this.setForceFlag(ACTIVE);
  }
  static forceAllNotifications() {
    this.setForceFlag(ALL);
  }
  static resetForcedNotifications() {
    this.setForceFlag(RESET);
  }
  static setForceFlag(flag) {
    const value = this.getInstance();
    if (!value.isNull()) {
      value.add(forceFlag).writeInt(flag);
      refresh(value);
    }
  }
}
exports.LocalNotificationManager = LocalNotificationManager;
