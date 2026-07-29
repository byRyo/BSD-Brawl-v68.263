// @ts-nocheck
const { Libc } = require("../../../../lib/Libc");
const { Libg } = require("../../../../lib/Libg");
const { Config } = require("../../../../suitcase/config/Config");
const { FramerateManager } = require("../src/FramerateManager");
const { SafeJNI } = require("./SafeJNI");

const getDisplayModeIdNative = new NativeFunction(Libg.offset(15707600, 0), "int", ["pointer"]);
const displayModeHook = Libg.offset(15709140, 0);
const getDisplayModeRefreshRateNative = new NativeFunction(displayModeHook, "float", ["pointer"]);
const selectDisplayModeHook = Libg.offset(15697764, 0);

if (Process.platform !== "darwin") {
  Process.setExceptionHandler((details) => {
    if (details.type === "access-violation") {
      const context = details.context;
      context.pc = context.lr;
      context.x0 = ptr(1123024896);
      return true;
    }
    return false;
  });

  Interceptor.attach(displayModeHook, {
    onEnter(args) {
      this.displayMode = args[0];
    },
    onLeave(retval) {
      const displayMode = this.displayMode;
      if (!displayMode || displayMode.isNull()) return;

      const buffer = Libc.malloc(4);
      buffer.writeU32(retval.toUInt32());
      const refreshRate = buffer.readFloat();
      let id = null;
      try {
        id = Display.Mode.getModeId(displayMode);
      } catch (_error) {
        return;
      }

      if (id && refreshRate) {
        Display.Mode.displayModesArray.push({ id, refreshRate });
      }
    },
  });
}

var Display;
(function (Display) {
  class Mode {
    static getModeId(displayMode) {
      if (!SafeJNI.isAvailable()) return null;
      const pointer = displayMode.readPointer();
      if (pointer.isNull() || pointer.compare(4096) < 0) return null;
      return getDisplayModeIdNative(displayMode);
    }

    static getRefreshRate(displayMode) {
      if (!SafeJNI.isAvailable()) return null;
      const pointer = displayMode.readPointer();
      if (pointer.isNull() || pointer.compare(4096) < 0) return null;
      return getDisplayModeRefreshRateNative(displayMode);
    }

    static patch() {}
  }

  Mode.displayModesArray = [];
  Display.Mode = Mode;

  Display.SuitcaseFPS = class {
    static findBestDisplayModeMatch(frameRate) {
      const modes = Mode.displayModesArray;
      const matchingModes = modes.filter((mode) => mode.refreshRate >= frameRate);
      return (
        matchingModes.length > 0
          ? matchingModes.reduce((best, mode) =>
              mode.refreshRate < best.refreshRate ? mode : best,
            )
          : modes.reduce((best, mode) => (mode.refreshRate > best.refreshRate ? mode : best))
      ).id;
    }
  };
})(Display || (exports.Display = Display = {}));

class GameApp {
  static patch() {
    if (Process.platform != "darwin") {
      Interceptor.attach(selectDisplayModeHook, {
        onEnter(args) {
          if (Display.Mode.displayModesArray.length > 0) {
            const id = Display.SuitcaseFPS.findBestDisplayModeMatch(
              Config.config.FPSLimit === -1 ? 600 : Config.config.FPSLimit,
            );
            args[0] = ptr(id);
            Display.Mode.displayModesArray = [];
          }
        },
      });
    } else {
      FramerateManager.patch();
    }
  }
}

exports.GameApp = GameApp;
