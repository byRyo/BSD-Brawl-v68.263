// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Config } = require("../../../../../suitcase/config/Config");

const BattleEndReplayScreen_show = new NativeFunction(Libg.offset(6650892, 6532152), "void", [
  "pointer",
  "pointer",
]);

class BattleEndReplayScreen {
  static patch() {
    Interceptor.replace(
      BattleEndReplayScreen_show,
      new NativeCallback(
        (a, b) => {
          if (!Config.config.DoNotShowBattleHighlight) BattleEndReplayScreen_show(a, b);
        },
        "void",
        ["pointer", "pointer"],
      ),
    );
  }
}

module.exports = { BattleEndReplayScreen };
