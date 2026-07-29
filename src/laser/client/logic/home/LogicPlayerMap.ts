// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { Libc } = require("../../../../lib/Libc");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { StringObject } = require("../../../titan/client/native/StringObject");

const saveNative = new NativeFunction(Libg.offset(12301040, 11234360), "void", [
  "pointer",
  "pointer",
  "pointer",
]);
const nameOffset = LogicMemory.offset(8);
const variationOffset = LogicMemory.offset(16);
const environmentOffset = LogicMemory.offset(24);

class LogicPlayerMap {
  constructor(instance) {
    this.instance = instance || Libc.calloc(LogicPlayerMap.allocationSize, 1);
  }
  setName(value) {
    this.instance.add(nameOffset).writePointer(StringObject.createNative(value));
  }
  setGameModeVariation(value) {
    this.instance.add(variationOffset).writeU32(value);
  }
  setEnvironment(value) {
    this.instance.add(environmentOffset).writePointer(value);
  }
  save(home, avatar) {
    saveNative(this.instance, home, avatar);
  }
}
LogicPlayerMap.allocationSize = 104;
exports.LogicPlayerMap = LogicPlayerMap;
