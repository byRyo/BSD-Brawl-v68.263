// @ts-nocheck
const { Libc } = require("../../../../lib/Libc");

class INativeDialogListener {
  constructor(callback) {
    this.instance = Libc.malloc(Process.pointerSize);
    this.vtable = Libc.malloc(Process.pointerSize);
    this.nativeCallback = new NativeCallback(callback, "void", ["pointer", "int"]);
    this.vtable.writePointer(this.nativeCallback);
    this.instance.writePointer(this.vtable);
  }
}

exports.INativeDialogListener = INativeDialogListener;
