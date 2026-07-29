// @ts-nocheck
const { BSDMessage } = require("../../BSDMessage");
const { BSDApi } = require("../../BSDApi");
const { MessageSignatureManager } = require("../../../crypto/MessageSignatureManager");
const { PlayerInfo } = require("../../../../laser/client/game/friends/PlayerInfo");
const { Config } = require("../../../config/Config");
const { ModProperties } = require("../../../config/ModProperties");

class LogExceptionMessage extends BSDMessage {
  constructor(exceptionType, exception, playerTag) {
    const route = BSDApi.v1ApiRoute + BSDApi.LOG_EXCEPTION;
    const data = {
      exceptionType,
      exception,
      version: ModProperties.version,
      branch: ModProperties.environment + (ModProperties.isIntegration ? " 🦊" : ""),
      playerTag: "#".concat(playerTag ?? PlayerInfo.tag),
      config: Config.config,
      magic_number: MessageSignatureManager.getMagicalNumberWithoutMultiplier(),
    };
    super(data, route);
    data.magic_number = Number(
      BigInt(data.magic_number) * BigInt(MessageSignatureManager.requestMagicalNumberMultiplier),
    );
  }
}

exports.LogExceptionMessage = LogExceptionMessage;
