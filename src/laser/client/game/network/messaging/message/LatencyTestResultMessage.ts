// @ts-nocheck
const { Libg } = require("../../../../../../lib/Libg");
const { Config } = require("../../../../../../suitcase/config/Config");
const { FileManager } = require("../../../../../../suitcase/filesystem/FileManager");
const { Localisation } = require("../../../../../../suitcase/localisation/Localisation");
const { BattleServersManager } = require("../../../../../../suitcase/modmenu/BattleServers");
const { GUI } = require("../../../gui/GUI");
const decodeAddress = Libg.offset(13638844, 12749912),
  decode = new NativeFunction(decodeAddress, "void", ["pointer", "pointer"]);
const REGION = 144,
  PING = 148,
  A = 152,
  B = 156,
  C = 160;
class LatencyTestResultMessage {
  static patch() {
    Interceptor.replace(
      decodeAddress,
      new NativeCallback(
        (message, stream) => {
          if (BattleServersManager.preferredBattleRegionId !== -1) {
            if (message.add(REGION).readS32() === BattleServersManager.preferredBattleRegionId) {
              Config.config.WasBattleServerChanged = true;
              FileManager.updateConfigFile();
              if (BattleServersManager.lastChangedBattleServerName !== "Loading...")
                GUI.showFloaterTextAtDefaultPosition(
                  Localisation.getString("BattleServerChanged").replace(
                    "{battleServer}",
                    BattleServersManager.lastChangedBattleServerName,
                  ),
                  4281519410,
                );
            } else message.add(PING).writeS32(message.add(PING).readS32() + 1000);
            message.add(A).writeS32(5);
            message.add(B).writeS32(5);
            message.add(C).writeS32(10);
          }
          decode(message, stream);
        },
        "void",
        ["pointer", "pointer"],
      ),
    );
  }
}
exports.LatencyTestResultMessage = LatencyTestResultMessage;
