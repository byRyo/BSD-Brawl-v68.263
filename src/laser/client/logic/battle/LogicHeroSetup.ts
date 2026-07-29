// @ts-nocheck
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicBattleEmotes } = require("./LogicBattleEmotes");
const { LogicCharacterData } = require("../data/LogicCharacterData");
const { LogicSkinData } = require("../data/LogicSkinData");

const skinOffset = LogicMemory.offset(16);
const battleEmotesOffset = LogicMemory.offset(32);

class LogicHeroSetup {
  constructor(instance) {
    this.instance = instance;
  }
  getEntry(index = 0) {
    return index
      ? this.instance.add(index * Process.pointerSize).readPointer()
      : this.instance.readPointer();
  }
  getSkin(index = 0) {
    return new LogicSkinData(this.getEntry(index).add(skinOffset).readPointer());
  }
  setSkin(skin, index) {
    this.getEntry(index).add(skinOffset).writePointer(skin.instance);
  }
  getLogicCharacterData(index = 0) {
    return new LogicCharacterData(this.getEntry(index).readPointer());
  }
  getLogicBattleEmotes() {
    if (this.instance.isNull() || this.getEntry().isNull()) return;
    const pointer = this.getEntry().add(battleEmotesOffset).readPointer();
    return pointer.isNull() ? undefined : new LogicBattleEmotes(pointer.readPointer());
  }
}
exports.LogicHeroSetup = LogicHeroSetup;
