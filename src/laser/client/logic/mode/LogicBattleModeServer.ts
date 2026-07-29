// @ts-nocheck
const { BattleMode } = require("../../game/state/battlemode/BattleMode");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");

const serverOffset = LogicMemory.offset(48);
const forceEndOffset = LogicMemory.offset(289);
const botDifficultyOffset = LogicMemory.offset(284);

class LogicBattleModeServer {
  static getInstance() {
    const mode = BattleMode.getInstance();
    return mode.isNull() ? NULL : mode.add(serverOffset).readPointer();
  }
  static debugForceEndGame(_team, _reason) {
    const instance = this.getInstance();
    if (!instance.isNull()) instance.add(forceEndOffset).writeU8(1);
  }
  static setBotDifficulty(value) {
    const instance = this.getInstance();
    if (!instance.isNull()) instance.add(botDifficultyOffset).writeInt(value);
  }
}
exports.LogicBattleModeServer = LogicBattleModeServer;
