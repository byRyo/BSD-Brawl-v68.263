// @ts-nocheck
const { LogicMemory } = require("../../../../../../suitcase/logic/LogicMemory");
const { PiranhaMessage } = require("../../../../../titan/client/common/messaging/PiranhaMessage");
const { AllianceHeaderEntry } = require("../../../alliance/AllianceHeaderEntry");
const offset = LogicMemory.offset(160);
class MyAllianceMessage extends PiranhaMessage {
  get header() {
    const p = this.instance.add(offset).readPointer();
    return p.isNull() ? null : new AllianceHeaderEntry(p);
  }
}
MyAllianceMessage.membersIds = new Set();
exports.MyAllianceMessage = MyAllianceMessage;
