// @ts-nocheck
const { Libc } = require("../../../../../lib/Libc");
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const { LogicData } = require("../../data/LogicData");
const { LogicDataTables } = require("../../data/LogicDataTables");

const countOffset = LogicMemory.offset(4);
const dataOffset = LogicMemory.offset(8);
const extraDataOffset = LogicMemory.offset(16);

class LogicGemOffer {
  constructor(instance) {
    if (instance) this.instance = instance;
    else {
      this.instance = Libc.malloc(LogicGemOffer.allocationSize);
      this.setType(0);
      this.setCount(0);
      this.setExtraData(0);
    }
  }
  setType(value) {
    this.instance.writeInt(value);
  }
  setCount(value) {
    this.instance.add(countOffset).writeInt(value);
  }
  setData(value) {
    this.instance.add(dataOffset).writePointer(value.instance ?? value);
  }
  setExtraData(value) {
    this.instance.add(extraDataOffset).writeInt(value);
  }
  getType() {
    return this.instance.readInt();
  }
  getCount() {
    return this.instance.add(countOffset).readInt();
  }
  getData() {
    return this.instance.add(dataOffset).readPointer();
  }
  getExtraData() {
    return this.instance.add(extraDataOffset).readInt();
  }
  getSkin() {
    const id = this.getExtraData();
    return id === 0 ? null : LogicDataTables.getDataById(29, id);
  }
  toString() {
    const data = this.getData().isNull() ? "none" : new LogicData(this.getData()).getGlobalID();
    return "LogicGemOffer{type=".concat(
      this.getType(),
      ",count=",
      this.getCount(),
      ",data=",
      data,
      ",extraData=",
      this.getExtraData(),
      "}",
    );
  }
}
LogicGemOffer.allocationSize = 24;
exports.LogicGemOffer = LogicGemOffer;
