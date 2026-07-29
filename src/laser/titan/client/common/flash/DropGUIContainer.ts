// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg"),
  { GUIContainer } = require("./GUIContainer"),
  { Libc } = require("../../../../../lib/Libc"),
  { GameButton } = require("../../../../client/game/gui/GameButton"),
  { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const ctor = new NativeFunction(Libg.offset(6074612, 6049404), "void", ["pointer"]),
  addButton = new NativeFunction(Libg.offset(6075828, 6050344), "pointer", [
    "pointer",
    "pointer",
    "int",
  ]),
  setMovieOffset = LogicMemory.offset(44 * Process.pointerSize);
class DropGUIContainer extends GUIContainer {
  constructor(instance, size) {
    if (!(instance instanceof NativePointer) && !instance) {
      instance = Libc.malloc(size ?? DropGUIContainer.allocationSize);
      ctor(instance);
    }
    super(instance);
  }
  addGameButton(instance, type) {
    return new GameButton(addButton(this.instance, LogicMemory.ensurePointer(instance), type));
  }
  setMovieClip(movieClip) {
    new NativeFunction(this.instance.readPointer().add(setMovieOffset).readPointer(), "void", [
      "pointer",
      "pointer",
    ])(this.instance, movieClip.instance ?? movieClip);
  }
}
DropGUIContainer.allocationSize = 496;
module.exports = { DropGUIContainer };
