// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicClientAvatar } = require("../../logic/avatar/LogicClientAvatar");

const getInstanceNative = new NativeFunction(Libg.offset(10235316, 9612992), "pointer", []);
const GameStateManager_changeToStateOffset = Libg.offset(10238404, 9614952);
const changeToStateNative = new NativeFunction(GameStateManager_changeToStateOffset, "void", [
  "pointer",
]);
const clearGameDataNative = new NativeFunction(Libg.offset(10235756, 9613528), "void", ["pointer"]);
const playerAvatarOffset = LogicMemory.offset(72);
const currentStateOffset = LogicMemory.offset(80);
const currentStateIdOffset = LogicMemory.offset(84);
const stateDataOffset = LogicMemory.offset(96);

const GameStateId = {
  2: "Init",
  Init: 2,
  3: "LoadingScreen",
  LoadingScreen: 3,
  4: "Home",
  Home: 4,
  5: "Battle",
  Battle: 5,
  6: "MapEditor",
  MapEditor: 6,
  8: "TencentLogin",
  TencentLogin: 8,
  9: "Login",
  Login: 9,
};

class GameStateManager {
  static getInstance() {
    return getInstanceNative();
  }
  static changeState(stateId) {
    const instance = this.getInstance();
    if (!instance.isNull()) instance.add(currentStateIdOffset).writeInt(stateId);
  }
  static changeToState() {
    changeToStateNative(this.getInstance());
  }
  static clearGameData() {
    const instance = this.getInstance();
    if (!instance.isNull()) clearGameDataNative(instance);
  }
  static getPlayerAvatar() {
    return new LogicClientAvatar(this.getInstance().add(playerAvatarOffset).readPointer());
  }
  static getCurrentState() {
    const instance = this.getInstance();
    if (instance.isNull()) return NULL;
    return instance.add(currentStateOffset).readPointer();
  }
  static getCurrentStateId() {
    const instance = this.getInstance();
    if (instance.isNull()) return null;
    return instance.add(currentStateIdOffset).readS32();
  }
  static isInState(stateId) {
    return this.getCurrentStateId() === stateId;
  }
}

exports.GameStateManager_changeToStateOffset = GameStateManager_changeToStateOffset;
exports.GameStateId = GameStateId;
exports.GameStateManager = GameStateManager;
