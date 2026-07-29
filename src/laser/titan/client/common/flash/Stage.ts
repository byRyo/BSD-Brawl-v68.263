// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg"),
  { Sprite, Sprite_removeChild } = require("./Sprite"),
  { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const stageAddress = Libg.offset(19866192, 18163880),
  objectsNative = new NativeFunction(Libg.offset(13418700, 12428000), "pointer", [
    "pointer",
    "float",
    "float",
  ]),
  O = { main: 168, point: 400, count: 708, matrixA: 84, matrixB: 88, matrixC: 92 };
for (const k in O) O[k] = LogicMemory.offset(O[k]);
class Stage {
  getInstance() {
    return this._stage || (this._stage = stageAddress.readPointer());
  }
  addChild(child) {
    return Sprite.addChild(this.getMainSprite(), child);
  }
  getMainSprite() {
    return this.getInstance().add(O.main).readPointer();
  }
  getPointSize() {
    const v = this.getInstance().add(O.point).readFloat();
    return v !== 0 ? v : 0.1;
  }
  get objectsUnderPointAddr() {
    return objectsNative;
  }
  getObjectsUnderPoint(x, y) {
    return objectsNative(this.getInstance(), x, y);
  }
  removeChild(child) {
    Sprite_removeChild(this.getInstance().add(O.main).readPointer(), child);
  }
  getBackgroundCoverWidth() {
    const p = this.getInstance();
    return (
      2 * Math.max(p.add(O.matrixA).readFloat(), p.add(O.matrixB).readFloat()) +
      this.getMatrixX() +
      4
    );
  }
  getBackgroundCoverHeight() {
    const p = this.getInstance();
    return (
      2 * Math.max(p.add(O.matrixA).readFloat(), p.add(O.matrixB).readFloat()) +
      this.getMatrixY() +
      4
    );
  }
  getMatrixX() {
    if (!this._matrixX) {
      const p = this.getInstance(),
        s = this.getPointSize();
      this._matrixX =
        p.add(O.count).readU32() -
        (p.add(O.matrixB).readFloat() + p.add(O.matrixC).readFloat()) / s;
    }
    return this._matrixX;
  }
  getMatrixY() {
    if (!this._matrixY) {
      const p = this.getInstance(),
        s = this.getPointSize();
      this._matrixY =
        p.add(O.count).readU32() -
        (p.add(O.matrixB).readFloat() + p.add(O.matrixC).readFloat()) / s;
    }
    return this._matrixY;
  }
}
module.exports = { Stage };
