// @ts-nocheck
const { PiranhaMessage } = require("../../../../../titan/client/common/messaging/PiranhaMessage");
const { Libc } = require("../../../../../../lib/Libc");
const { Libg } = require("../../../../../../lib/Libg");

const CancelMatchmakingMessage_ctor = new NativeFunction(Libg.offset(12469716, 11370460), "void", [
  "pointer",
]);

class CancelMatchmakingMessage extends PiranhaMessage {
  constructor() {
    const p = Libc.malloc(CancelMatchmakingMessage.allocationSize);
    CancelMatchmakingMessage_ctor(p);
    super(p);
  }
}

CancelMatchmakingMessage.allocationSize = 144;
exports.CancelMatchmakingMessage_ctor = CancelMatchmakingMessage_ctor;
exports.CancelMatchmakingMessage = CancelMatchmakingMessage;
