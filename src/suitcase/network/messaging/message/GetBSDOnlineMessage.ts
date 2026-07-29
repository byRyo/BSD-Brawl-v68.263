// @ts-nocheck
const { BSDMessage } = require("../../BSDMessage");
const { BSDApi } = require("../../BSDApi");
const { MessageSignatureManager } = require("../../../crypto/MessageSignatureManager");
const { LogicRandom } = require("../../../logic/LogicRandom");

class GetBSDOnlineMessage extends BSDMessage {
  constructor() {
    const route = BSDApi.v1ApiRoute + BSDApi.GET_BSD_ONLINE;
    super(
      {
        magic_number: MessageSignatureManager.getMagicalNumberWithoutMultiplier(),
        signature: LogicRandom.getRandomInRangeExcept(12, 416),
      },
      route,
    );
  }
}

GetBSDOnlineMessage.lastOnline = 0;

exports.GetBSDOnlineMessage = GetBSDOnlineMessage;
