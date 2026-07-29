// @ts-nocheck
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicData } = require("../data/LogicData");

const dataOffset = LogicMemory.offset(16);
const xOffset = LogicMemory.offset(48);
const yOffset = LogicMemory.offset(52);
const zOffset = LogicMemory.offset(56);
const playerIndexOffset = LogicMemory.offset(60);
const teamIndexOffset = LogicMemory.offset(64);
const indexOffset = 5 * Process.pointerSize;
const vtableIsCharacterOffset = 0;

class LogicGameObjectClient {
  constructor(instance) {
    this.instance = instance;
  }
  get x() {
    return this.instance.add(xOffset).readU32();
  }
  get y() {
    return this.instance.add(yOffset).readU32();
  }
  get z() {
    return this.instance.add(zOffset).readS32();
  }
  get data() {
    return new LogicData(this.dataPtr);
  }
  get playerIndex() {
    return this.instance.add(playerIndexOffset).readInt();
  }
  get teamIndex() {
    return this.instance.add(teamIndexOffset).readInt();
  }
  get index() {
    return this.instance.add(indexOffset).readInt();
  }
  get dataPtr() {
    return this.instance.add(dataOffset).readPointer();
  }
  set dataPtr(value) {
    this.instance.add(dataOffset).writePointer(value);
  }
  isCharacter() {
    const vtable = this.instance.readPointer();
    if (vtable.isNull()) return false;
    const key = vtable.toString();
    if (LogicGameObjectClient.characterVtables.has(key)) return true;
    if (LogicGameObjectClient.nonCharacterVtables.has(key)) return false;
    const method = vtable.add(vtableIsCharacterOffset).readPointer();
    if (method.isNull()) return false;
    try {
      const result = new NativeFunction(method, "int", ["pointer"])(this.instance) === 0;
      (result
        ? LogicGameObjectClient.characterVtables
        : LogicGameObjectClient.nonCharacterVtables
      ).add(key);
      return result;
    } catch (_) {
      return false;
    }
  }
}
LogicGameObjectClient.characterVtables = new Set();
LogicGameObjectClient.nonCharacterVtables = new Set();
exports.LogicGameObjectClient = LogicGameObjectClient;
