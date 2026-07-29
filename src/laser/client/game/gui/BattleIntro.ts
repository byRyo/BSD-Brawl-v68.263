// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { Config } = require("../../../../suitcase/config/Config");
const { LogicCharacterData } = require("../../logic/data/LogicCharacterData");

const BattleIntro_addPlayer = Libg.offset(6423544, 6339836);
const battleIntroPlayersOffset = LogicMemory.offset(48);
const battleIntroPlayerCountOffset = LogicMemory.offset(64);
const battleIntroPlayerSkinOffset = LogicMemory.offset(472);
const battleIntroEntrySkinOffset = LogicMemory.offset(32);

class BattleIntro {
  static patch() {
    Interceptor.attach(BattleIntro_addPlayer, {
      onEnter(args) {
        if (!Config.config.DisableSkins) return;
        const battleIntro = args[1];
        if (battleIntro.isNull()) return;
        const players = battleIntro.add(battleIntroPlayersOffset).readPointer();
        if (players.isNull()) return;
        const index = battleIntro.add(battleIntroPlayerCountOffset).readS32();
        if (index < 0) return;
        const entry = players.add(8 * index).readPointer();
        if (entry.isNull()) return;
        const character = entry.readPointer();
        if (character.isNull()) return;
        const skin = new LogicCharacterData(character).getDefaultSkin();
        if (!skin.instance.isNull()) {
          battleIntro.add(battleIntroPlayerSkinOffset).writePointer(skin.instance);
          entry.add(battleIntroEntrySkinOffset).writePointer(skin.instance);
        }
      },
    });
  }
}

module.exports = { BattleIntro };
