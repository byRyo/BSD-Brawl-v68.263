// @ts-nocheck
const { LogicGatchaDrop, EGatchaDropTypes } = require("../LogicGatchaDrop");
const { LogicDataTables } = require("../../data/LogicDataTables");
const { LogicRandom } = require("../../../../../suitcase/logic/LogicRandom");

const EEmoteRarities = { 0: "COMMON", 1: "RARE", 2: "EPIC", COMMON: 0, RARE: 1, EPIC: 2 };
const ESkinRarities = {
  0: "RARE",
  1: "SUPER_RARE",
  2: "EPIC",
  3: "MYTHIC",
  4: "LEGENDARY",
  5: "HYPERCHARGE",
  6: "COLLECTORS",
  RARE: 0,
  SUPER_RARE: 1,
  EPIC: 2,
  MYTHIC: 3,
  LEGENDARY: 4,
  HYPERCHARGE: 5,
  COLLECTORS: 6,
};

class LogicOwnGatchaRandomReward {
  constructor(weight, count, type, tableId = -1, rarity = 1) {
    this.count = 0;
    this.type = 0;
    this.tableId = -1;
    this.rarity = 1;
    this.weight = 0;
    this.count = count;
    this.type = type;
    this.tableId = tableId;
    this.rarity = rarity;
    this.weight = weight;
  }
  getGatchaDrop() {
    let id = -1;
    if (this.type === EGatchaDropTypes.CHARACTER) {
      const items = LogicOwnGatchaRandomReward.getCharacters();
      id = items[LogicRandom.getRandomInRangeExcept(0, items.length - 1)].getInstanceID();
    } else if (this.type === EGatchaDropTypes.VANITY_ITEM) {
      if (this.tableId === LogicDataTables.table.Emotes && this.rarity === EEmoteRarities.COMMON) {
        const items = LogicOwnGatchaRandomReward.getEmotesByRarity(this.rarity);
        id = items[LogicRandom.getRandomInRangeExcept(0, items.length - 1)].getInstanceID();
      } else if (this.tableId === LogicDataTables.table.Sprays) {
        const table = LogicDataTables.getTable(LogicDataTables.table.Sprays);
        id = table
          .getItemAt(LogicRandom.getRandomInRangeExcept(0, table.getItemCount() - 1))
          .getInstanceID();
      }
    }
    return id !== -1
      ? new LogicGatchaDrop(this.type, this.count, id, this.tableId)
      : new LogicGatchaDrop(this.type, this.count);
  }
  static getCharacters() {
    const table = LogicDataTables.getTable(LogicDataTables.table.Characters);
    const result = [];
    for (let i = 0; i < table.getItemCount(); i++) {
      const item = table.getItemAt(i);
      if (item.isHero() && !item.isDisabled()) result.push(item);
    }
    return result;
  }
  static getEmotesByRarity(rarity) {
    const table = LogicDataTables.getTable(LogicDataTables.table.Emotes);
    const result = [];
    for (let i = 0; i < table.getItemCount(); i++) {
      const item = table.getItemAt(i);
      if (item.getRarity() === EEmoteRarities[rarity]) result.push(item);
    }
    return result;
  }
  static getSkinsByRarity(rarity) {
    const table = LogicDataTables.getTable(LogicDataTables.table.Skins);
    const result = [];
    for (let i = 0; i < table.getItemCount(); i++) {
      const item = table.getItemAt(i);
      if (item.getRarity() === ESkinRarities[rarity]) result.push(item);
    }
    return result;
  }
}
exports.EEmoteRarities = EEmoteRarities;
exports.ESkinRarities = ESkinRarities;
exports.LogicOwnGatchaRandomReward = LogicOwnGatchaRandomReward;
