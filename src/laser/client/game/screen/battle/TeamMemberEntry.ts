// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const { SkinSelector } = require("../../../../../suitcase/feature/SkinSelector");
const { PlayerInfo } = require("../../friends/PlayerInfo");
const { LogicData } = require("../../../logic/data/LogicData");
const { Config } = require("../../../../../suitcase/config/Config");
const { LogicDataTables } = require("../../../logic/data/LogicDataTables");

const teamMemberEntryCtor = new NativeFunction(Libg.offset(12401248, 11315356), "void", [
  "pointer",
  "pointer",
]);
const playerIdOffset = LogicMemory.offset(24, 24);
const playerIdLowOffset = LogicMemory.offset(16, 16);
const characterOffset = LogicMemory.offset(8, 8);
const skinOffset = LogicMemory.offset(4, 4);

class TeamMemberEntry {
  static patch() {
    Interceptor.replace(
      teamMemberEntryCtor,
      new NativeCallback(
        (instance, data) => {
          teamMemberEntryCtor(instance, data);
          if (!SkinSelector.isInUse()) return;

          const accountId = PlayerInfo.accountId;
          const playerId = instance.add(playerIdOffset).readPointer();
          if (
            !playerId.isNull() &&
            accountId.instance.readU32() === playerId.readU32() &&
            accountId.getLow() === playerId.add(playerIdLowOffset).readU32()
          ) {
            const characterName = LogicData.getName(instance.add(characterOffset).readPointer());
            const skinSlot = instance.add(skinOffset);
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

exports.TeamMemberEntry = TeamMemberEntry;
