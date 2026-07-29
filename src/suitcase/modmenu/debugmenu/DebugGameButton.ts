// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugGameButton = void 0;
const { GameButton } = require("../../../laser/client/game/gui/GameButton");
const { StringObject } = require("../../../laser/titan/client/native/StringObject");
const { LogicMemory } = require("../../logic/LogicMemory");
const setTextOffset = LogicMemory.offset(572);
const checkboxOffset = LogicMemory.offset(580);
const originalNameOffset = LogicMemory.offset(606);
const intParameterOffset = LogicMemory.offset(622);
const categoryNameOffset = 54 * Process.pointerSize;
class DebugGameButton extends GameButton {
  constructor(...args) {
    super(...args);
    this.mode = "both";
    this.isFilteredOut = false;
  }
  getTextFieldText() {
    const textField = this.getMovieClip().getTextFieldByName("Text");
    return textField ? textField.text : "";
  }
  setTextFieldText(text) {
    const fn = DebugGameButton.resolveSetTextFunction(this.instance.readPointer());
    const value = StringObject.create(text);
    fn(this.instance, value, true);
  }
  static resolveSetTextFunction(vtable) {
    return new NativeFunction(vtable.add(setTextOffset).readPointer(), "void", [
      "pointer",
      "pointer",
      "bool",
    ]);
  }
  getCheckbox() {
    return this.instance.add(checkboxOffset).readPointer();
  }
  setCheckbox(checkbox) {
    this.instance.add(checkboxOffset).writePointer(checkbox);
  }
  switchCheckbox(value) {
    if (this.getCheckbox().isNull()) return;
    this.getCheckbox()
      .add(Process.pointerSize)
      .writeU8(value ? 0 : 1);
  }
  getOriginalName() {
    return StringObject.read(this.instance.add(originalNameOffset));
  }
  setOriginalName(name) {
    StringObject.create(name, this.instance.add(originalNameOffset));
  }
  getIntParameter() {
    return this.instance.add(intParameterOffset).readInt();
  }
  setIntParameter(value) {
    this.instance.add(intParameterOffset).writeInt(value);
  }
  getCategoryName() {
    return StringObject.read(this.instance.add(categoryNameOffset));
  }
  setCategoryName(name) {
    StringObject.create(name, this.instance.add(categoryNameOffset));
  }
}
exports.DebugGameButton = DebugGameButton;
