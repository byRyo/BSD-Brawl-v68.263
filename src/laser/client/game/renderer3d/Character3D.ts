// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { Config } = require("../../../../suitcase/config/Config");
const { SkinSelector } = require("../../../../suitcase/feature/SkinSelector");
const { LogicDataTables } = require("../../logic/data/LogicDataTables");
const { LogicData } = require("../../logic/data/LogicData");
const { Player } = require("../friends/Player");
const { Character } = require("../gameobject/Character");
const { LogicGameObjectClient } = require("../../logic/battle/LogicGameObjectClient");
const { Breadcrumbs } = require("../../../../suitcase/debug/Breadcrumbs");

const character3DCreateHook = Libg.offset(8612408, 8233204);
const setDataNative = new NativeFunction(Libg.offset(5451856, 5531020), "void", [
  "pointer",
  "pointer",
]);

class Character3D {
  static flushSkinLogs() {
    this.objectMap = {};
  }

  static patch() {
    if (!SkinSelector.isAvailable()) return;
    Interceptor.replace(
      setDataNative,
      new NativeCallback(
        (instance, logicPtr) => {
          if (SkinSelector.isInUse()) {
            try {
              const logic = new LogicGameObjectClient(logicPtr);
              const replacement =
                Character3D.objectMap[logic.playerIndex]?.[LogicData.getGlobalID(logic.dataPtr)];
              if (replacement > 0) {
                const data = LogicDataTables.getDataById(replacement);
                if (data) logic.dataPtr = data.instance;
              }
            } catch (_) {}
          }
          setDataNative(instance, logicPtr);
        },
        "void",
        ["pointer", "pointer"],
      ),
    );
    Interceptor.attach(character3DCreateHook, {
      onEnter(args) {
        const character = new Character(args[1]);
        const logic = character.logic;
        const data = logic.data;
        if (Config.config.DisableSkins) {
          const defaultSkin = data.getDefaultSkin();
          if (defaultSkin && !defaultSkin.instance.isNull()) character.skin = defaultSkin;
          return;
        }
        if (!SkinSelector.isInUse() || logic.index !== Player.ownIndex) return;
        const characterName = data.getName();
        if (!characterName || !Config.config.SkinOverrides.hasOwnProperty(characterName)) return;
        const oldSkin = character.skin;
        if (!oldSkin) return;
        const skinName = Config.config.SkinOverrides[characterName];
        const skin = LogicDataTables.getSkinByName(skinName);
        if (skin) {
          Breadcrumbs.push(
            "Character3D: ".concat(characterName, " ", oldSkin.getName(), " -> ", skinName),
          );
          character.skin = skin;
        }
      },
    });
  }
}

Character3D.objectMap = {};
exports.Character3D = Character3D;
