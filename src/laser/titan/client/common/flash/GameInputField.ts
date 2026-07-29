// @ts-nocheck
const { InputField } = require("./InputField"),
  { Libc } = require("../../../../../lib/Libc"),
  { Libg } = require("../../../../../lib/Libg"),
  { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory"),
  { StringObject } = require("../../native/StringObject");
const ctor = new NativeFunction(Libg.offset(6078236, 6052248), "void", [
    "pointer",
    "pointer",
    "pointer",
  ]),
  scaleText = new NativeFunction(Libg.offset(6079084, 6053052), "void", ["pointer", "bool"]),
  activateVtable = 7 * Process.pointerSize,
  cachedTextOffset = LogicMemory.offset(168, 128);
class GameInputField extends InputField {
  constructor(textField, arg) {
    const p = Libc.malloc(GameInputField.allocationSize);
    ctor(p, textField.instance, arg);
    super(p, textField);
    this.activateFunc = new NativeFunction(this.vtable.add(activateVtable).readPointer(), "void", [
      "pointer",
      "bool",
    ]);
  }
  setScaleTextIfNeeded(v) {
    scaleText(this.instance, +v);
  }
  activate(v) {
    this.activateFunc(this.instance, +v);
  }
  clearCachedText() {
    StringObject.create("", this.instance.add(cachedTextOffset));
  }
}
GameInputField.allocationSize = 200;
module.exports = { GameInputField };
