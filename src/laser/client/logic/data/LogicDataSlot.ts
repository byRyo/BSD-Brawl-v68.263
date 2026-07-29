// @ts-nocheck
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicData } = require("./LogicData");

const dataOffset = LogicMemory.offset(8);

class LogicDataSlot {
  constructor(instance) {
    this.instance = instance;
  }

  getData() {
    return new LogicData(this.instance.add(dataOffset).readPointer());
  }
}

exports.LogicDataSlot = LogicDataSlot;
