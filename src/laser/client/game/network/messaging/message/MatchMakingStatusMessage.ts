// @ts-nocheck
const { LogicMemory } = require("../../../../../../suitcase/logic/LogicMemory");
const { PiranhaMessage } = require("../../../../../titan/client/common/messaging/PiranhaMessage");
const count = LogicMemory.offset(148),
  max = LogicMemory.offset(152);
class MatchMakingStatusMessage extends PiranhaMessage {
  get playerCount() {
    return this.instance.add(count).readInt();
  }
  get maxPlayers() {
    return this.instance.add(max).readInt();
  }
}
exports.MatchMakingStatusMessage = MatchMakingStatusMessage;
