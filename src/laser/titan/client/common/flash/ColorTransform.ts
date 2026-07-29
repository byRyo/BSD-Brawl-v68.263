// @ts-nocheck
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const offsets = [9, 10, 11, 12, 13, 14, 15].map((value) => LogicMemory.offset(value));

class ColorTransform {
  constructor(instance) {
    this._instance = instance;
  }
  get c1r() {
    return this._instance.readU8();
  }
  set c1r(v) {
    this._instance.writeU8(v);
  }
  get c1g() {
    return this._instance.add(1).readU8();
  }
  set c1g(v) {
    this._instance.add(1).writeU8(v);
  }
  get c1b() {
    return this._instance.add(2).readU8();
  }
  set c1b(v) {
    this._instance.add(2).writeU8(v);
  }
  get alpha() {
    return this._instance.add(3).readU8();
  }
  set alpha(v) {
    this._instance.add(3).writeU8(v);
  }
  get c2r() {
    return this._instance.add(4).readU8();
  }
  set c2r(v) {
    this._instance.add(4).writeU8(v % 256);
  }
  get c2g() {
    return this._instance.add(5).readU8();
  }
  set c2g(v) {
    this._instance.add(5).writeU8(v % 256);
  }
  get c2b() {
    return this._instance.add(6).readU8();
  }
  set c2b(v) {
    this._instance.add(6).writeU8(v % 256);
  }
  set red(v) {
    this.c1r = v;
    this.c2r = v;
  }
  set r(v) {
    this.red = v;
  }
  set green(v) {
    this.c1g = v;
    this.c2g = v;
  }
  set g(v) {
    this.green = v;
  }
  set blue(v) {
    this.c1b = v;
    this.c2b = v;
  }
  set b(v) {
    this.blue = v;
  }
  static setColor(instance, r, g, b, alpha) {
    [r, g, b, alpha, r, g, b].forEach((value, index) =>
      instance.add(offsets[index]).writeU8(value),
    );
  }
  static setColorDual(instance, c1r, c1g, c1b, alpha, c2r, c2g, c2b) {
    [c1r, c1g, c1b, alpha, c2r, c2g, c2b].forEach((value, index) =>
      instance.add(offsets[index]).writeU8(value),
    );
  }
}
module.exports = { ColorTransform };
