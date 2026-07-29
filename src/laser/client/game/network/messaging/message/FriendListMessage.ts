// @ts-nocheck
const { LogicMemory } = require("../../../../../../suitcase/logic/LogicMemory");
const { PiranhaMessage } = require("../../../../../titan/client/common/messaging/PiranhaMessage");
const { LogicArrayList } = require("../../../../logic/data/LogicArrayList");
const offset = LogicMemory.offset(144);
class FriendListMessage extends PiranhaMessage {
  get friendList() {
    return new LogicArrayList(this.instance.add(offset).readPointer());
  }
}
FriendListMessage.friendsIds = new Set();
exports.FriendListMessage = FriendListMessage;
