// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { GameMain } = require("../../../client/GameMain");

const getJniEnvNative = new NativeFunction(Libg.offset(18451224, 0), "pointer", []);
const findClassNative = new NativeFunction(Libg.offset(18451476, 0), "pointer", ["pointer"]);
const activityAddress = Libg.offset(19968400, 0);
const findClassIndex = 113;
const callStaticObjectMethodVIndex = 141;
const callVoidMethodIndex = 167;

class SafeJNI {
  static getJniEnv() {
    return getJniEnvNative();
  }

  static getActivity() {
    return activityAddress.readPointer();
  }

  static findClass(name) {
    return findClassNative(Memory.allocUtf8String(name));
  }

  static isAvailable() {
    if (Process.platform === "darwin") return false;
    const env = this.getJniEnv();
    if (!GameMain.isJniReady || env.isNull()) return false;
    const table = env.readPointer();
    if (table.isNull()) return false;
    return !table
      .add(4 * Process.pointerSize)
      .readPointer()
      .isNull();
  }

  static callStaticObjectMethodV(clazz, methodId, signature) {
    const env = this.getJniEnv();
    const native = new NativeFunction(
      env
        .readPointer()
        .add(findClassIndex * Process.pointerSize)
        .readPointer(),
      "pointer",
      ["pointer", "pointer", "pointer", "pointer"],
    );
    return native(env, clazz, Memory.allocUtf8String(methodId), Memory.allocUtf8String(signature));
  }

  static callVoidMethod(object, methodId, argument, signature) {
    const env = this.getJniEnv();
    const activity = this.getActivity();
    const native = new NativeFunction(
      env
        .readPointer()
        .add(callStaticObjectMethodVIndex * Process.pointerSize)
        .readPointer(),
      "void",
      ["pointer", "pointer", "pointer", "pointer", "pointer", "pointer"],
    );
    native(env, object, methodId, activity, argument, signature);
  }

  static newStringUTF(value) {
    const env = this.getJniEnv();
    const native = new NativeFunction(
      env
        .readPointer()
        .add(callVoidMethodIndex * Process.pointerSize)
        .readPointer(),
      "pointer",
      ["pointer", "pointer"],
    );
    return native(env, Memory.allocUtf8String(value));
  }
}

exports.SafeJNI = SafeJNI;
