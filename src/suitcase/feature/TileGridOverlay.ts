// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TileGridOverlay = void 0;
const LogicMemory_1 = require("../logic/LogicMemory");
const LogicBattleModeClient_1 = require("../../laser/client/logic/mode/LogicBattleModeClient");
const BSDPlusManager_1 = require("../validation/BSDPlusManager");
const GLOverlay_1 = require("./GLOverlay");
const Config_1 = require("../config/Config");
const WIDTH = LogicMemory_1.LogicMemory.offset(196),
  HEIGHT = LogicMemory_1.LogicMemory.offset(200),
  MAX = 300,
  TILE = 100;
class TileGridOverlay {
  static patch() {
    GLOverlay_1.GLOverlay.addRenderer("TileGrid", () => this.render());
  }
  static toggle() {
    Config_1.Config.config.TileGrid = !Config_1.Config.config.TileGrid;
  }
  static isEnabled() {
    return Config_1.Config.config.TileGrid;
  }
  static render() {
    if (!BSDPlusManager_1.BSDPlusManager.isBSDPlusEnabled) return;
    const map = LogicBattleModeClient_1.LogicBattleModeClient.getTileMap();
    if (map.isNull()) return;
    const w = map.add(WIDTH).readS32(),
      h = map.add(HEIGHT).readS32();
    if (w <= 0 || h <= 0 || w > MAX || h > MAX) return;
    const x = w * TILE,
      y = h * TILE;
    GLOverlay_1.GLOverlay.setDrawColor(0.3, 0.6, 1, 0.35);
    for (let i = 0; i <= w; i++) {
      const p = i * TILE;
      GLOverlay_1.GLOverlay.drawLineSegment(p, 0, 0, p, -y, 0);
    }
    for (let i = 0; i <= h; i++) {
      const p = -i * TILE;
      GLOverlay_1.GLOverlay.drawLineSegment(0, p, 0, x, p, 0);
    }
  }
}
exports.TileGridOverlay = TileGridOverlay;
