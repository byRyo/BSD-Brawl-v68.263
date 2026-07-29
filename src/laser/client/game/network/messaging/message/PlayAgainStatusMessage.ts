// @ts-nocheck
const { PiranhaMessage } = require("../../../../../titan/client/common/messaging/PiranhaMessage");
const { LogicMemory } = require("../../../../../../suitcase/logic/LogicMemory");
const offset = LogicMemory.offset(144);
class PlayAgainStatusMessage extends PiranhaMessage {
  getPlayAgainStatus() {
    return this.instance.add(offset).readPointer().readInt();
  }
}
exports.PlayAgainStatusMessage = PlayAgainStatusMessage;
