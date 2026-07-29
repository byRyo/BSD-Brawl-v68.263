// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { BattleScreen } = require("./battle/BattleScreen");

const getLogicBattle = new NativeFunction(Libg.offset(8884168, 8466764), "pointer", ["pointer"]);

class GameScreen {
  static getLogicBattle() {
    return getLogicBattle(BattleScreen.getInstance());
  }
}

exports.GameScreen = GameScreen;
