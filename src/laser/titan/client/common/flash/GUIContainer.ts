// @ts-nocheck
const { Sprite } = require("./Sprite"),
  { MovieClip } = require("./MovieClip"),
  { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory"),
  { Libg } = require("../../../../../lib/Libg"),
  { StringObject } = require("../../native/StringObject");
const addButton = new NativeFunction(Libg.offset(13528860, 12514612), "void", [
    "pointer",
    "pointer",
  ]),
  getTextField = new NativeFunction(Libg.offset(13318072, 12318136), "pointer", [
    "pointer",
    "pointer",
    "pointer",
  ]),
  movieOffset = LogicMemory.offset(144);
class GUIContainer extends Sprite {
  getMovieClip() {
    return new MovieClip(GUIContainer.getMovieClip(this.instance));
  }
  isDestructed() {
    return this.visibility;
  }
  addGameButtonManually(button) {
    addButton(this.instance, button.instance);
    return this;
  }
  static _getMovieClip(instance) {
    return instance.add(movieOffset).readPointer();
  }
  static getMovieClip(instance) {
    return new MovieClip(this._getMovieClip(instance));
  }
  static getTextField(instance, name, context) {
    StringObject.with(name, (s) => getTextField(instance, Memory.allocUtf8String(context), s));
  }
}
module.exports = { GUIContainer };
