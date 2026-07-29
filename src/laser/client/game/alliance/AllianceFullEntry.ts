// @ts-nocheck
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicArrayList } = require("../../logic/data/LogicArrayList");
const { AllianceHeaderEntry } = require("./AllianceHeaderEntry");

const membersOffset = LogicMemory.offset(8);

class AllianceFullEntry {
  constructor(instance) {
    this.instance = instance;
  }
  get header() {
    return new AllianceHeaderEntry(this.instance.readPointer());
  }
  get members() {
    return new LogicArrayList(this.instance.add(membersOffset).readPointer());
  }
}

exports.AllianceFullEntry = AllianceFullEntry;
