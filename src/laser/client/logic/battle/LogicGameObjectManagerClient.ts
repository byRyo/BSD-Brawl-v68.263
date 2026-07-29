// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { Config } = require("../../../../suitcase/config/Config");
const { LogicDataTables } = require("../data/LogicDataTables");
const { LogicArrayList } = require("../data/LogicArrayList");
const { LogicPlayer } = require("./LogicPlayer");
const { LogicSkinData } = require("../data/LogicSkinData");
const { PlayerInfo } = require("../../game/friends/PlayerInfo");

const addGameObjectAddress = Libg.offset(11916056, 10938060);

class LogicGameObjectManagerClient {
  static getCharacterNameBySkin(pointer) {
    if (pointer.isNull()) return;
    const skin = pointer.readPointer();
    return skin.isNull() ? undefined : new LogicSkinData(skin).getCharacter()?.getName();
  }
  static patch() {
    Interceptor.attach(addGameObjectAddress, {
      onEnter(args) {
        this.objectsArray = new LogicArrayList(args[2]);
      },
      onLeave() {
        const count = this.objectsArray.getItemsCount();
        for (let i = 0; i < count; i++) {
          const pointer = this.objectsArray.getElement(i);
          if (pointer.isNull()) continue;
          const player = new LogicPlayer(pointer);
          const id = player.playerId;
          if (!id || !id.equals(PlayerInfo.accountId)) continue;
          const hero = player.getLogicHeroSetup();
          const characterName = hero.getLogicCharacterData().getName();
          if (Config.config.SkinOverrides.hasOwnProperty(characterName)) {
            hero.setSkin(LogicDataTables.getSkinByName(Config.config.SkinOverrides[characterName]));
          }
        }
      },
    });
  }
}
exports.LogicGameObjectManagerClient = LogicGameObjectManagerClient;
