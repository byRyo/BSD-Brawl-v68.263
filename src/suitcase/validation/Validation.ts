// @ts-nocheck
const { ModProperties } = require("../config/ModProperties");
const { Libg } = require("../../lib/Libg");
const { PlayerInfo } = require("../../laser/client/game/friends/PlayerInfo");
const { Config } = require("../config/Config");

class Validation {
  static checkCollabScript() {
    return this.validationAddr.readU8() == 69;
  }

  static isDevAvailable() {
    return (
      ModProperties.isDev() ||
      (Config.config.DevModeEnabled && Validation.developersList.includes(PlayerInfo.tag))
    );
  }

  static isWhitelisted() {
    return ModProperties.environment === "dev" || this.betaList.includes(PlayerInfo.tag);
  }

  static crashGame() {}
}

Validation.developersList = [
  "9P0R2YC2Q",
  "2RGGJPLQU",
  "8PLVR29JP",
  "8GCQYL2VL",
  "QUJPVU0L",
  "PQL90VLR9",
];
Validation.testersList = ["9P0R2YC2Q"];
Validation.betaList = ["9P0R2YC2Q"];
Validation.validationAddr = Libg.offset(0, 0);

exports.Validation = Validation;
