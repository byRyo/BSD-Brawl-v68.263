// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { Config } = require("../../../../suitcase/config/Config");

const EmoteIcon_playAnimation = new NativeFunction(Libg.offset(9088388, 8632200), "void", [
  "pointer",
  "int",
  "int",
  "float",
]);

class EmoteIcon {
  static patch() {
    Interceptor.replace(
      EmoteIcon_playAnimation,
      new NativeCallback(
        (instance, animation, frame, time) => {
          if (Config.config.DisablePinAnimation) return EmoteIcon_playAnimation(instance, 0, 0, 0);
          return EmoteIcon_playAnimation(instance, animation, frame, time);
        },
        "void",
        ["pointer", "int", "int", "float"],
      ),
    );
  }
}

module.exports = { EmoteIcon };
