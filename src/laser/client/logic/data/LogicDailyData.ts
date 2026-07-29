// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { SkinSelector } = require("../../../../suitcase/feature/SkinSelector");
const { Config } = require("../../../../suitcase/config/Config");
const { LogicDataTables } = require("./LogicDataTables");
const { LogicCharacterData } = require("./LogicCharacterData");
const { LogicSkinData } = require("./LogicSkinData");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { HomeMode } = require("../../game/state/homemode/HomeMode");
const { LogicArrayList } = require("./LogicArrayList");

const dailyDataLoadedAddress = Libg.offset(12537724, 11421752);
const LogicDailyData_getSkin = new NativeFunction(Libg.offset(12544636, 11425772), "pointer", [
  "pointer",
  "pointer",
  "pointer",
]);
const selectedSkinAddress = Libg.offset(12545500, 11426440);
const skinSelectionAddress = Libg.offset(9260788, 8771268);
const currentTrophiesOffset = LogicMemory.offset(0);
const maxTrophiesOffset = LogicMemory.offset(4);
const dayIndexOffset = LogicMemory.offset(8);
const secondsUntilDayChangeOffset = LogicMemory.offset(8);
const heroScoreSumOffset = LogicMemory.offset(12);
const highestHeroScoreSumOffset = LogicMemory.offset(12);
const heroScoreRewardOffset = LogicMemory.offset(20);
const trophyWorldMilestoneOffset = LogicMemory.offset(24);
const playerXpOffset = LogicMemory.offset(28);
const regionOffset = LogicMemory.offset(40);
const seasonSecondsLeftOffset = LogicMemory.offset(196);
const unlockedSkinsOffset = LogicMemory.offset(172);
const newItemsOffset = LogicMemory.offset(120);
const newItemsReadOffset = LogicMemory.offset(152);
const skinCallers = [
  Libg.offset(6319072, 6246076),
  Libg.offset(9815860, 9241276),
  Libg.offset(9780188, 9214780),
  Libg.offset(9205348, 7025056),
  Libg.offset(9243612, 8757764),
  Libg.offset(8371748, 8039220),
  Libg.offset(7752580, 7509964),
];

class LogicDailyData {
  static getCurrentTrophies() {
    return this.currentTrophies;
  }

  static getMaxTrophies() {
    return this.maxTrophies;
  }

  static getSeasonSecondsLeft() {
    const playerData = HomeMode.getPlayerData();
    if (playerData.isNull()) return -1;
    return playerData.add(seasonSecondsLeftOffset).readInt();
  }

  static getDayIndex(instance) {
    return instance.add(dayIndexOffset).readU32();
  }

  static getSecondsUntilDayChange(instance) {
    return instance.add(secondsUntilDayChangeOffset).readU32();
  }

  static getHeroScoreSum(instance) {
    return instance.add(heroScoreSumOffset).readU32();
  }

  static getHighestHeroScoreSum(instance) {
    return instance.add(highestHeroScoreSumOffset).readU32();
  }

  static getHeroScoreSumRewardClaimedUpToLevel(instance) {
    return instance.add(heroScoreRewardOffset).readU32();
  }

  static getTrophyWorldClaimedUpToMilestoneIndex(instance) {
    return instance.add(trophyWorldMilestoneOffset).readU32();
  }

  static getPlayerXp(instance) {
    return instance.add(playerXpOffset).readU32();
  }

  static getRegion(instance) {
    return instance.add(regionOffset).readPointer();
  }

  static getPlayerThumbnail(instance, character, skin) {
    return new LogicSkinData(LogicDailyData_getSkin(instance, character.instance, skin.instance));
  }

  static addUnlockedSkin(instance, skin) {
    if (!instance.isNull()) {
      new LogicArrayList(instance.add(unlockedSkinsOffset)).addElement(skin.instance);
    }
  }

  static addNewItem(instance, item) {
    if (!instance.isNull() && !item.isNull()) {
      new LogicArrayList(instance.add(newItemsOffset)).addElement(item);
    }
  }

  static getNewItems(instance) {
    if (instance.isNull()) return [];
    const list = new LogicArrayList(instance.add(newItemsReadOffset));
    const count = list.getItemsCount();
    const items = [];
    for (let index = 0; index < count; index++) {
      const item = list.getElement(index);
      if (!item.isNull()) items.push(item);
    }
    return items;
  }

  static patch() {
    Interceptor.attach(dailyDataLoadedAddress, {
      onEnter(args) {
        this.logicDailyData = args[0];
      },
      onLeave() {
        LogicDailyData.currentTrophies = this.logicDailyData.add(currentTrophiesOffset).readInt();
        LogicDailyData.maxTrophies = this.logicDailyData.add(maxTrophiesOffset).readInt();
      },
    });

    Interceptor.attach(LogicDailyData_getSkin, {
      onEnter(args) {
        this.character = new LogicCharacterData(args[2]);
      },
      onLeave(retval) {
        if (Config.config.DisableSkins) {
          const skin = this.character.getDefaultSkin();
          if (!skin.instance.isNull()) retval.replace(skin.instance);
          return;
        }
        if (
          SkinSelector.isInUse() &&
          skinCallers.some((address) => this.returnAddress.equals(address))
        ) {
          const name = this.character.getName();
          if (Config.config.SkinOverrides.hasOwnProperty(name)) {
            const skinName = Config.config.SkinOverrides[name];
            retval.replace(LogicDataTables.getSkinByName(skinName).instance);
          }
        }
      },
    });

    Interceptor.attach(selectedSkinAddress, {
      onLeave(retval) {
        if (SkinSelector.isInUse() && this.returnAddress.equals(skinSelectionAddress)) {
          retval.replace(ptr(1));
        }
      },
    });
  }
}

exports.LogicDailyData = LogicDailyData;
