// @ts-nocheck
const { BSDMessage } = require("../../BSDMessage");
const { BSDApi } = require("../../BSDApi");
const { PlayerInfo } = require("../../../../laser/client/game/friends/PlayerInfo");
const { LogicDailyData } = require("../../../../laser/client/logic/data/LogicDailyData");
const { Player } = require("../../../../laser/client/game/friends/Player");
const { MessageSignatureManager } = require("../../../crypto/MessageSignatureManager");

class LinkBSDPlusMessage extends BSDMessage {
  constructor(telegramTag) {
    const route = BSDApi.v1ApiRoute + BSDApi.linkTagRoute;
    const magicNumber = MessageSignatureManager.getMagicalNumberWithoutMultiplier();
    const data = {
      tg: LinkBSDPlusMessage.formatTelegramTag(telegramTag),
      tag: "#".concat(PlayerInfo.tag),
      trophies: LogicDailyData.getCurrentTrophies(),
      name: Player.ownName,
      magic_number: magicNumber,
      signature: "",
    };
    super(data, route);
    data.magic_number *= MessageSignatureManager.requestMagicalNumberMultiplier;
  }

  static formatTelegramTag(tag) {
    if (tag.startsWith("@")) return tag;
    if (tag.includes("t.me/")) {
      tag = tag
        .replace(/http[s]?:\/\//i, "")
        .replace("t.me", "")
        .replaceAll("/", "");
    }
    return "@".concat(tag);
  }
}

exports.LinkBSDPlusMessage = LinkBSDPlusMessage;
