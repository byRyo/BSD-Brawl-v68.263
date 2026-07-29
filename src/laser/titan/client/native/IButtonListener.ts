// @ts-nocheck
const { Libc } = require("../../../../lib/Libc");

class IButtonListener {
  constructor(callback) {
    this._callback = callback;
    this.nativeCallback = new NativeCallback(
      (button, buttonInstance) => this._callback(button, buttonInstance),
      "void",
      ["pointer", "pointer"],
    );
    this.vtable = Libc.calloc(2 * Process.pointerSize, 1);
    this.vtable.add(Process.pointerSize).writePointer(this.nativeCallback);
    this.instance = Libc.calloc(2 * Process.pointerSize, 1);
    this.instance.writePointer(this.vtable);
  }
}

exports.IButtonListener = IButtonListener;
