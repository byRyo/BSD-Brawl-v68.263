// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");

const setMaxTextLengthNative = new NativeFunction(Libg.offset(15482288, 14282348), "void", [
  "pointer",
  "int",
]);

class TextInput {
  constructor(instance) {
    this.instance = instance;
    this.vtable = instance.readPointer();
  }
  setMaxTextLength(length) {
    setMaxTextLengthNative(this.instance, length);
  }
}

exports.TextInput = TextInput;
