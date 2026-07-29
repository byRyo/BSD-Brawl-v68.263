// @ts-nocheck
const { SkinSelector } = require("../../../../suitcase/feature/SkinSelector");
const { Config } = require("../../../../suitcase/config/Config");
const { LogicDataTables } = require("../../logic/data/LogicDataTables");
const { Libg } = require("../../../../lib/Libg");
const { LogicSkinData } = require("../../logic/data/LogicSkinData");

const skinCheckHook = Libg.offset(10034560, 9440832);
const ignoredReturnAddress = Libg.offset(8903188, 8471372);

class SkinHelper {
  static patch() {
    Interceptor.attach(skinCheckHook, {
      onEnter(args) {
        this.skin = new LogicSkinData(args[0]);
      },
      onLeave(retval) {
        if (!SkinSelector.isInUse() || this.returnAddress.equals(ignoredReturnAddress)) return;
        const characterName = this.skin.getCharacter().getName();
        if (Config.config.SkinOverrides.hasOwnProperty(characterName)) {
          const skinName = Config.config.SkinOverrides[characterName];
          if (this.skin.equals(LogicDataTables.getSkinByName(skinName))) {
            retval.replace(ptr(1));
          }
        }
      },
    });
  }
}

exports.SkinHelper = SkinHelper;
