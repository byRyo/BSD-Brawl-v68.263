// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { SkinSelector } = require("../../../../suitcase/feature/SkinSelector");
const { LogicData } = require("../data/LogicData");
const { Player } = require("../../game/friends/Player");
const { Config } = require("../../../../suitcase/config/Config");
const { Libc } = require("../../../../lib/Libc");
const { LogicItemData } = require("./LogicItemData");
const { LogicDataTables } = require("../data/LogicDataTables");
const { LogInfo } = require("../../../../..");

const createAddress = Libg.offset(11966900, 10976120);
const dataOffset = LogicMemory.offset(16);
const playerIndexOffset = LogicMemory.offset(60);

class LogicItemClient {
  static patch() {
    Interceptor.attach(createAddress, {
      onEnter(args) {
        this.logicItemClient = args[0];
      },
      onLeave() {
        if (!SkinSelector.isInUse()) return;
        const oldData = this.logicItemClient.add(dataOffset).readPointer();
        const oldName = LogicData.getName(oldData);
        let character = "",
          skin = "",
          mappingIndex = -1;
        if (
          this.logicItemClient.add(playerIndexOffset).readU8() === Player.ownIndex &&
          Player.playingWith.some((entry) => {
            character = entry.character;
            skin = entry.skin;
            const mapping = SkinSelector.skinDataMap[character]?.[skin];
            mappingIndex = mapping ? mapping.i.indexOf(oldName) : null;
            if (!mapping)
              LogInfo(
                "Character",
                character,
                "doesn't have mappings for",
                skin,
                "skin. Please, do something with this.",
              );
            return mappingIndex !== null && mappingIndex !== -1;
          })
        ) {
          let override = Config.config.SkinOverrides[character];
          const map = SkinSelector.skinDataMap[character];
          if (!map.hasOwnProperty(override)) override = Object.keys(map)[0];
          const data = Libc.malloc(LogicItemData.allocationSize);
          if (map[override].i[mappingIndex] === undefined) return;
          const replacement = map[override].i[mappingIndex];
          Memory.copy(
            data,
            LogicDataTables.getTableItemByName(LogicDataTables.table.Items, replacement).instance,
            LogicItemData.allocationSize,
          );
          LogicMemory.cloneU32Field(data, oldData, 32);
          this.logicItemClient.add(dataOffset).writePointer(data);
        }
      },
    });
  }
}
exports.LogicItemClient = LogicItemClient;
