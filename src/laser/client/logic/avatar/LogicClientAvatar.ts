// @ts-nocheck
const { EDebugger } = require("../../../../suitcase/debug/EDebugger");
const { LogicDataSlot } = require("../data/LogicDataSlot");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicDataTables } = require("../data/LogicDataTables");
const { Libg } = require("../../../../lib/Libg");

const getCommodityCount = new NativeFunction(Libg.offset(10801904, 10045520), "int", [
  "pointer",
  "pointer",
]);
const setItemNative = new NativeFunction(Libg.offset(10794252, 10039292), "void", [
  "pointer",
  "pointer",
]);
const unlockHeroNative = new NativeFunction(Libg.offset(10791228, 10036828), "void", [
  "pointer",
  "pointer",
  "int",
]);
const LogicClientAvatar_setCommodityCountOffset = Libg.offset(10790732, 10036528);
const setCommodityCount = new NativeFunction(LogicClientAvatar_setCommodityCountOffset, "void", [
  "pointer",
  "uint",
  "pointer",
  "uint",
  "uint",
]);
const changeCommodityCount = new NativeFunction(Libg.offset(10792144, 10037736), "pointer", [
  "pointer",
  "uint",
  "pointer",
  "int",
  "uint",
  "uchar",
  "pointer",
  "pointer",
  "int",
  "int",
]);
const getDataIndexNative = new NativeFunction(Libg.offset(10793392, 10038704), "int", [
  "pointer",
  "int",
  "pointer",
]);
const heroScoreOffset = LogicMemory.offset(12);
const heroPowerOffset = LogicMemory.offset(72);
const heroLvlUpMaterialOffset = LogicMemory.offset(80);
const tutorialsCompletedCountOffset = LogicMemory.offset(104);
const heroSeenStateOffset = LogicMemory.offset(368);
const diamondsOffset = LogicMemory.offset(640, 764);

class LogicClientAvatar {
  constructor(instance) {
    this.instance = instance;
  }

  getDataIndex(array, data) {
    const count = array.add(heroScoreOffset).readInt();
    if (count < 1) {
      EDebugger.addMessage(EDebugger.ERROR, "CommodityArrayList length is empty!");
      return -1;
    }
    for (let i = 0; i < count; i++) {
      const item = new LogicDataSlot(
        array
          .readPointer()
          .add(i * Process.pointerSize)
          .readPointer(),
      ).getData();
      if (item.equals(data)) return i;
    }
    return -1;
  }

  getCommodityCount(type, data) {
    return getCommodityCount(this.instance, type, data.instance);
  }
  getHeroScore(character) {
    const array = this.instance.add(heroScoreOffset).readPointer();
    const index = this.getDataIndex(array, character);
    return index === -1
      ? 0
      : array
          .readPointer()
          .add(index * Process.pointerSize)
          .readPointer()
          .readInt();
  }
  getHeroPower(character) {
    const array = this.instance.add(heroPowerOffset).readPointer();
    const index = this.getDataIndex(array, character);
    return index === -1
      ? 0
      : array
          .readPointer()
          .add(index * Process.pointerSize)
          .readPointer()
          .readInt();
  }
  getHeroLvlUpMaterial() {
    const data = LogicDataTables.getLvlUpMaterialData();
    const array = this.instance.add(heroLvlUpMaterialOffset);
    const index = this.getDataIndex(array, data);
    return index === -1
      ? 0
      : array
          .readPointer()
          .add(index * Process.pointerSize)
          .readPointer()
          .readInt();
  }
  tutorialsCompletedCountOffset() {
    return this.instance.add(tutorialsCompletedCountOffset).readInt();
  }
  getHeroSeenState(character) {
    return this.instance.isNull() ? 0 : getDataIndexNative(this.instance, character.instance);
  }
  setItem(item) {
    if (!this.instance.isNull() && !item.instance.isNull())
      setItemNative(this.instance, item.instance);
  }
  unlockHero(character, level = 3) {
    if (!this.instance.isNull() && !character.isNull())
      unlockHeroNative(this.instance, character, level);
  }
  setDiamonds(value) {
    if (!this.instance.isNull()) this.instance.add(diamondsOffset).writeInt(value);
  }
  setCommodityCount(type, data, count, reason) {
    if (!this.instance.isNull() && !data.isNull())
      setCommodityCount(this.instance, type, data, count, reason);
  }
  changeCommodityCount(type, data, count, reason, notify = 1) {
    if (!this.instance.isNull() && !data.isNull()) {
      changeCommodityCount(this.instance, type, data, count, reason, notify, NULL, NULL, -1, -1);
    }
  }
}
LogicClientAvatar.maxHeroPowerPoints = 3740;
LogicClientAvatar.commodityType = {
  Resource: 0,
  PeakTrophies: 2,
  HeroLevel: 5,
  HeroSeenState: 7,
  Highscore: 17,
  AvatarPassiveRecruit: 31,
  AvatarPassive: 33,
};
exports.LogicClientAvatar_setCommodityCountOffset = LogicClientAvatar_setCommodityCountOffset;
exports.LogicClientAvatar = LogicClientAvatar;
