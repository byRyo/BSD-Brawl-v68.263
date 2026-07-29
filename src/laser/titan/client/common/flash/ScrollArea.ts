// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const { Sprite } = require("./Sprite");
const { TextField } = require("./TextField");
const { Libc } = require("../../../../../lib/Libc");

const ScrollArea_ctor = new NativeFunction(Libg.offset(13531940, 12517512), "void", [
  "pointer",
  "pointer",
  "int",
]);
const ScrollArea_addContent = new NativeFunction(Libg.offset(13533272, 12518840), "void", [
  "pointer",
  "pointer",
]);
const ScrollArea_update = new NativeFunction(Libg.offset(13533856, 12519416), "void", [
  "pointer",
  "float",
]);
const ScrollArea_removeAllContent = new NativeFunction(Libg.offset(13533360, 12518928), "void", [
  "pointer",
]);

const clippingOffset = LogicMemory.offset(224);
const alignmentBaseOffset = LogicMemory.offset(232);
const alignmentOffset = LogicMemory.offset(392);
const pinchingFlagOffset = LogicMemory.offset(398);
const unusedContentOffset = LogicMemory.offset(632);
const clipWidthOffset = LogicMemory.offset(192);
const clipHeightOffset = LogicMemory.offset(196);
const horizontalDragOffset = LogicMemory.offset(232);
const verticalDragOffset = LogicMemory.offset(231);

class ScrollArea extends Sprite {
  constructor(instanceOrTextField, type) {
    if (instanceOrTextField instanceof TextField) {
      const instance = Libc.malloc(ScrollArea.allocationSize);
      ScrollArea_ctor(instance, instanceOrTextField.instance, type);
      super(instance);
      return;
    }

    super(instanceOrTextField);
  }

  addContent(content) {
    ScrollArea_addContent(this.instance, content.instance);
  }

  enablePinching(enabled) {
    this.instance.add(alignmentBaseOffset).add(pinchingFlagOffset).writeU8(+enabled);
  }

  enableHorizontalDrag(enabled) {
    this.instance.add(horizontalDragOffset).writeU8(+enabled);
  }

  enableVerticalDrag(enabled) {
    this.instance.add(verticalDragOffset).writeU8(+enabled);
  }

  removeAllContent() {
    ScrollArea_removeAllContent(this.instance);
  }

  setClipping(enabled) {
    this.instance.add(clippingOffset).writeU8(+enabled);
  }

  setAlignment(alignment) {
    this.instance.add(alignmentBaseOffset).add(alignmentOffset).writeInt(alignment);
  }

  get clipWidth() {
    return this.instance.add(clipWidthOffset).readFloat();
  }

  set clipWidth(width) {
    this.instance.add(clipWidthOffset).writeFloat(width);
  }

  get clipHeight() {
    return this.instance.add(clipHeightOffset).readFloat();
  }

  set clipHeight(height) {
    this.instance.add(clipHeightOffset).writeFloat(height);
  }

  update(delta) {
    ScrollArea_update(this.instance, delta);
  }
}

ScrollArea.allocationSize = 712;

module.exports = { ScrollArea };
