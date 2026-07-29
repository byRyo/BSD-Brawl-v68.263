// @ts-nocheck
class Matrix2x3 {
  constructor(instance) {
    this.instance = instance;
  }
  get scaleX() {
    return this.instance.readFloat();
  }
  set scaleX(v) {
    this.instance.writeFloat(v);
  }
  get rotateSkew0() {
    return this.instance.add(4).readFloat();
  }
  set rotateSkew0(v) {
    this.instance.add(4).writeFloat(v);
  }
  get rotateSkew1() {
    return this.instance.add(8).readFloat();
  }
  set rotateSkew1(v) {
    this.instance.add(8).writeFloat(v);
  }
  get scaleY() {
    return this.instance.add(12).readFloat();
  }
  set scaleY(v) {
    this.instance.add(12).writeFloat(v);
  }
  get translateX() {
    return this.instance.add(16).readFloat();
  }
  set translateX(v) {
    this.instance.add(16).writeFloat(v);
  }
  get translateY() {
    return this.instance.add(20).readFloat();
  }
  set translateY(v) {
    this.instance.add(20).writeFloat(v);
  }
  rotate(degrees, scaleX = 1, scaleY = 1) {
    const radians = 0.017453 * degrees,
      sin = Math.sin(radians),
      cos = Math.cos(radians);
    this.scaleX = cos * scaleX;
    this.rotateSkew0 = sin * scaleY;
    this.rotateSkew1 = -scaleX * sin;
    this.scaleY = cos * scaleY;
  }
}
module.exports = { Matrix2x3 };
