// @ts-nocheck
const { Libc } = require("../../../../../lib/Libc");
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const { StringObject } = require("../../../../titan/client/native/StringObject");

const allocationSize = 40;
const startTimeOffset = LogicMemory.offset(0);
const endTimeOffset = LogicMemory.offset(4);
const messageOffset = LogicMemory.offset(8);
const showCountdownOffset = LogicMemory.offset(16);
const titleOffset = LogicMemory.offset(24);

class MaintenanceModeInfo {
  constructor(instance) {
    this.instance = instance;
  }
  static alloc(startTime, endTime, showCountdown, title) {
    const instance = Libc.calloc(allocationSize, 1);
    instance.add(startTimeOffset).writeInt(startTime);
    instance.add(endTimeOffset).writeInt(endTime);
    instance.add(messageOffset).writePointer(NULL);
    instance.add(showCountdownOffset).writeU8(showCountdown ? 1 : 0);
    StringObject.create(title, instance.add(titleOffset));
    return new MaintenanceModeInfo(instance);
  }
}

module.exports = { MaintenanceModeInfo };
