// @ts-nocheck
const { BSDMessage } = require("../../BSDMessage");
const { BSDApi } = require("../../BSDApi");
const { PlayerInfo } = require("../../../../laser/client/game/friends/PlayerInfo");
const { MessageSignatureManager } = require("../../../crypto/MessageSignatureManager");
const { LogicRandom } = require("../../../logic/LogicRandom");

class GetBSDBattleProxyMessage extends BSDMessage {
  constructor(ip, port) {
    const route = BSDApi.v1ApiRoute + BSDApi.GET_PROXY;
    const data = {
      tag: "#".concat(PlayerInfo.tag),
      ip,
      port,
      magic_number: MessageSignatureManager.getMagicalNumberWithoutMultiplier(),
      signature: LogicRandom.getRandomInRangeExcept(343, 17777),
    };
    super(data, route);
    data.magic_number = Number(
      BigInt(data.magic_number) * BigInt(MessageSignatureManager.requestMagicalNumberMultiplier),
    );
  }
}

exports.GetBSDBattleProxyMessage = GetBSDBattleProxyMessage;
