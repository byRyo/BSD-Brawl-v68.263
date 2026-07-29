// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { SkinSelector } = require("../../../../suitcase/feature/SkinSelector");
const { LogicData } = require("../data/LogicData");
const { Player } = require("../../game/friends/Player");
const { Config } = require("../../../../suitcase/config/Config");
const { Libc } = require("../../../../lib/Libc");
const { LogicProjectileData } = require("./LogicProjectileData");
const { LogicDataTables } = require("../data/LogicDataTables");
const { LogInfo } = require("../../../../..");

const createAddress = Libg.offset(11982788, 10990100);
const dataOffset = LogicMemory.offset(16);
const playerIndexOffset = LogicMemory.offset(60);

class LogicProjectileClient {
  static patch() {
    Interceptor.attach(createAddress, {
      onEnter(args) {
        this.logicProjectileClient = args[0];
      },
      onLeave() {
        if (!SkinSelector.isInUse()) return;
        const oldData = this.logicProjectileClient.add(dataOffset).readPointer();
        const oldName = LogicData.getName(oldData);
        let character = "",
          skin = "",
          mappingIndex = -1;
        if (
          this.logicProjectileClient.add(playerIndexOffset).readU8() === Player.ownIndex &&
          Player.playingWith.some((entry) => {
            character = entry.character;
            skin = entry.skin;
            const mapping = SkinSelector.skinDataMap[character]?.[skin];
            mappingIndex = mapping ? mapping.p.indexOf(oldName) : null;
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
          const data = Libc.malloc(LogicProjectileData.allocationSize);
          if (
            map[override].p[mappingIndex] === undefined &&
            (mappingIndex === 2 || mappingIndex === 3)
          )
            mappingIndex = 1;
          const replacement = map[override].p[mappingIndex];
          const replacementData = LogicDataTables.getTableItemByName(
            LogicDataTables.table.Projectiles,
            replacement,
          ).instance;
          Memory.copy(data, replacementData, LogicProjectileData.allocationSize);
          LogicMemory.cloneU32Field(data, oldData, 32);
          LogicMemory.cloneU8Field(data, oldData, LogicProjectileData.fields.SpecialVisualState);
          LogicMemory.clonePointerField(
            data,
            oldData,
            LogicProjectileData.fields.SpecialTrailEffect,
          );
          LogicMemory.cloneU32Field(data, oldData, LogicProjectileData.fields.UniqueProperty);
          LogicMemory.cloneU8Field(data, oldData, LogicProjectileData.fields.IgnoreLevelBorder);
          LogicMemory.cloneU32Field(data, oldData, LogicProjectileData.fields.TravelType);
          LogicMemory.cloneU32Field(data, oldData, LogicProjectileData.fields.GetRendering);
          LogicMemory.cloneU32Field(data, oldData, LogicProjectileData.fields.PreExplosionTimeMs);
          LogicMemory.cloneU32Field(data, oldData, LogicProjectileData.fields.TriggerWithDelayMs);
          LogicMemory.cloneU8Field(data, oldData, LogicProjectileData.fields.IsBouncing);
          this.logicProjectileClient.add(dataOffset).writePointer(data);
        }
      },
    });
  }
}
exports.LogicProjectileClient = LogicProjectileClient;
