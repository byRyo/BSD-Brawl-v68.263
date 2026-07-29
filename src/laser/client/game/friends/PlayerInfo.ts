// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { DropGUIContainer } = require("../../../titan/client/common/flash/DropGUIContainer");
const { GUI } = require("../gui/GUI");
const { Localisation } = require("../../../../suitcase/localisation/Localisation");
const { Application } = require("../../../titan/client/application/Application");
const { Libc } = require("../../../../lib/Libc");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { HashTagCodeGenerator } = require("../utils/HashTagCodeGenerator");

const PlayerInfo_ctor = new NativeFunction(Libg.offset(6310452, 6239140), "void", [
  "pointer",
  "pointer",
  "int",
  "pointer",
  "int",
  "pointer",
]);
const PlayerInfo_dtor = new NativeFunction(Libg.offset(6327956, 6254528), "void", ["pointer"]);
const playerInfoNameOffset = LogicMemory.offset(144);
const playerInfoTagOffset = LogicMemory.offset(328);
const playerInfoAccountIdOffset = LogicMemory.offset(128);

class PlayerInfo extends DropGUIContainer {
  constructor(playerData) {
    super();
    this.instance = Libc.malloc(PlayerInfo.allocationSize);
    PlayerInfo_ctor(this.instance, playerData.instance, 4, NULL, 0, NULL);
  }

  static patch() {
    Interceptor.replace(
      PlayerInfo_dtor,
      new NativeCallback(
        (instance) => {
          PlayerInfo_dtor(instance);
          new DropGUIContainer(instance)
            .addGameButton("tag_txt", true)
            .setCustomButtonListener(() => {
              Application.copyString(HashTagCodeGenerator.lastConvertedTag);
              GUI.showFloaterTextAtDefaultPosition(
                "".concat(
                  Localisation.getString("PlayerTagCopied"),
                  "\n(",
                  HashTagCodeGenerator.lastConvertedTag,
                  ")",
                ),
              );
            });
        },
        "void",
        ["pointer"],
      ),
    );
  }
}

PlayerInfo.allocationSize = 632;
PlayerInfo.isInGameroom = false;
PlayerInfo.ownThumbdownEmoteIndex = -1;

exports.PlayerInfo = PlayerInfo;
