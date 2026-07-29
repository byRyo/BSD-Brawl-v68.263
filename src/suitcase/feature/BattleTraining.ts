// @ts-nocheck
const { LogicDataTables } = require("../../laser/client/logic/data/LogicDataTables");
const { HomeScreen } = require("../../laser/client/game/screen/home/HomeScreen");
const { BattleMode } = require("../../laser/client/game/state/battlemode/BattleMode");
const { HomePage } = require("../../laser/client/game/screen/home/homepage/HomePage");
const { SessionStatics } = require("../../laser/client/game/session/SessionStatics");
class BattleTraining {
  static start() {
    if (Process.platform !== "linux" || !HomeScreen.isEntered || !BattleMode.getInstance().isNull())
      return;
    const location = LogicDataTables.getTrainingLocationData();
    if (!location) return;
    const character = LogicDataTables.getCharacterByName("ShotgunGirl");
    if (character && !character.instance.isNull()) {
      HomePage.startGame(location.instance, 4, character.instance);
      SessionStatics.setMatchContext(3);
    }
  }
}
exports.BattleTraining = BattleTraining;
