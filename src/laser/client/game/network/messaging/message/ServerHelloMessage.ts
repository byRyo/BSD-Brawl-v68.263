// @ts-nocheck
const { Libg } = require("../../../../../../lib/Libg");
const { BSDProxy } = require("../../../../../../suitcase/modconfiguration/BSDProxy");
const { Messaging } = require("../../Messaging");
const address = Libg.offset(13654224, 12765956);
class ServerHelloMessage {
  static patch() {
    Interceptor.attach(address, {
      onEnter() {
        Messaging.clearConnectingTimeout();
        BSDProxy.showProxyDialog = false;
      },
    });
  }
}
exports.ServerHelloMessage = ServerHelloMessage;
