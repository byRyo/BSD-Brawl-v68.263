// @ts-nocheck
const { BSDMessage } = require("../../BSDMessage");
const { BSDApi } = require("../../BSDApi");
const { MessageSignatureManager } = require("../../../crypto/MessageSignatureManager");
const { LogicRandom } = require("../../../logic/LogicRandom");
const { PlayerInfo } = require("../../../../laser/client/game/friends/PlayerInfo");

class GetBSDUsersByMask extends BSDMessage {
  constructor(data, gameMode = "NULL") {
    const route = BSDApi.v1ApiRoute + BSDApi.GET_BSD_USERS_BY_MASK;
    super(
      {
        data,
        magic_number: MessageSignatureManager.getMagicalNumberWithoutMultiplier(),
        signature: LogicRandom.getRandomInRangeExcept(15251, 414124),
        tag: "#".concat(PlayerInfo.tag),
        gameMode,
      },
      route,
    );
  }
}

exports.GetBSDUsersByMask = GetBSDUsersByMask;
