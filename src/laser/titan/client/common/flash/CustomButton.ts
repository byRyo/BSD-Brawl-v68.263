// @ts-nocheck
const { Sprite } = require("./Sprite"),
  { IButtonListener } = require("../../native/IButtonListener"),
  { MovieClip } = require("./MovieClip"),
  { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory"),
  { Libg } = require("../../../../../lib/Libg");
const isNameNative = new NativeFunction(Libg.offset(15296248, 14172688), "bool", [
    "pointer",
    "pointer",
  ]),
  O = {
    listener: 128,
    movie: 168,
    id: 200,
    continuous: 164,
    count: 220,
    holdX: 224,
    holdY: 228,
    pressed: 236,
    vcall: 528,
  };
for (const k in O) O[k] = LogicMemory.offset(O[k]);
class CustomButton extends Sprite {
  static store(button, key) {
    this._buttonMap.set(key, button);
  }
  static get(key) {
    return this._buttonMap.get(key);
  }
  setCustomButtonListener(callback, key = "") {
    this._listener = new IButtonListener((a, b) => callback(a, b));
    if (key) CustomButton.store(this, key);
    this.instance.add(O.listener).writePointer(this._listener.instance);
  }
  set listener(callback) {
    this.setCustomButtonListener(callback);
  }
  setMovieClip(movieClip, flag) {
    new NativeFunction(this.instance.readPointer().add(O.vcall).readPointer(), "void", [
      "pointer",
      "pointer",
      "bool",
    ])(this.instance, movieClip.instance ?? movieClip, +flag);
  }
  getMovieClip() {
    return new MovieClip(this.instance.add(O.movie).readPointer());
  }
  set id(v) {
    this.instance.add(O.id).writeInt(v);
  }
  get id() {
    return this.instance.add(O.id).readInt();
  }
  isNameEqualsTo(name) {
    return isNameNative(this.instance.add(O.movie), name);
  }
  enableContinuousPresses(a, b) {
    this.instance.add(O.continuous).writeU8(1);
    this.instance.add(O.holdX).writeFloat(a);
    this.instance.add(O.holdY).writeFloat(b);
  }
  isContinuousPressesEnabled() {
    return this.instance.add(O.continuous).readU8() !== 0;
  }
  set continuousPressEnabled(v) {
    this.instance.add(O.continuous).writeU8(+v);
  }
  get continuousPressCount() {
    return this.instance.add(O.count).readInt();
  }
  set continuousPressCount(v) {
    this.instance.add(O.count).writeInt(v);
  }
  suppressNextReleaseClick() {
    this.continuousPressEnabled = true;
    this.continuousPressCount = 1;
  }
  get isPressed() {
    return this.instance.add(O.pressed).readInt() !== -1;
  }
  setCustomButtonHoldListener(callback, holdTimeMs) {
    const key = this.instance.toString();
    CustomButton._holdListeners.set(key, {
      button: this,
      callback,
      holdTimeMs,
      pressStartedAtMs: 0,
      hasFired: false,
    });
    if (!CustomButton._holdPollerStarted) {
      CustomButton._holdPollerStarted = true;
      setInterval(CustomButton._pollHoldListeners, 50);
    }
  }
  static clearAllHoldListeners() {
    this._holdListeners.clear();
    this._buttonMap.clear();
  }
  static _pollHoldListeners() {
    const remove = [];
    for (const [key, item] of CustomButton._holdListeners.entries()) {
      try {
        if (!CustomButton._isButtonAlive(item.button.instance)) {
          remove.push(key);
          continue;
        }
        if (!item.button.isPressed) {
          if (item.hasFired) {
            item.button.continuousPressEnabled = false;
            item.button.continuousPressCount = 0;
          }
          item.pressStartedAtMs = 0;
          item.hasFired = false;
          continue;
        }
        if (item.pressStartedAtMs === 0) item.pressStartedAtMs = Date.now();
        else if (!item.hasFired && Date.now() - item.pressStartedAtMs >= item.holdTimeMs) {
          item.hasFired = true;
          item.callback(item.button);
        }
      } catch {
        remove.push(key);
      }
    }
    for (const key of remove) {
      CustomButton._holdListeners.delete(key);
      CustomButton._buttonMap.forEach((b, k) => {
        if (b.instance.toString() === key) CustomButton._buttonMap.delete(k);
      });
    }
  }
  static _isButtonAlive(p) {
    if (p.isNull() || Process.findRangeByAddress(p) === null) return false;
    const v = p.readPointer();
    return !v.isNull() && Process.findRangeByAddress(v) !== null;
  }
}
CustomButton._buttonMap = new Map();
CustomButton._holdListeners = new Map();
CustomButton._holdPollerStarted = false;
module.exports = { CustomButton };
