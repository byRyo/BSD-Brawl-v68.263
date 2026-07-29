// @ts-nocheck
const { Sprite } = require("./Sprite"),
  { Libc } = require("../../../../../lib/Libc"),
  { Libg } = require("../../../../../lib/Libg"),
  { StringObject } = require("../../native/StringObject"),
  { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const buildNative = new NativeFunction(Libg.offset(6032544, 6021340), "void", [
    "pointer",
    "pointer",
    "pointer",
    "pointer",
    "int",
  ]),
  allocationSize = 192,
  imageOffset = LogicMemory.offset(80),
  widthOffset = LogicMemory.offset(68),
  heightOffset = LogicMemory.offset(70);
class DownloadedImage extends Sprite {
  constructor(fileName, image) {
    super(DownloadedImage.build(fileName, image.instance, image.instance, false));
  }
  static fromLocalFile(fileName, loadNow, cache) {
    return new Sprite(this.build(fileName, NULL, loadNow, cache));
  }
  static getNaturalSize(instance) {
    const image = instance.add(imageOffset).readPointer();
    if (image.isNull()) return null;
    const width = image.add(widthOffset).readU16(),
      height = image.add(heightOffset).readU16();
    return width <= 0 || height <= 0 ? null : { width, height };
  }
  static build(fileName, imageA, imageB, flag) {
    const p = Libc.malloc(allocationSize),
      holder = Libc.malloc(Process.pointerSize);
    holder.writePointer(imageA);
    StringObject.with(fileName, (s) => buildNative(p, holder, s, imageB, +flag));
    return p;
  }
}
module.exports = { DownloadedImage };
