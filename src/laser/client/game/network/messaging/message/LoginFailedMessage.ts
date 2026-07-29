// @ts-nocheck
const { Libg } = require("../../../../../../lib/Libg");
const { Breadcrumbs } = require("../../../../../../suitcase/debug/Breadcrumbs");
const { LogicMemory } = require("../../../../../../suitcase/logic/LogicMemory");
const { PiranhaMessage } = require("../../../../../titan/client/common/messaging/PiranhaMessage");
const { Messaging } = require("../../Messaging");
const decode = Libg.offset(12348892, 11272492),
  error = LogicMemory.offset(144);
class LoginFailedMessage extends PiranhaMessage {
  get errorCode() {
    return this.instance.add(error).readInt();
  }
  static patch() {
    Interceptor.attach(decode, {
      onEnter(args) {
        this.message = args[0];
      },
      onLeave() {
        const message = new LoginFailedMessage(this.message);
        Breadcrumbs.push(`LoginFailed code: ${message.errorCode}`);
        Messaging.clearConnectingTimeout();
      },
    });
  }
}
exports.LoginFailedMessage = LoginFailedMessage;
