// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { DisplayObject } = require("./DisplayObject");
const { StringObject } = require("../../native/StringObject");
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const TextField_setAllowColorCodes = new NativeFunction(Libg.offset(13512824, 12502216), "void", [
  "pointer",
  "int",
]);
const setTextNative = new NativeFunction(Libg.offset(13511872, 12501240), "void", [
  "pointer",
  "pointer",
]);
const textWidthNative = new NativeFunction(Libg.offset(13512328, 12501708), "float", ["pointer"]);
const textHeightNative = new NativeFunction(Libg.offset(13512512, 12501896), "float", ["pointer"]);
const scaleNative = new NativeFunction(Libg.offset(10487628, 9821392), "void", [
  "pointer",
  "pointer",
  "int",
  "int",
]);
const O = {
  x: 32,
  y: 36,
  color: 128,
  outlineColor: 132,
  colorTag: 141,
  fontOutline: 139,
  align: 144,
  fontSize: 150,
  text: 176,
  tagFlag: 224,
};
for (const k in O) O[k] = LogicMemory.offset(O[k]);
class TextField extends DisplayObject {
  set x(v) {
    this.instance.add(O.x).writeFloat(v);
  }
  get x() {
    return this.instance.add(O.x).readFloat();
  }
  set y(v) {
    this.instance.add(O.y).writeFloat(v);
  }
  get y() {
    return this.instance.add(O.y).readFloat();
  }
  set color(v) {
    this.instance.add(O.color).writeU32(v);
  }
  get color() {
    return this.instance.add(O.color).readU32();
  }
  set outlineColor(v) {
    this.instance.add(O.outlineColor).writeU32(v);
  }
  get outlineColor() {
    return this.instance.add(O.outlineColor).readU32();
  }
  set colorTag(v) {
    this.instance.add(O.colorTag).writeU8(+v);
  }
  get colorTag() {
    return this.instance.add(O.colorTag).readU8();
  }
  get textWidth() {
    return textWidthNative(this.instance);
  }
  get textHeight() {
    return textHeightNative(this.instance);
  }
  setAllowColorCodes(v) {
    TextField_setAllowColorCodes(this.instance, +v);
    return this;
  }
  set fontOutline(v) {
    this.instance.add(O.fontOutline).writeU8(+v);
  }
  get fontOutline() {
    return this.instance.add(O.fontOutline).readU8();
  }
  set align(v) {
    this.instance.add(O.align).writeU8(v);
  }
  get align() {
    return this.instance.add(O.align).readU8();
  }
  set fontSize(v) {
    this.instance.add(O.fontSize).writeShort(v);
  }
  get fontSize() {
    return this.instance.add(O.fontSize).readShort();
  }
  set text(v) {
    StringObject.with(v, (s) => setTextNative(this.instance, s));
  }
  get text() {
    return StringObject.read(this.instance.add(O.text));
  }
  setStringObject(value) {
    setTextNative(this.instance, value);
    return this;
  }
  setTextScaleIfNecessary(value) {
    StringObject.with(value, (s) => scaleNative(this.instance, s, 0, 0));
    return this;
  }
  static patch() {
    Interceptor.attach(setTextNative, {
      onEnter(args) {
        TextField.enableColorTagFlagIfTextLooksTagged(args[0], args[1]);
      },
    });
    Interceptor.attach(scaleNative, {
      onEnter(args) {
        TextField.enableColorTagFlagIfTextLooksTagged(args[0], args[1]);
      },
    });
  }
  static enableColorTagFlagIfTextLooksTagged(instance, stringObject) {
    const text = StringObject.read(stringObject);
    if (text && text.includes("<c")) instance.add(O.tagFlag).writeU8(1);
  }
}
module.exports = { TextField, TextField_setAllowColorCodes };
