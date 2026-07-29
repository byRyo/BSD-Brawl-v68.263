// @ts-nocheck
const { Libc } = require("../../../../lib/Libc");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { EDebugger } = require("../../../../suitcase/debug/EDebugger");
const { LogicDataTables } = require("../data/LogicDataTables");

const dropCountOffset = LogicMemory.offset(4);
const characterOffset = LogicMemory.offset(8);
const skinOffset = LogicMemory.offset(16);
const vanityItemOffset = LogicMemory.offset(24);
const cardOffset = LogicMemory.offset(32);

const EGatchaDropTypes = {
  1: "CHARACTER",
  2: "TOKEN_DOUBLER",
  4: "SKILL",
  7: "GOLD",
  8: "DIAMONDS",
  9: "SKIN",
  11: "VANITY_ITEM",
  12: "STAR_POINTS",
  19: "POWER_POINTS_ANY_BRAWLER",
  20: "HERO_TO_TARGET_LEVEL",
  22: "RECRUIT_TOKENS",
  23: "CHROMATIC_TOKENS",
  24: "POWER_POINTS",
  25: "BLING",
  26: "BRAWL_PASS_PROGRESS",
  27: "NOTHING",
  31: "BRAWL_PASS_PREMIUM_PLUS_PROGRESS",
  38: "COMPETITIVE_PASS_POINTS",
  39: "DAILY_STREAK",
  CHARACTER: 1,
  TOKEN_DOUBLER: 2,
  SKILL: 4,
  GOLD: 7,
  DIAMONDS: 8,
  SKIN: 9,
  VANITY_ITEM: 11,
  STAR_POINTS: 12,
  POWER_POINTS_ANY_BRAWLER: 19,
  HERO_TO_TARGET_LEVEL: 20,
  RECRUIT_TOKENS: 22,
  CHROMATIC_TOKENS: 23,
  POWER_POINTS: 24,
  BLING: 25,
  BRAWL_PASS_PROGRESS: 26,
  NOTHING: 27,
  BRAWL_PASS_PREMIUM_PLUS_PROGRESS: 31,
  COMPETITIVE_PASS_POINTS: 38,
  DAILY_STREAK: 39,
};

class LogicGatchaDrop {
  constructor(type, count, data, tableId) {
    this.dropType = 0;
    this.dropCount = 0;
    this.instance = Libc.malloc(LogicGatchaDrop.allocationSize);
    this.instance.add(characterOffset).writePointer(NULL);
    this.instance.add(skinOffset).writePointer(NULL);
    this.instance.add(vanityItemOffset).writePointer(NULL);
    this.instance.add(cardOffset).writePointer(NULL);
    this.setDropType(type);
    this.setDropCount(count);
    if (data !== undefined) {
      switch (type) {
        case EGatchaDropTypes.CHARACTER:
        case EGatchaDropTypes.HERO_TO_TARGET_LEVEL:
          this.setCharacter(LogicDataTables.getDataById(LogicDataTables.table.Characters, data));
          break;
        case EGatchaDropTypes.SKILL:
          this.setCard(LogicDataTables.getDataById(LogicDataTables.table.Cards, data));
          break;
        case EGatchaDropTypes.SKIN:
          this.setSkin(LogicDataTables.getDataById(LogicDataTables.table.Skins, data));
          break;
        case EGatchaDropTypes.VANITY_ITEM:
          if (tableId === LogicDataTables.table.Emotes)
            this.setVanityItem(LogicDataTables.getDataById(LogicDataTables.table.Emotes, data));
          else if (tableId === LogicDataTables.table.Sprays)
            this.setVanityItem(LogicDataTables.getDataById(LogicDataTables.table.Sprays, data));
          else EDebugger.addMessage(EDebugger.ERROR, "Not valid VanityItem type!");
          break;
        default:
          EDebugger.addMessage(EDebugger.ERROR, "Not valid data!");
      }
    }
  }
  setDropType(value) {
    this.instance.writeInt(value);
  }
  setDropCount(value) {
    this.instance.add(dropCountOffset).writeInt(value);
  }
  setCharacter(value) {
    this.instance.add(characterOffset).writePointer(value.instance);
  }
  setSkin(value) {
    this.instance.add(skinOffset).writePointer(value.instance);
  }
  setVanityItem(value) {
    this.instance.add(vanityItemOffset).writePointer(value.instance);
  }
  setCard(value) {
    this.instance.add(cardOffset).writePointer(value.instance);
  }
}
LogicGatchaDrop.allocationSize = 56;
exports.EGatchaDropTypes = EGatchaDropTypes;
exports.LogicGatchaDrop = LogicGatchaDrop;
