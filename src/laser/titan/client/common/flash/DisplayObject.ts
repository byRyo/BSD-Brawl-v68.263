// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const { Matrix2x3 } = require("../math/Matrix2x3");
const { ColorTransform } = require("./ColorTransform");
const setXYNative = new NativeFunction(Libg.offset(13294400, 12294592), "void", [
  "pointer",
  "float",
  "float",
]);
const removeNative = new NativeFunction(Libg.offset(13294556, 12294752), "void", ["pointer"]);
const getBoundsNative = new NativeFunction(Libg.offset(13293796, 12293988), "pointer", [
  "pointer",
  "pointer",
  "pointer",
  "int",
]);
const setWidthNative = new NativeFunction(Libg.offset(13295072, 12295268), "void", [
  "pointer",
  "float",
]);
const setHeightNative = new NativeFunction(Libg.offset(13294980, 12295176), "void", [
  "pointer",
  "float",
]);
const off = (n) => LogicMemory.offset(n);
const [visibilityOffset, alphaOffset, matrixOffset, xOffset, yOffset, colorOffset, parentOffset] = [
  8, 9, 16, 32, 36, 56, 96,
].map(off);
const vt = [5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map(
  (n) => n * Process.pointerSize,
);
class DisplayObject {
  constructor(instance) {
    this.instance = instance;
  }
  get vtable() {
    return this.instance.readPointer();
  }
  _virtual(index, ret = "int", args = []) {
    return new NativeFunction(this.vtable.add(index * Process.pointerSize).readPointer(), ret, [
      "pointer",
      ...args,
    ]);
  }
  get width() {
    return this._virtual(5, "float")(this.instance);
  }
  get height() {
    return this._virtual(6, "float")(this.instance);
  }
  set x(v) {
    this.instance.add(xOffset).writeFloat(v);
  }
  get x() {
    return this.instance.add(xOffset).readFloat();
  }
  set y(v) {
    this.instance.add(yOffset).writeFloat(v);
  }
  get y() {
    return this.instance.add(yOffset).readFloat();
  }
  get matrix2x3() {
    return new Matrix2x3(this.instance.add(matrixOffset));
  }
  setXY(x, y) {
    setXYNative(this.instance, x, y);
    return this;
  }
  setWidth(v) {
    setWidthNative(this.instance, v);
  }
  setHeight(v) {
    setHeightNative(this.instance, v);
  }
  shiftX(v) {
    this.x += v;
  }
  shiftY(v) {
    this.y -= v;
  }
  set visibility(v) {
    this.instance.add(visibilityOffset).writeU8(+v);
  }
  get visibility() {
    return this.instance.add(visibilityOffset).readU8();
  }
  set alpha(v) {
    this.colorTransform.alpha = v;
  }
  get colorTransform() {
    return this._color || (this._color = new ColorTransform(this.instance.add(colorOffset)));
  }
  setSize(w, h) {
    setXYNative(this.instance, w, h);
    return this;
  }
  setPixelSnappedXY(x, y) {
    return this.setXY(Math.floor(x), Math.floor(y));
  }
  rotate(degrees, sx = 1, sy = 1) {
    this.matrix2x3.rotate(degrees, sx, sy);
  }
  set scale(v) {
    this.matrix2x3.scaleX = v;
    this.matrix2x3.scaleY = v;
  }
  set scaleX(v) {
    this.matrix2x3.scaleX = v;
  }
  set scaleY(v) {
    this.matrix2x3.scaleY = v;
  }
  get scaleX() {
    return this.matrix2x3.scaleX;
  }
  get scaleY() {
    return this.matrix2x3.scaleY;
  }
  get parent() {
    return this.instance.add(parentOffset).readPointer();
  }
  getBounds(target, result) {
    getBoundsNative(this.instance, target, result, 0);
    return result;
  }
  get type() {
    if (this.isMovieClip()) return "MovieClip";
    if (this.isTextField()) return "TextField";
    if (this.isSprite()) return "Sprite";
    if (this.isShape()) return "Shape";
    if (this.isScrollArea()) return "ScrollArea";
    if (this.isMovieClipModifier()) return "MovieClipModifier";
    if (this.isCustomButton()) return "CustomButton";
    if (this.isGUIContainer()) return "GUIContainer";
    if (this.isSprite3D()) return "Sprite3D";
  }
  isMovieClip() {
    return this._virtual(5)(this.instance);
  }
  isTextField() {
    return this._virtual(6)(this.instance);
  }
  isSprite() {
    return this._virtual(7)(this.instance);
  }
  isShape() {
    return this._virtual(8)(this.instance);
  }
  isScrollArea() {
    return this._virtual(9)(this.instance);
  }
  isMovieClipModifier() {
    return this._virtual(10)(this.instance);
  }
  isCustomButton() {
    return this._virtual(11)(this.instance);
  }
  isGUIContainer() {
    return this._virtual(12)(this.instance);
  }
  isSprite3D() {
    return this._virtual(13)(this.instance);
  }
  isNull() {
    return this.instance.isNull();
  }
  removeFromParent() {
    removeNative(this.instance);
  }
  destruct() {
    new NativeFunction(this.vtable.add(Process.pointerSize).readPointer(), "void", ["pointer"])(
      this.instance,
    );
  }
}
module.exports = { DisplayObject };
