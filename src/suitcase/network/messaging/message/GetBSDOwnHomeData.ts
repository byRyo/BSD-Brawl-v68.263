// @ts-nocheck
const { BSDMessage } = require("../../BSDMessage");
const { BSDApi } = require("../../BSDApi");
const { PlayerInfo } = require("../../../../laser/client/game/friends/PlayerInfo");
const { MessageSignatureManager } = require("../../../crypto/MessageSignatureManager");

class GetBSDOwnHomeData extends BSDMessage {
  constructor() {
    const route = BSDApi.v1ApiRoute + BSDApi.GET_BSD_OWN_HOME_DATA;
    const data = {
      tag: "#".concat(PlayerInfo.tag),
      magic_number: MessageSignatureManager.getMagicalNumberWithoutMultiplier(),
      signature: "",
    };
    super(data, route);
    data.magic_number = Number(
      BigInt(data.magic_number) * BigInt(MessageSignatureManager.requestMagicalNumberMultiplier),
    );
  }
}

exports.GetBSDOwnHomeData = GetBSDOwnHomeData;
