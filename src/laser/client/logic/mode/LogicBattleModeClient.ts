// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { BattleMode } = require("../../game/state/battlemode/BattleMode");
const { GameScreen } = require("../../game/screen/GameScreen");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicArrayList } = require("../data/LogicArrayList");
const { LogicPlayer } = require("../battle/LogicPlayer");
const { LogicCharacterClient } = require("../battle/LogicCharacterClient");

const getOwnCharacterNative = new NativeFunction(Libg.offset(12722116, 11558480), "pointer", [
  "pointer",
]);
const isGameOverNative = new NativeFunction(Libg.offset(12720352, 11557256), "bool", ["pointer"]);
const playerCountOffset = LogicMemory.offset(248);
const modeIndexOffset = LogicMemory.offset(128);
const ownPlayerIndexOffset = LogicMemory.offset(232);
const ownPlayerTeamOffset = LogicMemory.offset(228);
const gameModeUtilOffset = LogicMemory.offset(224);
const gameObjectsOffset = LogicMemory.offset(292);
const eventModifiersOffset = LogicMemory.offset(296);
const gameModeUtilTeamSizeOffset = LogicMemory.offset(40);
const tileMapOffset = LogicMemory.offset(320);
const teammateCountOffset = LogicMemory.offset(904);
const spectateTargetIndexOffset = LogicMemory.offset(236);

class LogicBattleModeClient {
  constructor(instance) {
    this.instance = instance;
  }
  getPlayer(index) {
    const pointer = new LogicArrayList(this.instance).getElement(index);
    return pointer.isNull() ? null : new LogicPlayer(pointer);
  }
  getPlayerCount() {
    return this.instance.add(playerCountOffset).readInt();
  }
  get modeIndex() {
    return this.instance.add(modeIndexOffset).readU32();
  }
  get ownPlayerIndex() {
    return this.instance.add(ownPlayerIndexOffset).readU32();
  }
  get ownPlayerTeam() {
    return this.instance.add(ownPlayerTeamOffset).readU32();
  }
  getGameModeUtil() {
    return this.instance.add(gameModeUtilOffset).readPointer();
  }
  getGameObjects() {
    return new LogicArrayList(this.instance.add(gameObjectsOffset).readPointer());
  }
  isGameOverOrResetting() {
    return Boolean(isGameOverNative(this.instance));
  }
  hasEventModifier(modifier) {
    return LogicBattleModeClient.hasEventModifier(this.instance, modifier);
  }
  static hasEventModifier(instance, modifier) {
    const pointer = instance.add(eventModifiersOffset).readPointer();
    if (pointer.isNull()) return false;
    const list = new LogicArrayList(pointer);
    const count = list.getItemsCount();
    const array = list.getArray();
    for (let i = 0; i < count; i++) if (array.add(4 * i).readInt() === modifier) return true;
    return false;
  }
  static getInstance() {
    return BattleMode.getLogicBattleModeClient();
  }
  static getOwnCharacter() {
    return new LogicCharacterClient(getOwnCharacterNative(this.getInstance()));
  }
  static getTileMap() {
    const battle = GameScreen.getLogicBattle();
    return battle.isNull() ? NULL : battle.add(tileMapOffset).readPointer();
  }
  static getOwnPlayerTeam() {
    const instance = this.getInstance();
    return instance.isNull() ? 0 : instance.add(ownPlayerTeamOffset).readU32();
  }
  static getTeammateCount() {
    const instance = this.getInstance();
    return instance.isNull() ? -1 : instance.add(teammateCountOffset).readInt();
  }
  static getSpectateTargetIndex() {
    const instance = this.getInstance();
    return instance.isNull() ? -2 : instance.add(spectateTargetIndexOffset).readInt();
  }
  static setTeammateCount(value) {
    const instance = this.getInstance();
    if (!instance.isNull()) instance.add(teammateCountOffset).writeInt(value);
  }
  static getTeamSize() {
    const instance = this.getInstance();
    if (instance.isNull()) return -1;
    const util = instance.add(gameModeUtilOffset).readPointer();
    return util.isNull() ? -1 : util.add(gameModeUtilTeamSizeOffset).readInt();
  }
  static getModeIndex() {
    const instance = this.getInstance();
    return instance.isNull() ? -1 : instance.add(modeIndexOffset).readU32();
  }
  static hasTeammates() {
    return this.getTeamSize() > 1;
  }
}
LogicBattleModeClient.timeSinceLastprocessedTickOffset = Libg.offset(5883752, 5893100);
exports.LogicBattleModeClient = LogicBattleModeClient;
