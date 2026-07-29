// @ts-nocheck
const { PiranhaMessage } = require("../../../../../titan/client/common/messaging/PiranhaMessage");
const { Libc } = require("../../../../../../lib/Libc");
const { Libg } = require("../../../../../../lib/Libg");
const ctor = new NativeFunction(Libg.offset(12391692, 11306824), "void", ["pointer"]);
class TeamBotSlotDisableMessage extends PiranhaMessage {
  constructor(slot, disable = true) {
    const p = Libc.malloc(TeamBotSlotDisableMessage.allocationSize);
    ctor(p);
    p.add(144).writeS32(slot);
    p.add(148).writeU8(disable ? 1 : 0);
    super(p);
  }
}
TeamBotSlotDisableMessage.allocationSize = 152;
exports.TeamBotSlotDisableMessage = TeamBotSlotDisableMessage;
