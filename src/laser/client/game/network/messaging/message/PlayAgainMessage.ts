// @ts-nocheck
const { PiranhaMessage } = require("../../../../../titan/client/common/messaging/PiranhaMessage");
const { Libc } = require("../../../../../../lib/Libc");
const { Libg } = require("../../../../../../lib/Libg");
const ctor = new NativeFunction(Libg.offset(12443520, 11349652), "void", [
  "pointer",
  "bool",
  "bool",
]);
class PlayAgainMessage extends PiranhaMessage {
  constructor(value) {
    if (value instanceof NativePointer) {
      super(value);
      return;
    }
    const p = Libc.malloc(PlayAgainMessage.allocationSize);
    ctor(p, +value, 0);
    super(p);
  }
}
PlayAgainMessage.allocationSize = 152;
exports.PlayAgainMessage = PlayAgainMessage;
