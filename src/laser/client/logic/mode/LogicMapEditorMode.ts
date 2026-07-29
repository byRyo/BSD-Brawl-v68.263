// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");

const initMapPreview = new NativeFunction(Libg.offset(12832100, 11625204), "void", ["pointer"]);
const gameModeVariationOffset = LogicMemory.offset(64);
const tileMapOffset = LogicMemory.offset(88);
const playerMapsListOffset = LogicMemory.offset(96);
const previewFlagOffset = LogicMemory.offset(120);

class LogicMapEditorMode {
  constructor(instance) {
    this.instance = instance;
  }
  isNull() {
    return this.instance.isNull();
  }
  initMapPreview() {
    initMapPreview(this.instance);
  }
  setGameModeVariation(value) {
    this.instance.add(gameModeVariationOffset).writeU32(value);
  }
  getTileMap() {
    return this.instance.add(tileMapOffset).readPointer();
  }
  setPlayerMapsList(value) {
    this.instance.add(playerMapsListOffset).writePointer(value.instance);
  }
  clearPreviewFlag() {
    this.instance.add(previewFlagOffset).writeU8(0);
  }
}
exports.LogicMapEditorMode = LogicMapEditorMode;
