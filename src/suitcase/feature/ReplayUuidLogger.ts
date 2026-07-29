// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplayUuidLogger = void 0;
const Libc_1 = require("../../lib/Libc");
const Logcat_1 = require("../debug/Logcat");
const AllianceManager_1 = require("../../laser/client/game/screen/home/alliance/AllianceManager");
const ReplayUuid_1 = require("./ReplayUuid");
const UUID_SIZE = 16;
class ReplayUuidLogger {
  static patch() {
    Interceptor.attach(AllianceManager_1.AllianceManager.doStartReplayAddr, {
      onEnter(args) {
        try {
          ReplayUuidLogger.captureRawUuid(args[1], args[2]);
          const uuid = ReplayUuid_1.ReplayUuid.toFormatted(ReplayUuidLogger.rawUuid);
          ReplayUuidLogger.lastCapturedUuid = uuid;
          Logcat_1.Logcat.logDebug("[REPLAY_UUID] ".concat(uuid));
        } catch (error) {
          Logcat_1.Logcat.logDebug("[REPLAY_UUID] error: ".concat(error.message || error));
        }
      },
    });
  }
  static getLastCapturedUuid() {
    return this.lastCapturedUuid;
  }
  static getLastRawUuid() {
    return this.hasRawUuid ? this.rawUuid : null;
  }
  static captureRawUuid(low, high) {
    this.rawUuid.writePointer(low);
    this.rawUuid.add(8).writePointer(high);
    this.hasRawUuid = true;
  }
}
exports.ReplayUuidLogger = ReplayUuidLogger;
ReplayUuidLogger.lastCapturedUuid = null;
ReplayUuidLogger.hasRawUuid = false;
ReplayUuidLogger.rawUuid = Libc_1.Libc.malloc(UUID_SIZE);
