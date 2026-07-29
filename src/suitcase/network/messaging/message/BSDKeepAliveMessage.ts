// @ts-nocheck
const { BSDMessage } = require("../../BSDMessage");
const { BSDApi } = require("../../BSDApi");
const { MessageSignatureManager } = require("../../../crypto/MessageSignatureManager");
const { BSDPlusManager } = require("../../../validation/BSDPlusManager");
const { PlayerInfo } = require("../../../../laser/client/game/friends/PlayerInfo");

class BSDKeepAliveMessage extends BSDMessage {
  constructor() {
    const route = BSDApi.v1ApiRoute + BSDApi.KEEP_ALIVE;
    const data = {
      data: "".concat(+BSDPlusManager.isBSDPlusEnabled, "#", PlayerInfo.tag),
      magic_number: MessageSignatureManager.getMagicalNumberWithoutMultiplier(),
      signature: "",
    };
    super(data, route);
    data.magic_number = Number(
      BigInt(data.magic_number) * BigInt(MessageSignatureManager.requestMagicalNumberMultiplier),
    );
  }
}

exports.BSDKeepAliveMessage = BSDKeepAliveMessage;
