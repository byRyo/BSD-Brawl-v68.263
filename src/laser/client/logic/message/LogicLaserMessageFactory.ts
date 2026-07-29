// @ts-nocheck
const { PiranhaMessage } = require("../../../titan/client/common/messaging/PiranhaMessage");
const { AllianceDataMessage } = require("../../game/network/messaging/message/AllianceDataMessage");
const { BattleEndMessage } = require("../../game/network/messaging/message/BattleEndMessage");
const { FriendListMessage } = require("../../game/network/messaging/message/FriendListMessage");
const {
  MatchMakingStatusMessage,
} = require("../../game/network/messaging/message/MatchMakingStatusMessage");
const { MyAllianceMessage } = require("../../game/network/messaging/message/MyAllianceMessage");
const {
  PlayAgainStatusMessage,
} = require("../../game/network/messaging/message/PlayAgainStatusMessage");

class LogicLaserMessageFactory {
  static createMessageByInstance(instance) {
    switch (PiranhaMessage.getMessageType(instance)) {
      case 20105:
        return new FriendListMessage(instance);
      case 20405:
        return new MatchMakingStatusMessage(instance);
      case 23456:
        return new BattleEndMessage(instance);
      case 24301:
        return new AllianceDataMessage(instance);
      case 24399:
        return new MyAllianceMessage(instance);
      case 24777:
        return new PlayAgainStatusMessage(instance);
      default:
        return new PiranhaMessage(instance);
    }
  }
}
exports.LogicLaserMessageFactory = LogicLaserMessageFactory;
