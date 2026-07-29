// @ts-nocheck
const { LogicData } = require("./LogicData");
const { LogicSkinConfData } = require("./LogicSkinConfData");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { Libc } = require("../../../../lib/Libc");

const confOffset = LogicMemory.offset(152);
const petSkinOffset = LogicMemory.offset(160);
const petSkin2Offset = LogicMemory.offset(168);
const allocationSize = LogicMemory.offset(248);

class LogicSkinData extends LogicData {
  getCharacter() {
    return this.getConf()?.getCharacter();
  }
  getConf() {
    return this.readWrappedPointer(confOffset, (instance) => new LogicSkinConfData(instance));
  }
  setConf(conf) {
    this.writePointer(confOffset, conf.instance);
  }
  getRarity() {
    return this.getStringValueAt(27);
  }
  getPetSkin() {
    return this.readWrappedPointer(petSkinOffset, (instance) => new LogicSkinData(instance));
  }
  getPetSkin2() {
    return this.readWrappedPointer(petSkin2Offset, (instance) => new LogicSkinData(instance));
  }
  clone() {
    const instance = Libc.malloc(allocationSize);
    Memory.copy(instance, this.instance, allocationSize);
    return new LogicSkinData(instance);
  }
}
exports.LogicSkinData = LogicSkinData;
