// @ts-nocheck
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicHomeMode } = require("../mode/LogicHomeMode");
const { Libg } = require("../../../../lib/Libg");

const patchTarget = new NativeFunction(Libg.offset(12281184, 11221268), "bool", ["int"]);
const playerDataOffset = LogicMemory.offset(24, 24);

class LogicClientHome {
  static patch() {
    Interceptor.replace(patchTarget, new NativeCallback(() => 0, "bool", ["pointer"]));
  }
  static getPlayerData() {
    const home = LogicHomeMode.getHome();
    return home.isNull() ? null : home.add(playerDataOffset).readPointer();
  }
}
exports.LogicClientHome = LogicClientHome;
