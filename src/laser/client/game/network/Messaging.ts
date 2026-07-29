// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { Config } = require("../../../../suitcase/config/Config");
const { FileManager } = require("../../../../suitcase/filesystem/FileManager");
const { Localisation } = require("../../../../suitcase/localisation/Localisation");
const { BSDProxy } = require("../../../../suitcase/modconfiguration/BSDProxy");
const { NativeDialog } = require("../../../titan/client/native/NativeDialog");
const { StringObject } = require("../../../titan/client/native/StringObject");
const { StringTable } = require("../text/StringTable");
const connect = Libg.offset(15222792, 14103704);
class Messaging {
  static patch() {
    Interceptor.attach(connect, {
      onEnter(args) {
        if (!Config.config.WasProxyReset && Config.config.BSDProxy) {
          Config.config.BSDProxy = false;
          Config.config.WasProxyReset = true;
          FileManager.updateConfigFile();
        }
        if (Config.config.BSDProxy) {
          args[1] = StringObject.create("62.233.36.84");
          args[2] = StringObject.create("9339");
        } else
          Messaging.connectionTimeout = setTimeout(() => {
            if (BSDProxy.showProxyDialog)
              NativeDialog.show(
                StringTable.getString("TID_ERROR_POP_UP_LOGIN_BLOCKED_TITLE"),
                StringTable.getString("TID_LOGIN_RESTRICTED_BY_LOCATION"),
                "OK",
                "",
                Localisation.getString("EnableProxy"),
                BSDProxy.proxyNativeDialogListener.instance,
              );
            else Messaging.connectionTimeout = null;
          }, 12000);
      },
    });
  }
  static clearConnectingTimeout() {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
  }
}
Messaging.connectionTimeout = null;
exports.Messaging = Messaging;
