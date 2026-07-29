// @ts-nocheck
const { Utils } = require("../../../../../../tools/skinchanger-config/titan/utils/Utils");
const { Libg } = require("../../../../../../lib/Libg");
const { Config } = require("../../../../../../suitcase/config/Config");
const { CustomTextEncoder } = require("../../../../../../suitcase/crypto/CustomTextEncoder");
const { TSChaCha20 } = require("../../../../../../suitcase/crypto/TSChaCha20");
const { Logcat } = require("../../../../../../suitcase/debug/Logcat");
const { LogicMemory } = require("../../../../../../suitcase/logic/LogicMemory");
const { BSDHttpClient } = require("../../../../../../suitcase/network/BSDHttpClient");
const {
  BSDMessageManager,
} = require("../../../../../../suitcase/network/messaging/BSDMessageManager");
const {
  GetBSDBattleProxyMessage,
} = require("../../../../../../suitcase/network/messaging/message/GetBSDBattleProxyMessage");
const { BSDPlusManager } = require("../../../../../../suitcase/validation/BSDPlusManager");
const { StringObject } = require("../../../../../titan/client/native/StringObject");
const decode = Libg.offset(12709328, 11547936),
  IP = LogicMemory.offset(144),
  PORT = LogicMemory.offset(152);
class UdpConnectionInfoMessage {
  static patch() {
    Interceptor.attach(decode, {
      onEnter(args) {
        this.message = args[0];
      },
      onLeave() {
        const message = this.message;
        UdpConnectionInfoMessage.ip = StringObject.read(message.add(IP).readPointer());
        UdpConnectionInfoMessage.port = message.add(PORT).readInt();
        if (Config.config.UseBattleProxy && BSDPlusManager.isBSDPlusEnabled)
          BSDMessageManager.sendMessage(
            new GetBSDBattleProxyMessage(
              UdpConnectionInfoMessage.ip,
              UdpConnectionInfoMessage.port,
            ),
            () => {
              BSDHttpClient.startSleep();
              while (BSDHttpClient.shouldSleep) Utils.setGameThreadSleepTo(0.01);
            },
            true,
          ).then((response) => {
            if (response.statusCode !== 200 || !response.json) return;
            const cipher = new TSChaCha20(TSChaCha20.key, TSChaCha20.nonce),
              data = JSON.parse(
                CustomTextEncoder.decode(
                  cipher.decrypt(
                    new Uint8Array(BSDMessageManager.escapedStringToBytes(response.json.data)),
                  ),
                ),
              );
            if (data.data?.ip && data.data?.port && !message.isNull()) {
              UdpConnectionInfoMessage.ip = data.data.ip;
              UdpConnectionInfoMessage.port = data.data.port;
              try {
                StringObject.create(data.data.ip, message.add(IP).readPointer());
                message.add(PORT).writeInt(data.data.port);
              } catch (_) {
                return;
              }
            }
          });
        Logcat.logDebug(UdpConnectionInfoMessage.ip);
        Logcat.logDebug(UdpConnectionInfoMessage.port);
      },
    });
  }
}
UdpConnectionInfoMessage.ip = "";
UdpConnectionInfoMessage.port = -1;
exports.UdpConnectionInfoMessage = UdpConnectionInfoMessage;
