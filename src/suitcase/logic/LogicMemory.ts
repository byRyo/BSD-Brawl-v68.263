// @ts-nocheck
const { Libg } = require("../../lib/Libg");

const gameMainAddress = Libg.offset(18064704, 18171840);
const bssSegmentSize = Process.platform === "linux" ? 128848 : 211008;

class LogicMemory {
  static offset(android, ios) {
    if (ios && Process.platform === "darwin") return ios;
    return android;
  }

  static byteLength(value) {
    let length = value.length;
    for (let index = value.length - 1; index >= 0; index--) {
      const code = value.charCodeAt(index);
      if (code > 127 && code <= 2047) length++;
      else if (code > 2047 && code <= 65535) length += 2;
      if (code >= 56320 && code <= 57343) index--;
    }
    return length;
  }

  static fillWithZeroes(pointer, length) {
    pointer.writeByteArray(new Uint8Array(length).buffer);
  }

  static ensurePointer(value) {
    if (typeof value === "string") return Memory.allocUtf8String(value);
    return value;
  }

  static clearBssSegment(delay) {
    setTimeout(() => {
      const module = Process.findModuleByAddress(gameMainAddress);
      if (module !== null) {
        for (const range of module.enumerateRanges("rw-")) {
          range.base.writeByteArray(Array(Math.min(bssSegmentSize, range.size)).fill(0));
        }
      }
    }, delay);
  }

  static cloneU8Field(destination, source, offset) {
    destination.add(offset).writeU8(source.add(offset).readU8());
  }

  static cloneU32Field(destination, source, offset) {
    destination.add(offset).writeU32(source.add(offset).readU32());
  }

  static clonePointerField(destination, source, offset) {
    destination.add(offset).writePointer(source.add(offset).readPointer());
  }
}

exports.LogicMemory = LogicMemory;
