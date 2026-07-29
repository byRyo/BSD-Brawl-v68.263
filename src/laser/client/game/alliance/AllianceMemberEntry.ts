// @ts-nocheck
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicLong } = require("../../logic/LogicLong");

const playerIdOffset = LogicMemory.offset(40);

class AllianceMemberEntry {
  constructor(instance) {
    this.instance = instance;
  }
  get playerId() {
    return new LogicLong(this.instance.add(playerIdOffset).readPointer());
  }
}

exports.AllianceMemberEntry = AllianceMemberEntry;
