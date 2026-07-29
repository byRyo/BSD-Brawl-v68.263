// @ts-nocheck
const { LogicData } = require("./LogicData");
const { Libg } = require("../../../../lib/Libg");
const { Config } = require("../../../../suitcase/config/Config");
const { Libc } = require("../../../../lib/Libc");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicArrayList } = require("./LogicArrayList");

const getShakeXNative = new NativeFunction(Libg.offset(11376528, 5588332), "int", ["pointer"]);
const getShakeYNative = new NativeFunction(Libg.offset(11376536, 6156468), "int", ["pointer"]);
const typeArrayOffset = LogicMemory.offset(88);
const layerArrayOffset = LogicMemory.offset(104);
const scaleArrayOffset = LogicMemory.offset(120);
const loopOffset = LogicMemory.offset(200);
const enemyVersionOffset = LogicMemory.offset(240);
const allocationSize = 264;

class LogicEffectData extends LogicData {
  getTypeArray() {
    return new LogicArrayList(this.instance.add(typeArrayOffset));
  }
  setTypeArray(value) {
    value.writeTo(this.instance.add(typeArrayOffset));
  }
  getLayerArray() {
    return new LogicArrayList(this.instance.add(layerArrayOffset));
  }
  setLayerArray(value) {
    value.writeTo(this.instance.add(layerArrayOffset));
  }
  getScaleArray() {
    return new LogicArrayList(this.instance.add(scaleArrayOffset));
  }
  setScaleArray(value) {
    value.writeTo(this.instance.add(scaleArrayOffset));
  }

  get loop() {
    return this.readBoolByte(loopOffset);
  }
  set loop(value) {
    this.instance.add(loopOffset).writeU8(+value);
  }

  get enemyVersion() {
    return this.readWrappedPointer(enemyVersionOffset, (instance) => new LogicEffectData(instance));
  }
  set enemyVersion(value) {
    this.writePointer(enemyVersionOffset, value.instance);
  }

  clone() {
    const instance = Libc.malloc(allocationSize);
    Memory.copy(instance, this.instance, allocationSize);
    return new LogicEffectData(instance);
  }

  static patch() {
    const firstDarwinCaller = Process.platform === "darwin" ? Libg.offset(0, 5389460) : null;
    Interceptor.replace(
      getShakeXNative,
      new NativeCallback(
        function (instance) {
          if (firstDarwinCaller && !firstDarwinCaller.equals(this.returnAddress)) {
            return getShakeXNative(instance);
          }
          if (Config.config.DisableShake) return 0;
          return getShakeXNative(instance);
        },
        "int",
        ["pointer"],
      ),
    );

    const secondDarwinCaller = Process.platform === "darwin" ? Libg.offset(0, 5389468) : null;
    Interceptor.replace(
      getShakeYNative,
      new NativeCallback(
        function (instance) {
          if (secondDarwinCaller && !secondDarwinCaller.equals(this.returnAddress)) {
            return getShakeYNative(instance);
          }
          if (Config.config.DisableShake) return 0;
          return getShakeYNative(instance);
        },
        "int",
        ["pointer"],
      ),
    );
  }
}

exports.LogicEffectData = LogicEffectData;
