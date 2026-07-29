// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Libc } = require("../../../../../lib/Libc");
const { GenericPopup } = require("../../../../titan/client/common/flash/GenericPopup");
const RewardCompensationPopup_ctor = new NativeFunction(Libg.offset(7924320, 7664612), "void", [
  "pointer",
  "pointer",
]);
class RewardCompensationPopup extends GenericPopup {
  static allocationSize = 448;
  constructor(data) {
    const instance = Libc.calloc(RewardCompensationPopup.allocationSize, 1);
    RewardCompensationPopup_ctor(instance, data);
    super(instance);
  }
}
module.exports = { RewardCompensationPopup };
