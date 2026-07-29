// @ts-nocheck
const { PlayerInfo } = require("../../../../laser/client/game/friends/PlayerInfo");
const { MessageSignatureManager } = require("../../../crypto/MessageSignatureManager");
const { BSDApi } = require("../../BSDApi");
const { BSDMessage } = require("../../BSDMessage");

const EUnlinkStatus = {
  0: "BEGAN",
  1: "UNLINKED",
  2: "UNLINK_STOP",
  BEGAN: 0,
  UNLINKED: 1,
  UNLINK_STOP: 2,
};

class UnlinkTelegramAccountMessage extends BSDMessage {
  constructor(startUnlink) {
    const route = BSDApi.v1ApiRoute + BSDApi.UNLINK_TELEGRAM_ACCOUNT;
    const data = {
      tag: "#".concat(PlayerInfo.tag),
      startUnlink,
      magic_number: MessageSignatureManager.getMagicalNumberWithoutMultiplier(),
      signature: "",
    };
    super(data, route);
    data.magic_number *= MessageSignatureManager.requestMagicalNumberMultiplier;
  }
}

exports.EUnlinkStatus = EUnlinkStatus;
exports.UnlinkTelegramAccountMessage = UnlinkTelegramAccountMessage;
