// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const { LogicBattleModeClient } = require("../../../logic/mode/LogicBattleModeClient");

const getInstanceNative = new NativeFunction(Libg.offset(10197860, 9576344), "pointer", []);
const isClientNative = new NativeFunction(Libg.offset(10202520, 9578880), "bool", ["pointer"]);
const isInOfflineGameNative = new NativeFunction(Libg.offset(10202440, 9578800), "bool", [
  "pointer",
]);
const logicBattleModeClientOffset = LogicMemory.offset(40);
const clientInputManagerOffset = LogicMemory.offset(88);

class BattleMode {
  static getInstance() {
    return getInstanceNative();
  }
  static getLogicBattleModeClient() {
    return this.getInstance().add(logicBattleModeClientOffset).readPointer();
  }
  static get client() {
    if (!this.getInstance().isNull())
      return new LogicBattleModeClient(this.getLogicBattleModeClient());
  }
  static get isInOfflineGame() {
    return isClientNative(this.getInstance());
  }
  static get isPlayingTutorial() {
    return isInOfflineGameNative(this.getInstance());
  }
  static get clientInputManager() {
    return this.getInstance().add(clientInputManagerOffset).readPointer();
  }
}

exports.BattleMode = BattleMode;
