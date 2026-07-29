// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Libc } = require("../../../../../lib/Libc");
const { GenericPopup } = require("../../../../titan/client/common/flash/GenericPopup");
const RecruitRoadClaimBrawlerPopup_ctor = new NativeFunction(
  Libg.offset(7810392, 7550744),
  "void",
  ["pointer", "bool"],
);
class RecruitRoadClaimBrawlerPopup extends GenericPopup {
  static allocationSize = 560;
  constructor(value) {
    const instance = Libc.calloc(RecruitRoadClaimBrawlerPopup.allocationSize, 1);
    RecruitRoadClaimBrawlerPopup_ctor(instance, value ? 1 : 0);
    super(instance);
  }
}
module.exports = { RecruitRoadClaimBrawlerPopup };
