// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg"),
  { StringObject } = require("../../native/StringObject");
const findNative = new NativeFunction(Libg.offset(10492900, 9825628), "pointer", [
    "pointer",
    "pointer",
  ]),
  replaceNative = new NativeFunction(Libg.offset(10488660, 9822268), "void", [
    "pointer",
    "pointer",
    "pointer",
    "pointer",
  ]);
class MovieClipHelper {
  static findButtonByName(instance, name) {
    return findNative(instance, name);
  }
  static replaceChildWithMovieClip(parent, name, file, exportName) {
    const values = [name, file, exportName].map(StringObject.create);
    replaceNative(parent.instance, values[0], values[1], values[2]);
    StringObject.clear(...values);
  }
}
module.exports = { MovieClipHelper };
