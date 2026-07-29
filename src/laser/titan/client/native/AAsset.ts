// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");

class AAsset {}

AAsset.close = new NativeFunction(Libg.offset(18497520, 0), "void", ["pointer"]);
AAsset.getLength64 = new NativeFunction(Libg.offset(18500448, 0), "size_t", ["pointer"]);
AAsset.read = new NativeFunction(Libg.offset(18497536, 0), "int", ["pointer", "pointer", "size_t"]);
AAsset.open = new NativeFunction(Libg.offset(18497488, 0), "pointer", [
  "pointer",
  "pointer",
  "int",
]);

exports.AAsset = AAsset;
