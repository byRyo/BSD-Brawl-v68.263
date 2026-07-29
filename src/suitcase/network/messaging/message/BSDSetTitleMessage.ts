// @ts-nocheck
const { BSDMessage } = require("../../BSDMessage");
const { BSDApi } = require("../../BSDApi");
const { PlayerInfo } = require("../../../../laser/client/game/friends/PlayerInfo");
const { MessageSignatureManager } = require("../../../crypto/MessageSignatureManager");

class BSDSetTitleMessage extends BSDMessage {
  constructor(title) {
    const route = BSDApi.v1ApiRoute + BSDApi.setTitleRoute;
    const magicNumber = MessageSignatureManager.getMagicalNumberWithoutMultiplier();
    const data = {
      tag: "#".concat(PlayerInfo.tag),
      custom_title: BSDSetTitleMessage.formatTitle(title),
      magic_number: magicNumber,
      signature: "",
    };
    super(data, route);
    data.magic_number *= MessageSignatureManager.requestMagicalNumberMultiplier;
  }

  static formatTitle(title) {
    return title;
  }
}

exports.BSDSetTitleMessage = BSDSetTitleMessage;
