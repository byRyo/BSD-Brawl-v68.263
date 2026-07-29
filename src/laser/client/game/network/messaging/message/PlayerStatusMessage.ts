// @ts-nocheck
const { PiranhaMessage } = require("../../../../../titan/client/common/messaging/PiranhaMessage");
const { Libg } = require("../../../../../../lib/Libg");
const { Config } = require("../../../../../../suitcase/config/Config");
const address = Libg.offset(12385284, 11301744);
class PlayerStatusMessage extends PiranhaMessage {
  static patch() {
    Interceptor.attach(address, {
      onEnter(args) {
        if (Config.config.HideBattlingStatusFromOthers && args[1].toInt32() === 1) args[1] = ptr(3);
      },
    });
  }
}
exports.PlayerStatusMessage = PlayerStatusMessage;
