// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { StringObject } = require("../../../titan/client/native/StringObject");

const instanceAddress = Libg.offset(19846992, 18155656);
const logOutNative = new NativeFunction(Libg.offset(8693464, 8302448), "void", ["pointer"]);
const logOutAllNative = new NativeFunction(Libg.offset(8693552, 8302536), "void", ["pointer"]);
const initNative = new NativeFunction(Libg.offset(8677492, 8290172), "void", ["pointer"]);
const debugClearAllDataNative = new NativeFunction(Libg.offset(8684768, 11911576), "void", [
  "pointer",
  "pointer",
]);
const setEnvironmentNative = new NativeFunction(Libg.offset(15824008, 11903992), "void", [
  "pointer",
  "pointer",
]);
const forceProdAddress = Libg.offset(19847000, 18155664);
const scidConfigOffset = LogicMemory.offset(32);

class GameSCIDManager {
  static getInstance() {
    return instanceAddress.readPointer();
  }
  static getSCIDConfig() {
    const instance = this.getInstance();
    return instance.isNull() ? NULL : instance.add(scidConfigOffset).readPointer();
  }
  static logOut() {
    const instance = this.getInstance();
    if (!instance.isNull()) logOutNative(instance);
  }
  static logOutFromAllDevices() {
    const instance = this.getInstance();
    if (!instance.isNull()) logOutAllNative(instance);
  }
  static init() {
    const instance = this.getInstance();
    if (!instance.isNull()) initNative(instance);
  }
  static debugClearAllData(value) {
    const instance = this.getInstance();
    if (!instance.isNull()) debugClearAllDataNative(instance, value);
  }
  static isForceProd() {
    return forceProdAddress.readU8() !== 0;
  }
  static setForceProd(value) {
    forceProdAddress.writeU8(value ? 1 : 0);
  }
  static setEnvironment(environment) {
    const instance = this.getInstance();
    if (!instance.isNull()) {
      StringObject.with(environment, (value) => setEnvironmentNative(instance, value));
    }
  }
}

exports.GameSCIDManager = GameSCIDManager;
