// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Libc } = require("../../../../../lib/Libc");
const { GenericPopup } = require("../../../../titan/client/common/flash/GenericPopup");
const PlayerCountryPopup_ctor = new NativeFunction(Libg.offset(7576868, 7359512), "pointer", [
  "pointer",
]);
class PlayerCountryPopup extends GenericPopup {
  static allocationSize = 472;
  constructor() {
    const instance = Libc.calloc(PlayerCountryPopup.allocationSize, 1);
    PlayerCountryPopup_ctor(instance);
    super(instance);
  }
}
module.exports = { PlayerCountryPopup };
