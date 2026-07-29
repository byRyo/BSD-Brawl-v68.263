// @ts-nocheck
const { LogicLong } = require("../../logic/LogicLong");

class AllianceHeaderEntry {
  constructor(instance) {
    this.instance = instance;
  }
  get allianceId() {
    return new LogicLong(this.instance.readPointer());
  }
}

exports.AllianceHeaderEntry = AllianceHeaderEntry;
