// @ts-nocheck
const { Libg } = require("../../../../../../lib/Libg");
const { Config } = require("../../../../../../suitcase/config/Config");

const isSoundEffectsEnabled = new NativeFunction(Libg.offset(10123260, 9519036), "bool", [
  "pointer",
]);
const isMusicEnabled = new NativeFunction(Libg.offset(10122812, 9518752), "bool", ["pointer"]);

class GameSettings {
  static patch() {
    Interceptor.replace(
      isMusicEnabled,
      new NativeCallback(
        (self) => {
          if (Config.config.SoundMuted) return false;
          return isMusicEnabled(self);
        },
        "bool",
        ["pointer"],
      ),
    );
    Interceptor.replace(
      isSoundEffectsEnabled,
      new NativeCallback(
        (self) => {
          if (Config.config.SoundMuted) return false;
          return isSoundEffectsEnabled(self);
        },
        "bool",
        ["pointer"],
      ),
    );
  }
}

exports.GameSettings = GameSettings;
