// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplayStringIdLogger = void 0;
const ViewReplayByStringIdMessage_1 = require("../../laser/client/game/network/messaging/message/ViewReplayByStringIdMessage");
const StringObject_1 = require("../../laser/titan/client/native/StringObject");
const Logcat_1 = require("../debug/Logcat");
class ReplayStringIdLogger {
  static patch() {
    Interceptor.attach(
      ViewReplayByStringIdMessage_1.ViewReplayByStringIdMessage.constructorAddress,
      {
        onEnter(args) {
          try {
            const id = StringObject_1.StringObject.read(args[1]);
            ReplayStringIdLogger.lastCapturedStringId = id;
            Logcat_1.Logcat.logDebug("[REPLAY_STRING_ID] ".concat(id));
          } catch (error) {
            Logcat_1.Logcat.logDebug("[REPLAY_STRING_ID] error: ".concat(error.message || error));
          }
        },
      },
    );
  }
  static getLastCapturedStringId() {
    return this.lastCapturedStringId;
  }
}
exports.ReplayStringIdLogger = ReplayStringIdLogger;
ReplayStringIdLogger.lastCapturedStringId = null;
