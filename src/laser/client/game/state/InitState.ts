// @ts-nocheck
const { GameMain } = require("../../GameMain");
const { Libg } = require("../../../../lib/Libg");
const { FontManager } = require("../../../titan/client/common/font/FontManager");
const { Config } = require("../../../../suitcase/config/Config");
const { StringObject } = require("../../../titan/client/native/StringObject");
const { MaintenancePopupPreview } = require("../../../../suitcase/feature/MaintenancePopupPreview");
const { LoadingScreen, ContentUpdateScreen_update } = require("./loading/LoadingScreen");

const initStateUpdate = Libg.offset(10257432, 9633712);
const InitState_initFonts = Libg.offset(10260408, 9635848);
const showMaintenancePopupNative = new NativeFunction(Libg.offset(10258000, 9634224), "void", [
  "pointer",
  "int",
  "pointer",
  "int",
]);

class InitState {
  static showMaintenancePopup(instance, value, text, reason) {
    if (!instance.isNull()) {
      StringObject.with(text, (string) =>
        showMaintenancePopupNative(instance, value, string, reason),
      );
    }
  }

  static patch() {
    let timeout;
    let fontIndex = -1;

    Interceptor.attach(initStateUpdate, function () {
      fontIndex = this.context.x20.toInt32();
      timeout ??= setTimeout(() => {
        if (fontIndex < 5) {
          GameMain.reloadGame();
          InitState.useGameAssetsToHost = true;
        }
      }, 3000);
    });

    Interceptor.attach(InitState_initFonts, {
      onEnter() {
        GameMain.loadAsset("sc/debug.sc");
        if (Config.config.Font === -1) return;
        const font = FontManager.BSD_FONTS[Config.config.Font];
        if (font?.fileName) GameMain.loadAsset(font.fileName);
      },
      onLeave() {
        if (Config.config.Font === -1) {
          FontManager.setForcedFontName("");
          return;
        }
        const selectedFont = FontManager.BSD_FONTS[Config.config.Font];
        if (!selectedFont) return;
        FontManager.setForcedFontName(selectedFont.name);
        const count = FontManager.getFontCount();
        for (let i = 0; i < count; i++) {
          const font = FontManager.getFontAt(i);
          if (font && selectedFont.name.split(" ").includes(font.getFullName())) {
            font.setGlyphMargin(1, 1, 4, 1, 30);
          }
        }
      },
    });

    Interceptor.attach(ContentUpdateScreen_update, {
      onEnter(args) {
        try {
          MaintenancePopupPreview.onInitStateUpdate(args[0]);
        } catch (_) {}
      },
    });
  }
}

InitState.useGameAssetsToHost = false;
exports.InitState_initFonts = InitState_initFonts;
exports.InitState = InitState;
