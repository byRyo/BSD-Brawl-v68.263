// @ts-nocheck
const { StringObject } = require("../../native/StringObject");
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const [nameOffset, outlineOffset, margin0, margin1, margin2, margin3, glyphWidthOffset] = [
  24, 72, 76, 80, 84, 88, 92,
].map((v) => LogicMemory.offset(v));
class Font {
  constructor(instance) {
    this.instance = instance;
  }
  getFullName() {
    return StringObject.read(this.instance.add(nameOffset));
  }
  set outline(v) {
    this.instance.add(outlineOffset).writeU8(+v);
  }
  get outline() {
    return Boolean(this.instance.add(outlineOffset).readU8());
  }
  setGlyphMargin(a, b, c, d, e) {
    [a, b, c, d, e].forEach((v, i) =>
      this.instance.add([margin0, margin1, margin2, margin3, glyphWidthOffset][i]).writeInt(v),
    );
  }
  get glyphWidth() {
    return this.instance.add(glyphWidthOffset).readInt();
  }
}
module.exports = { Font };
