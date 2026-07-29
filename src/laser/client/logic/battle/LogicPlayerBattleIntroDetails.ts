// @ts-nocheck
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { StringObject } = require("../../../titan/client/native/StringObject");
const { PlayerDisplayData } = require("../../game/friends/PlayerDisplayData");
const { LogicPlayerTitleData } = require("../data/LogicPlayerTitleData");

const playerTitleOffset = LogicMemory.offset(40);

class LogicPlayerBattleIntroDetails {
  constructor(instance) {
    this.instance = instance;
  }
  get displayData() {
    return new PlayerDisplayData(this.instance.readPointer());
  }
  get title() {
    const value = this.instance.add(playerTitleOffset).readPointer();
    return value.isNull() ? null : new LogicPlayerTitleData(value);
  }
  set title(value) {
    if (!value) this.instance.add(playerTitleOffset).writePointer(NULL);
    else
      this.instance
        .add(playerTitleOffset)
        .writePointer(value instanceof LogicPlayerTitleData ? value.instance : value);
  }
  getPlayerName() {
    return StringObject.read(this.instance.readPointer());
  }
  setPlayerName(value) {
    StringObject.create(value, this.instance.readPointer());
  }
}
exports.playerTitleOffset = playerTitleOffset;
exports.LogicPlayerBattleIntroDetails = LogicPlayerBattleIntroDetails;
