// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");

const getRespawnSecondsNative = new NativeFunction(Libg.offset(13007440, 11740344), "int", [
  "pointer",
  "int",
  "pointer",
]);
const isShowdownLikeModeNative = new NativeFunction(Libg.offset(13006072, 11739048), "bool", [
  "pointer",
]);
const isDuoShowdownNative = new NativeFunction(Libg.offset(13004512, 11737508), "bool", ["int"]);

class LogicGameModeUtil {
  static getRespawnSeconds(gameMode, playerCount) {
    return getRespawnSecondsNative(gameMode, playerCount, NULL);
  }
  static isShowdownLikeMode(gameMode) {
    return isShowdownLikeModeNative(gameMode) === 1;
  }
  static isDuoShowdown(variation) {
    return isDuoShowdownNative(variation) === 1;
  }
}

exports.LogicGameModeUtil = LogicGameModeUtil;
