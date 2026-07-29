// @ts-nocheck
const { Libg } = require("../../../../../../lib/Libg");
const { PiranhaMessage } = require("../../../../../titan/client/common/messaging/PiranhaMessage");
const { Libc } = require("../../../../../../lib/Libc");
const ctor = new NativeFunction(Libg.offset(13631940, 12743112), "void", ["pointer", "int"]),
  vtable = Libg.offset(18789624, 16974912);
class GoHomeMessage extends PiranhaMessage {
  constructor(value) {
    if (value instanceof NativePointer) {
      super(value);
      return;
    }
    const p = Libc.malloc(GoHomeMessage.allocationSize);
    ctor(p, 0);
    p.writePointer(vtable);
    super(p);
  }
}
GoHomeMessage.allocationSize = 144;
exports.GoHomeMessage = GoHomeMessage;
