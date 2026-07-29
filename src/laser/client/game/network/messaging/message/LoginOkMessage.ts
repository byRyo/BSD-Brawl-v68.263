// @ts-nocheck
const { Utils } = require("../../../../../../tools/skinchanger-config/titan/utils/Utils");
const { Libg } = require("../../../../../../lib/Libg");
const { ModProperties } = require("../../../../../../suitcase/config/ModProperties");
const { CustomTextEncoder } = require("../../../../../../suitcase/crypto/CustomTextEncoder");
const { TSChaCha20 } = require("../../../../../../suitcase/crypto/TSChaCha20");
const { EDebugger } = require("../../../../../../suitcase/debug/EDebugger");
const { LogicMemory } = require("../../../../../../suitcase/logic/LogicMemory");
const { BSDHttpClient } = require("../../../../../../suitcase/network/BSDHttpClient");
const {
  BSDMessageManager,
} = require("../../../../../../suitcase/network/messaging/BSDMessageManager");
const {
  GetBSDOnlineMessage,
} = require("../../../../../../suitcase/network/messaging/message/GetBSDOnlineMessage");
const {
  GetBSDOwnHomeData,
} = require("../../../../../../suitcase/network/messaging/message/GetBSDOwnHomeData");
const { BSDPlusManager } = require("../../../../../../suitcase/validation/BSDPlusManager");
const { Validation } = require("../../../../../../suitcase/validation/Validation");
const { PiranhaMessage } = require("../../../../../titan/client/common/messaging/PiranhaMessage");
const { StringObject } = require("../../../../../titan/client/native/StringObject");
const { LogicLong } = require("../../../../logic/LogicLong");
const { PlayerInfo } = require("../../../friends/PlayerInfo");
const { HashTagCodeGenerator } = require("../../../utils/HashTagCodeGenerator");
const { Messaging } = require("../../Messaging");
const decodeAddress = Libg.offset(12355636, 11278688),
  decode = new NativeFunction(decodeAddress, "void", ["pointer", "pointer"]);
const ACCOUNT = LogicMemory.offset(144),
  SESSIONS = LogicMemory.offset(224),
  PLAYTIME = LogicMemory.offset(228),
  CREATED = LogicMemory.offset(240),
  SERVER_TIME = LogicMemory.offset(248);
class LoginOkMessage extends PiranhaMessage {
  static getSecondsSinceLoginOk() {
    return Math.floor(Date.now() / 1000) - this.logicOkTime;
  }
  static patch() {
    Interceptor.replace(
      decodeAddress,
      new NativeCallback(
        (message, stream) => {
          decode(message, stream);
          PlayerInfo.accountId = new LogicLong(message.add(ACCOUNT).readPointer());
          PlayerInfo.tag = HashTagCodeGenerator.convertLongToPlayerTag(PlayerInfo.accountId);
          if (Validation.isDevAvailable() && ModProperties.isRelease())
            ModProperties.environment = "dev";
          this.logicOkTime = Math.floor(Date.now() / 1000);
          Messaging.clearConnectingTimeout();
          this.sessionStartedTimestamp = Date.now();
          this.sessionCount = message.add(SESSIONS).readInt();
          this.playTimeInSeconds = message.add(PLAYTIME).readInt();
          const created = message.add(CREATED).readPointer(),
            server = message.add(SERVER_TIME).readPointer();
          if (!created.isNull()) this.accountCreatedDate = StringObject.read(created);
          if (!server.isNull()) this.serverTime = Math.trunc(+StringObject.read(server) / 1000);
          BSDMessageManager.sendMessage(
            new GetBSDOwnHomeData(),
            () => {
              BSDHttpClient.startSleep();
              while (BSDHttpClient.shouldSleep) Utils.setGameThreadSleepTo(0.01);
            },
            true,
          ).then((response) => {
            if (response.statusCode !== 200) {
              EDebugger.addMessage(EDebugger.ERROR, `Status Code is ${response.statusCode}`);
              return;
            }
            const encrypted = response.json,
              cipher = new TSChaCha20(TSChaCha20.key, TSChaCha20.nonce),
              data = JSON.parse(
                CustomTextEncoder.decode(
                  cipher.decrypt(
                    new Uint8Array(BSDMessageManager.escapedStringToBytes(encrypted.data)),
                  ),
                ),
              );
            if (BSDMessageManager.validateMessage(data) && data.expires_in != null) {
              if (data.telegramData) BSDPlusManager.telegramData = data.telegramData;
              BSDPlusManager.EXPIRES_TS = Math.floor(Date.now() / 1000) + data.expires_in;
              BSDPlusManager.isBSDPlusEnabled = data.expires_in > 0;
              GetBSDOnlineMessage.lastOnline = data.online ?? 0;
            }
          });
        },
        "void",
        ["pointer", "pointer"],
      ),
    );
  }
}
LoginOkMessage.sessionStartedTimestamp = 0;
LoginOkMessage.sessionCount = 0;
LoginOkMessage.playTimeInSeconds = 0;
LoginOkMessage.accountCreatedDate = "";
LoginOkMessage.serverTime = 0;
LoginOkMessage.logicOkTime = 0;
exports.LoginOkMessage = LoginOkMessage;
