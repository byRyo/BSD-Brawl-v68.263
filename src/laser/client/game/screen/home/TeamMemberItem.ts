// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Config } = require("../../../../../suitcase/config/Config");

const teamMemberItemCtor = Libg.offset(8066952, 7777972);

class TeamMemberItem {
  static patch() {
    Interceptor.attach(teamMemberItemCtor, {
      onEnter(args) {
        if (Config.config.ShowFriendlyRoomOpponents) args[6] = ptr(255);
      },
    });
  }
}

exports.TeamMemberItem = TeamMemberItem;
