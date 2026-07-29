// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicMapEditorMode } = require("../../logic/mode/LogicMapEditorMode");

const getInstanceNative = new NativeFunction(Libg.offset(10280216, 9654612), "pointer", []);
const logicEditorOffset = LogicMemory.offset(48);

class MapEditorMode {
  static getInstance() {
    return getInstanceNative();
  }
  static getLogicEditor() {
    const instance = this.getInstance();
    if (instance.isNull()) return new LogicMapEditorMode(NULL);
    return new LogicMapEditorMode(instance.add(logicEditorOffset).readPointer());
  }
}

exports.MapEditorMode = MapEditorMode;
