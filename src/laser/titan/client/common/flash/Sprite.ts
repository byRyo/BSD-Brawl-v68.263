// @ts-nocheck
const { Libc } = require("../../../../../lib/Libc");
const { Libg } = require("../../../../../lib/Libg");
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const { DisplayObject } = require("./DisplayObject");
const Sprite_ctor = new NativeFunction(Libg.offset(13389364, 12399908), "void", [
  "pointer",
  "int16",
]);
const Sprite_removeChild = new NativeFunction(Libg.offset(13390644, 12401628), "void", [
  "pointer",
  "pointer",
]);
const Sprite_addChildAt = new NativeFunction(Libg.offset(13389912, 12400540), "void", [
  "pointer",
  "pointer",
  "int",
]);
const childCountOffset = LogicMemory.offset(78),
  childrenOffset = LogicMemory.offset(80),
  allocationSize = LogicMemory.offset(128);
class Sprite extends DisplayObject {
  constructor(instanceOrType) {
    if (instanceOrType instanceof NativePointer) {
      super(instanceOrType);
      return;
    }
    const p = Libc.malloc(allocationSize);
    Sprite_ctor(p, instanceOrType);
    super(p);
  }
  static addChild(instance, child) {
    const p = child.instance ?? child;
    const count = instance.add(childCountOffset).readU16();
    Sprite_addChildAt(instance, p, count);
  }
  get childCount() {
    return this.instance.add(childCountOffset).readU16();
  }
  getChildAt(index) {
    if (this.childCount === 0) return null;
    return this.instance
      .add(childrenOffset)
      .readPointer()
      .add(index * Process.pointerSize)
      .readPointer();
  }
  addChild(child) {
    Sprite.addChild(this.instance, child);
  }
  addChildAt(child, index) {
    Sprite_addChildAt(this.instance, child.instance ?? child, index);
  }
  removeChild(child) {
    Sprite_removeChild(this.instance, child.instance ?? child);
  }
}
module.exports = { Sprite, Sprite_removeChild };
