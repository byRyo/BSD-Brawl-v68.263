// @ts-nocheck
const { PlayerInfo } = require("../../../../laser/client/game/friends/PlayerInfo");
const { MessageSignatureManager } = require("../../../crypto/MessageSignatureManager");
const { BSDApi } = require("../../BSDApi");
const { BSDMessage } = require("../../BSDMessage");

class BSDReportBattleEndResultsMessage extends BSDMessage {
  constructor(result) {
    const route = BSDApi.v1ApiRoute + BSDApi.REPORT_BATTLEEND_RESULTS;
    const data = {
      tag: "$".concat(PlayerInfo.tag),
      magic_number: MessageSignatureManager.getMagicalNumberWithoutMultiplier(),
      signature: "",
      data: result,
    };
    super(data, route);
    data.magic_number = Number(
      BigInt(data.magic_number) * BigInt(MessageSignatureManager.requestMagicalNumberMultiplier),
    );
  }
}

exports.BSDReportBattleEndResultsMessage = BSDReportBattleEndResultsMessage;
