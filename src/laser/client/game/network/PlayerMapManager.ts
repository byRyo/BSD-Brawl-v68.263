// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const handle = new NativeFunction(Libg.offset(8365872, 8034260), "void", ["pointer", "pointer"]);
class PlayerMapManager {
  static handleMapPreview(message) {
    handle(NULL, message.instance);
  }
}
exports.PlayerMapManager = PlayerMapManager;
