// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { GameStateManager, GameStateId } = require("../state/GameStateManager");
const { MessageManager } = require("../network/MessageManager");
const { GoHomeMessage } = require("../network/messaging/message/GoHomeMessage");
const { LogicMapEditorMode } = require("../../logic/mode/LogicMapEditorMode");
const { LogicPlayerMapUtil } = require("../../logic/home/LogicPlayerMapUtil");
const { MapEditorHUD } = require("../gui/MapEditorHUD");
const { ThemeSelectorManager } = require("../../../../suitcase/modmenu/ThemeSelector");

const enterAddress = Libg.offset(8960280, 8519584);
const saveNative = new NativeFunction(Libg.offset(8978724, 8531132), "void", ["pointer"]);
const clearAllNative = new NativeFunction(Libg.offset(8983316, 8534768), "void", ["pointer"]);
const refreshTileCountsNative = new NativeFunction(Libg.offset(8988420, 8537304), "void", [
  "pointer",
]);
const setTileNative = new NativeFunction(Libg.offset(8970044, 8526136), "void", [
  "pointer",
  "uint",
  "uint",
]);
const selectEraserBrushNative = new NativeFunction(Libg.offset(8983260, 8534724), "void", [
  "pointer",
  "pointer",
]);
const undoNative = new NativeFunction(Libg.offset(8984548, 8535324), "void", ["pointer"]);
const redoNative = new NativeFunction(Libg.offset(8986372), "void", ["pointer"]);

const logicHolderOffset = LogicMemory.offset(2520);
const placementModeOffset = LogicMemory.offset(2704);
const gridOffset = LogicMemory.offset(2304);
const logicMapEditorOffset = LogicMemory.offset(48);
const tileMapWidthOffset = LogicMemory.offset(196);
const tileMapHeightOffset = LogicMemory.offset(200);
const placementModeCount = 5;

const MapEditorPlacementMode = {
  0: "Normal",
  Normal: 0,
  1: "MirrorHorizontal",
  MirrorHorizontal: 1,
  2: "MirrorVertical",
  MirrorVertical: 2,
  3: "MirrorBoth",
  MirrorBoth: 3,
  4: "MirrorDiagonal",
  MirrorDiagonal: 4,
};

class MapEditorScreen {
  static get enterAddr() {
    return enterAddress;
  }

  static patch() {
    Interceptor.attach(enterAddress, {
      onEnter(args) {
        MapEditorScreen.instance = args[0];
        ThemeSelectorManager.hideCustomBackground();
      },
    });
  }

  static getInstance() {
    if (GameStateManager.isInState(GameStateId.MapEditor)) return this.instance;
    return NULL;
  }

  static getLogicMapEditor(instance) {
    const holder = instance.add(logicHolderOffset).readPointer();
    if (holder.isNull()) return NULL;
    return holder.add(logicMapEditorOffset).readPointer();
  }

  static getTileMap(instance) {
    const logic = this.getLogicMapEditor(instance);
    if (logic.isNull()) return NULL;
    return new LogicMapEditorMode(logic).getTileMap();
  }

  static toggleGrid() {
    const instance = this.getInstance();
    if (instance.isNull()) return;
    const value = instance.add(gridOffset);
    value.writeS32(value.readS32() === 0 ? 1 : 0);
  }

  static cyclePlacementMode() {
    const instance = this.getInstance();
    if (instance.isNull()) return;
    const mode = (instance.add(placementModeOffset).readS32() + 1) % placementModeCount;
    instance.add(placementModeOffset).writeS32(mode);
  }

  static cyclePlacementModeBackward() {
    const instance = this.getInstance();
    if (instance.isNull()) return;
    const mode =
      (instance.add(placementModeOffset).readS32() + placementModeCount - 1) % placementModeCount;
    instance.add(placementModeOffset).writeS32(mode);
  }

  static setPlacementMode(mode) {
    const instance = this.getInstance();
    if (!instance.isNull()) instance.add(placementModeOffset).writeS32(mode);
  }

  static save() {
    const instance = this.getInstance();
    if (!instance.isNull()) saveNative(instance);
  }
  static clearAll() {
    const instance = this.getInstance();
    if (!instance.isNull()) clearAllNative(instance);
  }
  static refreshTileCounts() {
    const instance = this.getInstance();
    if (!instance.isNull()) refreshTileCountsNative(instance);
  }
  static undo() {
    const instance = this.getInstance();
    if (!instance.isNull()) undoNative(instance);
  }
  static redo() {
    const instance = this.getInstance();
    if (!instance.isNull()) redoNative(instance);
  }
  static selectEraserBrush() {
    const instance = this.getInstance();
    if (!instance.isNull()) selectEraserBrushNative(instance, NULL);
  }

  static fillAll() {
    const instance = this.getInstance();
    if (instance.isNull()) return;
    const tileMap = this.getTileMap(instance);
    if (tileMap.isNull()) return;
    const width = tileMap.add(tileMapWidthOffset).readS32();
    const height = tileMap.add(tileMapHeightOffset).readS32();
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) setTileNative(instance, x, y);
    }
    refreshTileCountsNative(instance);
  }

  static fillRegion(x1, y1, x2, y2) {
    const instance = this.getInstance();
    if (instance.isNull()) return;
    const tileMap = this.getTileMap(instance);
    if (tileMap.isNull()) return;
    const width = tileMap.add(tileMapWidthOffset).readS32();
    const height = tileMap.add(tileMapHeightOffset).readS32();
    const minX = Math.max(0, Math.min(x1, x2));
    const minY = Math.max(0, Math.min(y1, y2));
    const maxX = Math.min(width - 1, Math.max(x1, x2));
    const maxY = Math.min(height - 1, Math.max(y1, y2));
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) setTileNative(instance, x, y);
    }
    refreshTileCountsNative(instance);
  }

  static eraseAll() {
    const instance = this.getInstance();
    if (!instance.isNull()) {
      selectEraserBrushNative(instance, NULL);
      this.fillAll();
    }
  }

  static toggleSaveValidationBypass() {
    LogicPlayerMapUtil.setValidationBypassed(!LogicPlayerMapUtil.isValidationBypassed());
  }
  static isSaveValidationBypassed() {
    return LogicPlayerMapUtil.isValidationBypassed();
  }
  static togglePlacementRestrictionBypass() {
    LogicPlayerMapUtil.setRestrictedAreaBypassed(!LogicPlayerMapUtil.isRestrictedAreaBypassed());
  }
  static isPlacementRestrictionBypassed() {
    return LogicPlayerMapUtil.isRestrictedAreaBypassed();
  }
  static toggleFullPalette() {
    MapEditorHUD.setFullPaletteUnlocked(!MapEditorHUD.isFullPaletteUnlocked());
  }
  static isFullPaletteUnlocked() {
    return MapEditorHUD.isFullPaletteUnlocked();
  }

  static goHome() {
    if (GameStateManager.isInState(GameStateId.MapEditor)) {
      GameStateManager.clearGameData();
      GameStateManager.changeState(GameStateId.Home);
      MessageManager.sendMessage(new GoHomeMessage());
    }
  }
}

MapEditorScreen.instance = NULL;
exports.MapEditorPlacementMode = MapEditorPlacementMode;
exports.MapEditorScreen = MapEditorScreen;
