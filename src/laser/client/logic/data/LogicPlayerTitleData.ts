// @ts-nocheck
const { Libc } = require("../../../../lib/Libc");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { StringObject } = require("../../../titan/client/native/StringObject");
const { LogicColorGradientData } = require("./LogicColorGradientData");
const { LogicData } = require("./LogicData");

const titleTidOffset = LogicMemory.offset(88);
const gradientOffset = LogicMemory.offset(104);

class LogicPlayerTitleData extends LogicData {
  get titleTid() {
    return this.readString(titleTidOffset);
  }
  set titleTid(value) {
    StringObject.create(value, this.instance.add(titleTidOffset));
  }
  get gradient() {
    return new LogicColorGradientData(this.readPointer(gradientOffset));
  }
  set gradient(value) {
    this.writePointer(gradientOffset, value.instance);
  }
  clone() {
    const instance = Libc.malloc(LogicPlayerTitleData.allocSize);
    Memory.copy(instance, this.instance, LogicPlayerTitleData.allocSize);
    return new LogicPlayerTitleData(instance);
  }
}
LogicPlayerTitleData.allocSize = 120;
exports.LogicPlayerTitleData = LogicPlayerTitleData;
