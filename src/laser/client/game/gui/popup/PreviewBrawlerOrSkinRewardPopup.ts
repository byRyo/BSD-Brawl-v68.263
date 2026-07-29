// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Libc } = require("../../../../../lib/Libc");
const { GenericPopup } = require("../../../../titan/client/common/flash/GenericPopup");
const { StringObject } = require("../../../../titan/client/native/StringObject");
const PreviewBrawlerOrSkinRewardPopup_ctor = new NativeFunction(
  Libg.offset(7617704, 7396868),
  "void",
  ["pointer", "pointer", "pointer", "int", "pointer"],
);
class PreviewBrawlerOrSkinRewardPopup extends GenericPopup {
  static allocationSize = 520;
  constructor(reward) {
    const instance = Libc.malloc(PreviewBrawlerOrSkinRewardPopup.allocationSize);
    StringObject.with("", (text) =>
      PreviewBrawlerOrSkinRewardPopup_ctor(instance, NULL, reward.instance, 0, text),
    );
    super(instance);
  }
}
module.exports = { PreviewBrawlerOrSkinRewardPopup };
