// @ts-nocheck
const { TextInput } = require("../../../../client/game/text/TextInput");
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const { StringObject } = require("../../native/StringObject");
const textOffset = LogicMemory.offset(72, 32),
  activateVtable = 11 * Process.pointerSize,
  updateVtable = 7 * Process.pointerSize;
class InputField extends TextInput {
  constructor(instance, textField) {
    super(instance);
    this.updateFunc = new NativeFunction(this.vtable.add(updateVtable).readPointer(), "void", [
      "pointer",
      "float",
    ]);
  }
  destruct() {
    new NativeFunction(this.vtable.readPointer(), "void", ["pointer"])(this.instance);
  }
  activate(active) {
    new NativeFunction(this.vtable.add(activateVtable).readPointer(), "void", ["pointer", "bool"])(
      this.instance,
      +active,
    );
  }
  getInputText() {
    return StringObject.read(this.instance.add(textOffset));
  }
  setInputText(v) {
    StringObject.create(v, this.instance.add(textOffset));
  }
  update(delta) {
    this.updateFunc(this.instance, delta);
  }
}
module.exports = { InputField };
