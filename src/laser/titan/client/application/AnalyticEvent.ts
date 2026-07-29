// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { Logcat } = require("../../../../suitcase/debug/Logcat");
const { StringObject } = require("../native/StringObject");
const { Config } = require("../../../../suitcase/config/Config");
const { ModProperties } = require("../../../../suitcase/config/ModProperties");
const { EDebugger } = require("../../../../suitcase/debug/EDebugger");

const analyticEventHook = Libg.offset(12421336, 11331680);

class AnalyticEvent {
  static patch() {
    Interceptor.attach(analyticEventHook, {
      onEnter(args) {
        if (
          Config.config.ShowLaserLogs &&
          Config.useDebugLoggingVersions.includes(ModProperties.environment)
        ) {
          const message = StringObject.read(args[2]);
          if (message === "") return;
          EDebugger.addMessage(EDebugger.LASER, message);
          Logcat.logInfo(message);
        }
      },
    });
  }
}

exports.AnalyticEvent = AnalyticEvent;
