// @ts-nocheck
const { TextField } = require("./TextField");
const { Libg } = require("../../../../../lib/Libg");
const { StringObject } = require("../../native/StringObject");

const createBling = new NativeFunction(Libg.offset(5761204, 5797488), "pointer", [
  "pointer",
  "pointer",
  "int",
  "pointer",
  "bool",
  "bool",
  "bool",
]);

class BlingTextField extends TextField {
  static create(parent, text, fontSize) {
    const instance = StringObject.with(text, (value) =>
      createBling(parent.instance, value, fontSize, parent.instance, true, false, false),
    );
    return instance.isNull() ? null : new BlingTextField(instance);
  }
}

module.exports = { BlingTextField };
