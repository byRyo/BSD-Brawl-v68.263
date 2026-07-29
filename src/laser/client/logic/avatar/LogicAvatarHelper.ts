// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");

const levelUpHeroToTargetLevel = new NativeFunction(Libg.offset(10784580, 10031584), "void", [
  "pointer",
  "pointer",
  "int",
  "int",
]);

class LogicAvatarHelper {
  static levelUpHeroToTargetLevel(avatar, character, level, powerPoints = 0) {
    if (!avatar.isNull() && !character.instance.isNull()) {
      levelUpHeroToTargetLevel(avatar, character.instance, level, powerPoints);
    }
  }
}

exports.LogicAvatarHelper = LogicAvatarHelper;
