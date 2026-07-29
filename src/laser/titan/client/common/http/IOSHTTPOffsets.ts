// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const nf = (offset, ret, args) => new NativeFunction(Libg.offset(0, offset), ret, args);
const HTTPClient_initWrapper = nf(14190784, "pointer", ["pointer"]),
  HTTPClient_get = nf(14193852, "void", ["pointer", "pointer", "pointer"]),
  HTTPClient_post = nf(14192720, "void", [
    "pointer",
    "pointer",
    "pointer",
    "int",
    "pointer",
    "pointer",
  ]),
  HTTPClient_download = nf(14190964, "void", ["pointer", "pointer", "pointer", "pointer"]),
  HTTPClient_getMainTrampoline = nf(14194604, "void", ["pointer"]),
  HTTPClient_postMainTrampoline = nf(14193548, "void", ["pointer"]),
  HTTPClient_downloadFinalize = nf(14192416, "void", ["pointer"]);
module.exports = {
  HTTPClient_initWrapper,
  HTTPClient_get,
  HTTPClient_post,
  HTTPClient_download,
  HTTPClient_getMainTrampoline,
  HTTPClient_postMainTrampoline,
  HTTPClient_downloadFinalize,
};
