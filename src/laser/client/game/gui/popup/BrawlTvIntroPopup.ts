// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Libc } = require("../../../../../lib/Libc");
const { GenericPopup } = require("../../../../titan/client/common/flash/GenericPopup");
const BrawlTvIntroPopup_ctor = new NativeFunction(Libg.offset(6893152, 6738420), "void", [
  "pointer",
]);
class BrawlTvIntroPopup extends GenericPopup {
  static allocationSize = 440;
  constructor() {
    const instance = Libc.calloc(BrawlTvIntroPopup.allocationSize, 1);
    BrawlTvIntroPopup_ctor(instance);
    super(instance);
  }
}
module.exports = { BrawlTvIntroPopup };
