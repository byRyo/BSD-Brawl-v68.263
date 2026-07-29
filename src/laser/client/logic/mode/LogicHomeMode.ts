// @ts-nocheck
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { HomeMode } = require("../../game/state/homemode/HomeMode");
const { GameStateManager } = require("../../game/state/GameStateManager");

const homeModeOffset = LogicMemory.offset(72);
const homeOffset = LogicMemory.offset(24);

class LogicHomeMode {
  static getInstance() {
    const mode = HomeMode.getInstance();
    return mode === null ? NULL : mode.add(homeModeOffset).readPointer();
  }
  static getHome() {
    return this.getInstance().add(homeOffset).readPointer();
  }
  static getPlayerAvatar() {
    return GameStateManager.getPlayerAvatar();
  }
}
exports.LogicHomeMode = LogicHomeMode;
