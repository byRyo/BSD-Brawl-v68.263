// @ts-nocheck
const { Libc } = require("../../../lib/Libc");
const { LogicMemory } = require("../../../suitcase/logic/LogicMemory");

const lowOffset = LogicMemory.offset(4, 4);

class LogicLong {
  constructor(high, low) {
    this.instance = Libc.malloc(8);
    if (high instanceof NativePointer) {
      this.instance.writeInt(high.readInt());
      this.instance.add(lowOffset).writeInt(high.add(lowOffset).readInt());
    } else {
      this.instance.writeInt(high);
      this.instance.add(lowOffset).writeInt(low);
    }
  }

  getHigh() {
    return this.instance.readInt();
  }
  getLow() {
    return this.instance.add(lowOffset).readInt();
  }
  equals(other) {
    return !!other && this.getHigh() === other.getHigh() && this.getLow() === other.getLow();
  }
  toString() {
    return "LogicLong(".concat(this.getHigh(), ", ", this.getLow(), ")");
  }
}

exports.LogicLong = LogicLong;
