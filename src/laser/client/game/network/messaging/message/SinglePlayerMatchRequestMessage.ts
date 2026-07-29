// @ts-nocheck
const { Libg } = require("../../../../../../lib/Libg");
const { Config } = require("../../../../../../suitcase/config/Config");
const { SkinSelector } = require("../../../../../../suitcase/feature/SkinSelector");
const { LogicCharacterData } = require("../../../../logic/data/LogicCharacterData");
const { LogicDailyData } = require("../../../../logic/data/LogicDailyData");
const { LogicSkinData } = require("../../../../logic/data/LogicSkinData");
const { LogicHomeMode } = require("../../../../logic/mode/LogicHomeMode");
const { HomeMode } = require("../../../state/homemode/HomeMode");
const address = Libg.offset(12606984, 11466800);
class SinglePlayerMatchRequestMessage {
  static patch() {
    Interceptor.attach(address, {
      onEnter(args) {
        if (!SkinSelector.isInUse()) return;
        const character = new LogicCharacterData(args[2]),
          skin = new LogicSkinData(args[3]),
          name = character.getName();
        if (
          Config.config.SkinOverrides.hasOwnProperty(name) &&
          skin.getName() === Config.config.SkinOverrides[name]
        )
          args[3] = LogicDailyData.getSkin(
            HomeMode.getPlayerData(),
            LogicHomeMode.getPlayerAvatar(),
            character,
          ).instance;
      },
    });
  }
}
exports.SinglePlayerMatchRequestMessage = SinglePlayerMatchRequestMessage;
