// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { StringObject } = require("../native/StringObject");
const { Config } = require("../../../../suitcase/config/Config");
const { ModProperties } = require("../../../../suitcase/config/ModProperties");
const { Logcat } = require("../../../../suitcase/debug/Logcat");
const { Breadcrumbs } = require("../../../../suitcase/debug/Breadcrumbs");
const { EDebugger } = require("../../../../suitcase/debug/EDebugger");

const debuggerHook = Libg.offset(13603792, 12717732);

class Debugger {
  static patch() {
    Interceptor.attach(debuggerHook, {
      onEnter(args) {
        const message = StringObject.read(args[0]);
        if (
          message !== "" &&
          (Breadcrumbs.push(message),
          Config.useDebugLoggingVersions.includes(ModProperties.environment))
        ) {
          EDebugger.addMessage(EDebugger.ERROR, message);
          Logcat.logError(message);
        }
      },
    });
  }
}

exports.Debugger = Debugger;
