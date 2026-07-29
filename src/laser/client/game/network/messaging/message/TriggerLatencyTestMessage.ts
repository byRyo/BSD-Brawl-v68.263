// @ts-nocheck
const { PiranhaMessage } = require("../../../../../titan/client/common/messaging/PiranhaMessage");
const { Libg } = require("../../../../../../lib/Libg");
const { Libc } = require("../../../../../../lib/Libc");
const ctor = new NativeFunction(Libg.offset(13640656, 12751808), "void", ["pointer"]);
class TriggerLatencyTestMessage extends PiranhaMessage {
  constructor() {
    const p = Libc.malloc(TriggerLatencyTestMessage.allocationSize);
    ctor(p);
    super(p);
  }
}
TriggerLatencyTestMessage.allocationSize = 160;
exports.TriggerLatencyTestMessage = TriggerLatencyTestMessage;
