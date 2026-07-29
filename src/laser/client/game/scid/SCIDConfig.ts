// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { StringObject } = require("../../../titan/client/native/StringObject");
const { Logcat } = require("../../../../suitcase/debug/Logcat");

const setStringAddress = Libg.offset(15821004, 11901020);
const setStringNative = new NativeFunction(setStringAddress, "void", [
  "pointer",
  "pointer",
  "pointer",
]);

class SCIDConfig {
  constructor(instance) {
    this.instance = instance;
  }
  isNull() {
    return this.instance.isNull();
  }
  setString(key, value) {
    StringObject.withMany([key, value], ([nativeKey, nativeValue]) => {
      setStringNative(this.instance, nativeKey, nativeValue);
    });
  }
  setUrl(value) {
    this.setString("Url", value);
  }
  static patch() {
    Interceptor.attach(setStringAddress, {
      onEnter(args) {
        try {
          const key = StringObject.read(args[1]);
          const value = StringObject.read(args[2]);
          Logcat.logDebug("[SCIDConfig] ".concat(key, " = ", value));
        } catch (_) {}
      },
    });
  }
}

exports.SCIDConfig = SCIDConfig;
