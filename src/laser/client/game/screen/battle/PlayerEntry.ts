// @ts-nocheck
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const { Libg } = require("../../../../../lib/Libg");
const { SkinSelector } = require("../../../../../suitcase/feature/SkinSelector");
const { GameMain } = require("../../../GameMain");
const { LogicData } = require("../../../logic/data/LogicData");
const { Config } = require("../../../../../suitcase/config/Config");
const { LogicDataTables } = require("../../../logic/data/LogicDataTables");
const { LogicLong } = require("../../../logic/LogicLong");
const { PlayerDisplayData } = require("../../friends/PlayerDisplayData");

const playerEntryCtor = new NativeFunction(Libg.offset(12445772, 11351604), "void", [
  "pointer",
  "pointer",
]);
const playerIdOffset = LogicMemory.offset(96);
const displayDataOffset = LogicMemory.offset(8);
const killsOffset = LogicMemory.offset(24);
const deathsOffset = LogicMemory.offset(20);
const damageOffset = LogicMemory.offset(104);
const healOffset = LogicMemory.offset(136);
const characterCountOffset = LogicMemory.offset(140);
const characterArrayOffset = LogicMemory.offset(144);
const skinArrayOffset = LogicMemory.offset(148);

class PlayerEntry {
  constructor(instance) {
    this.instance = instance;
  }

  get playerId() {
    const instance = this.instance.add(playerIdOffset).readPointer();
    if (instance.isNull()) return null;
    return new LogicLong(instance);
  }

  get displayData() {
    return new PlayerDisplayData(this.instance.add(displayDataOffset).readPointer());
  }

  get kills() {
    return this.instance.add(killsOffset).readInt();
  }
  get deaths() {
    return this.instance.add(deathsOffset).readInt();
  }
  get damage() {
    return this.instance.add(damageOffset).readInt();
  }
  get heal() {
    return this.instance.add(healOffset).readInt();
  }

  static patch() {
    Interceptor.replace(
      playerEntryCtor,
      new NativeCallback(
        (instance, data) => {
          playerEntryCtor(instance, data);
          if (!SkinSelector.isInUse()) return;

          const accountId = GameMain.getAccountId();
          const playerId = instance.add(playerIdOffset).readPointer();
          if (playerId.isNull() || !new LogicLong(playerId).equals(accountId)) return;

          for (let i = 0; i < instance.add(characterCountOffset).readU32(); i++) {
            const characterName = LogicData.getName(
              instance
                .add(characterArrayOffset)
                .readPointer()
                .add(i * Process.pointerSize)
                .readPointer(),
            );
            const skinSlot = instance
              .add(skinArrayOffset)
              .readPointer()
              .add(i * Process.pointerSize);
            if (Config.config.SkinOverrides.hasOwnProperty(characterName)) {
              const skinName = Config.config.SkinOverrides[characterName];
              skinSlot.writePointer(LogicDataTables.getSkinByName(skinName).instance);
            }
          }
        },
        "void",
        ["pointer", "pointer"],
      ),
    );
  }
}

exports.PlayerEntry = PlayerEntry;
