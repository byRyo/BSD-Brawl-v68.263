// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { SkinSelector } = require("../../../../suitcase/feature/SkinSelector");
const { LogicData } = require("../data/LogicData");
const { Player } = require("../../game/friends/Player");
const { Config } = require("../../../../suitcase/config/Config");
const { Libc } = require("../../../../lib/Libc");
const { LogicAreaEffectData } = require("./LogicAreaEffectData");
const { LogicDataTables } = require("../data/LogicDataTables");
const { LogInfo } = require("../../../../..");

const createAddress = Libg.offset(11694872, 10760288);
const dataOffset = LogicMemory.offset(16, 16);
const playerIndexOffset = LogicMemory.offset(60);

class LogicAreaEffectClient {
  static patch() {
    Interceptor.attach(createAddress, {
      onEnter(args) {
        this.logicAreaEffectClient = args[0];
      },
      onLeave() {
        if (!SkinSelector.isInUse()) return;
        const oldData = this.logicAreaEffectClient.add(dataOffset).readPointer();
        const oldName = LogicData.getName(oldData);
        let character = "",
          skin = "",
          mappingIndex = -1;
        if (
          this.logicAreaEffectClient.add(playerIndexOffset).readU8() === Player.ownIndex &&
          Player.playingWith.some((entry) => {
            character = entry.character;
            skin = entry.skin;
            const mapping = SkinSelector.skinDataMap[character]?.[skin];
            mappingIndex = mapping ? mapping.a.indexOf(oldName) : null;
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
          const data = Libc.malloc(LogicAreaEffectData.allocationSize);
          if (map[override].a[mappingIndex] === undefined) return;
          const replacement = map[override].a[mappingIndex];
          Memory.copy(
            data,
            LogicDataTables.getTableItemByName(LogicDataTables.table.AreaEffects, replacement)
              .instance,
            LogicAreaEffectData.allocationSize,
          );
          LogicMemory.cloneU32Field(data, oldData, 32);
          LogicMemory.cloneU32Field(data, oldData, LogicAreaEffectData.fields.Type);
          LogicMemory.cloneU32Field(data, oldData, LogicAreaEffectData.fields.PlaybackType);
          LogicMemory.cloneU32Field(data, oldData, LogicAreaEffectData.fields.RotationType);
          this.logicAreaEffectClient.add(dataOffset).writePointer(data);
        }
      },
    });
  }
}
exports.LogicAreaEffectClient = LogicAreaEffectClient;
