// @ts-nocheck
const { Libg } = require("../../../../../../lib/Libg");
const { Libc } = require("../../../../../../lib/Libc");
const { PiranhaMessage } = require("../../../../../titan/client/common/messaging/PiranhaMessage");
const address = Libg.offset(12403048, 11316880),
  ctor = new NativeFunction(address, "void", ["pointer", "int"]);
class TeamMemberStatusMessage extends PiranhaMessage {
  constructor(value) {
    if (!value || typeof value === "number") {
      const p = Libc.malloc(TeamMemberStatusMessage.allocationSize);
      ctor(p, value ?? 3);
      super(p);
    } else super(value);
  }
  static patch() {
    Interceptor.attach(address, {
      onEnter(args) {
        if (TeamMemberStatusMessage.teamMemberStatus !== -1)
          args[1] = ptr(TeamMemberStatusMessage.teamMemberStatus);
      },
    });
  }
}
TeamMemberStatusMessage.allocationSize = 152;
TeamMemberStatusMessage.teamMemberStatus = -1;
exports.TeamMemberStatusMessage = TeamMemberStatusMessage;
