// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const BrawlPassUnlockBrawlerPopup_show = new NativeFunction(Libg.offset(6886240, 6729232), "void", [
  "int",
  "int",
]);
class BrawlPassUnlockBrawlerPopup {
  static show(index = 0) {
    BrawlPassUnlockBrawlerPopup_show(index, 0);
  }
}
module.exports = { BrawlPassUnlockBrawlerPopup };
