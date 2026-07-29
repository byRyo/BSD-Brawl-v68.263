// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");

const MapEditorHUD_isFullPaletteUnlocked = Libg.offset(6105396, 6073920);
const returnTrue = new NativeCallback(() => 1, "int", ["pointer"]);

class MapEditorHUD {
  static fullPaletteUnlocked = false;

  static setFullPaletteUnlocked(value) {
    if (value === this.fullPaletteUnlocked) return;
    this.fullPaletteUnlocked = value;
    if (value) Interceptor.replace(MapEditorHUD_isFullPaletteUnlocked, returnTrue);
    else Interceptor.revert(MapEditorHUD_isFullPaletteUnlocked);
  }

  static isFullPaletteUnlocked() {
    return this.fullPaletteUnlocked;
  }
}

module.exports = { MapEditorHUD };
