// @ts-nocheck
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicData } = require("./LogicData");
const multiDropCountOffset = LogicMemory.offset(96);
const visualTypeOffset = LogicMemory.offset(160, 152);
const groupTypeOffset = LogicMemory.offset(328, 320);
const collabIdOffset = LogicMemory.offset(336, 328);

class LogicRandomRewardContainerData extends LogicData {
  get multiDropCount() {
    return this.readS32(multiDropCountOffset);
  }
  get visualType() {
    return this.readS32(visualTypeOffset);
  }
  set visualType(value) {
    this.instance.add(visualTypeOffset).writeInt(value);
  }
  get groupType() {
    return this.readS32(groupTypeOffset);
  }
  get collabId() {
    return this.readS32(collabIdOffset);
  }
}
exports.LogicRandomRewardContainerData = LogicRandomRewardContainerData;
