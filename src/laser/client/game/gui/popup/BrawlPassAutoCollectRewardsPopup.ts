// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Libc } = require("../../../../../lib/Libc");
const { GenericPopup } = require("../../../../titan/client/common/flash/GenericPopup");

const BrawlPassAutoCollectRewardsPopup_ctor = new NativeFunction(
  Libg.offset(6813716, 6666328),
  "void",
  ["pointer", "int", "int", "int"],
);
const BrawlPassAutoCollectRewardsPopup_setData = new NativeFunction(
  Libg.offset(6815312, 6667760),
  "void",
  ["pointer", "pointer"],
);

class BrawlPassAutoCollectRewardsPopup extends GenericPopup {
  static allocationSize = 1152;
  constructor(a, b, c) {
    const instance = Libc.calloc(BrawlPassAutoCollectRewardsPopup.allocationSize, 1);
    BrawlPassAutoCollectRewardsPopup_ctor(instance, a, b, c);
    super(instance);
  }
  setData(data) {
    BrawlPassAutoCollectRewardsPopup_setData(this.instance, data.instance);
  }
}

module.exports = { BrawlPassAutoCollectRewardsPopup };
