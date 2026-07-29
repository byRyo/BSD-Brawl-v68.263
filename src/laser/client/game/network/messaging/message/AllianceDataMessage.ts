// @ts-nocheck
const { LogicMemory } = require("../../../../../../suitcase/logic/LogicMemory");
const { PiranhaMessage } = require("../../../../../titan/client/common/messaging/PiranhaMessage");
const { AllianceFullEntry } = require("../../../alliance/AllianceFullEntry");

const offset = LogicMemory.offset(152);

class AllianceDataMessage extends PiranhaMessage {
  get fullEntry() {
    return new AllianceFullEntry(this.instance.add(offset).readPointer());
  }
}

exports.AllianceDataMessage = AllianceDataMessage;
