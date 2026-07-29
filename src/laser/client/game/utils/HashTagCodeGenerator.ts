// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicLong } = require("../../logic/LogicLong");
const { StringObject } = require("../../../titan/client/native/StringObject");

const nativeConversion = new NativeFunction(Libg.offset(12996684, 11730932), "pointer", [
  "pointer",
  "pointer",
]);

class HashTagCodeGenerator {
  static convertLongToPlayerTag(value) {
    const high = value instanceof LogicLong ? value.getHigh() : value.readInt();
    const low = value instanceof LogicLong ? value.getLow() : value.add(4).readInt();
    let combined = int64(low).shl(8).add(high).toNumber();
    let result = "";
    while (combined > 0) {
      const remainder = combined % this.CONVERSION_CHARS.length;
      result += this.CONVERSION_CHARS[remainder];
      combined -= remainder;
      combined /= this.CONVERSION_CHARS.length;
    }
    return result.split("").reverse().join("");
  }

  static convertPlayerTagToLong(tag) {
    const characters = tag.toUpperCase().split("");
    let value = 0;
    if (characters[0] === "#") characters.shift();
    for (const character of characters) {
      const index = this.CONVERSION_CHARS.indexOf(character);
      value *= this.CONVERSION_CHARS.length;
      value += index;
    }
    return new LogicLong(value % 256, (value - (value % 256)) / 256);
  }

  static patch() {
    Interceptor.attach(nativeConversion, {
      onLeave(retval) {
        HashTagCodeGenerator.lastConvertedTag = StringObject.read(retval).substring(1);
      },
    });
  }
}

HashTagCodeGenerator.CONVERSION_CHARS = "0289PYLQGRJCUV";
exports.HashTagCodeGenerator = HashTagCodeGenerator;
