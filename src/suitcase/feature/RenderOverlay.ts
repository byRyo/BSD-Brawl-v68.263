// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIN_VP_MATRIX_VALUE =
  exports.MAX_GAME_OBJECTS =
  exports.FRAMES_BEFORE_INIT =
  exports.LINE_STRIDE_FLOATS =
  exports.MAX_LINES_PER_FRAME =
  exports.MAX_VERTEX_FLOATS =
  exports.VERTICES_PER_LINE =
  exports.VERTEX_STRIDE_BYTES =
  exports.BYTES_PER_FLOAT =
  exports.FLOATS_PER_VERTEX =
  exports.RenderOverlay =
    void 0;
const Libc_1 = require("../../lib/Libc");
const BattleMode_1 = require("../../laser/client/game/state/battlemode/BattleMode");
const BattleScreen_1 = require("../../laser/client/game/screen/battle/BattleScreen");
const Config_1 = require("../config/Config");
const LogicMemory_1 = require("../logic/LogicMemory");
const BSDPlusManager_1 = require("../validation/BSDPlusManager");
const LogicBattleModeClient_1 = require("../../laser/client/logic/mode/LogicBattleModeClient");
const EnemyTracer_1 = require("./EnemyTracer");
const DebugMenuState_1 = require("../modmenu/debugmenu/DebugMenuState");
const VP_MATRIX_OFFSET = LogicMemory_1.LogicMemory.offset(2120);
exports.FLOATS_PER_VERTEX = 3;
exports.BYTES_PER_FLOAT = 4;
exports.VERTEX_STRIDE_BYTES = exports.FLOATS_PER_VERTEX * exports.BYTES_PER_FLOAT;
exports.VERTICES_PER_LINE = 2;
exports.MAX_VERTEX_FLOATS = 512;
exports.MAX_LINES_PER_FRAME = 1024;
exports.LINE_STRIDE_FLOATS = 10;
exports.FRAMES_BEFORE_INIT = 30;
exports.MAX_GAME_OBJECTS = 100;
exports.MIN_VP_MATRIX_VALUE = 0.01;
const CUBE_EDGES = [0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7];
class RenderOverlay {
  constructor() {
    this.inBattle = false;
    this.isInitialized = false;
    this.initializationAttempted = false;
    this.framesSinceStart = 0;
  }
  static addRenderer(configKey, callback) {
    this.registeredRenderers.push({ configKey, callback });
  }
  static setDrawColor(r, g, b, a) {
    if (this.collectingData) this.currentColor = { r, g, b, a };
    else if (this.backend) this.backend.setColorUniform(r, g, b, a);
  }
  static drawLineSegment(x1, y1, z1, x2, y2, z2) {
    if (this.collectingData) {
      if (this.pendingCount >= exports.MAX_LINES_PER_FRAME) return;
      const i = this.pendingCount * exports.LINE_STRIDE_FLOATS;
      const c = this.currentColor;
      this.pendingBuffer[i] = c.r;
      this.pendingBuffer[i + 1] = c.g;
      this.pendingBuffer[i + 2] = c.b;
      this.pendingBuffer[i + 3] = c.a;
      this.pendingBuffer[i + 4] = x1;
      this.pendingBuffer[i + 5] = y1;
      this.pendingBuffer[i + 6] = z1;
      this.pendingBuffer[i + 7] = x2;
      this.pendingBuffer[i + 8] = y2;
      this.pendingBuffer[i + 9] = z2;
      this.pendingCount++;
    } else if (this.backend) {
      this.vertexDataBuffer.writeFloat(x1);
      this.vertexDataBuffer.add(4).writeFloat(y1);
      this.vertexDataBuffer.add(8).writeFloat(z1);
      this.vertexDataBuffer.add(12).writeFloat(x2);
      this.vertexDataBuffer.add(16).writeFloat(y2);
      this.vertexDataBuffer.add(20).writeFloat(z2);
      this.backend.uploadAndDrawLines(this.vertexDataBuffer, exports.VERTICES_PER_LINE);
    }
  }
  static drawWireframeCube(minX, minY, minZ, maxX, maxY, maxZ) {
    const p = [
      [minX, minY, minZ],
      [maxX, minY, minZ],
      [maxX, maxY, minZ],
      [minX, maxY, minZ],
      [minX, minY, maxZ],
      [maxX, minY, maxZ],
      [maxX, maxY, maxZ],
      [minX, maxY, maxZ],
    ];
    for (let i = 0; i < CUBE_EDGES.length; i += 2)
      this.drawLineSegment(...p[CUBE_EDGES[i]], ...p[CUBE_EDGES[i + 1]]);
  }
  static patch() {
    this.backend =
      Process.platform === "darwin"
        ? new (require("./MetalOverlay").MetalOverlayBackend)()
        : new (require("./GLOverlay").GLOverlayBackend)();
    this.backend.setupHooks();
  }
  static collectFrameData() {
    if (!this.inBattle || !BSDPlusManager_1.BSDPlusManager.isBSDPlusEnabled) return;
    const active = this.registeredRenderers.filter((x) => Config_1.Config.config[x.configKey]);
    if (!active.length) return;
    try {
      const modePtr = BattleMode_1.BattleMode.getLogicBattleModeClient();
      if (modePtr.isNull()) return;
      const mode = new LogicBattleModeClient_1.LogicBattleModeClient(modePtr);
      const objects = mode.getGameObjects();
      const array = objects.getArray();
      if (array.isNull()) return;
      const count = objects.getItemsCount();
      if (count <= 0 || count > exports.MAX_GAME_OBJECTS) return;
      this.pendingCount = 0;
      this.collectingData = true;
      for (const renderer of active) {
        try {
          renderer.callback(array, count, mode.ownPlayerTeam, mode.ownPlayerIndex);
        } catch (_) {}
      }
      this.collectingData = false;
      const old = this.lineBuffer;
      this.lineBuffer = this.pendingBuffer;
      this.lineCount = this.pendingCount;
      this.pendingBuffer = old;
    } catch (_) {}
  }
  static onFrame() {
    this.framesSinceStart++;
    if (!this.initializationAttempted && this.framesSinceStart > exports.FRAMES_BEFORE_INIT) {
      this.initializationAttempted = true;
      try {
        this.initializeGPU();
      } catch (_) {}
    }
    if (
      !this.isInitialized ||
      !BSDPlusManager_1.BSDPlusManager.isBSDPlusEnabled ||
      !this.inBattle ||
      DebugMenuState_1.DebugMenuState.isOpen ||
      this.lineCount === 0
    )
      return;
    try {
      const screen = BattleScreen_1.BattleScreen.getInstance();
      if (!screen || screen.isNull()) return;
      const matrix = screen.add(VP_MATRIX_OFFSET);
      if (Math.abs(matrix.readFloat()) < exports.MIN_VP_MATRIX_VALUE) return;
      this.saveAndPrepareState(matrix);
      this.flushAllLines();
      this.restoreState();
    } catch (_) {}
  }
  static flushAllLines() {
    let vertexCount = 0,
      last = [-1, -1, -1, -1];
    const flush = () => {
      if (vertexCount) {
        this.backend.uploadAndDrawLines(this.vertexDataBuffer, vertexCount);
        vertexCount = 0;
      }
    };
    for (let i = 0; i < this.lineCount; i++) {
      const o = i * exports.LINE_STRIDE_FLOATS,
        color = [
          this.lineBuffer[o],
          this.lineBuffer[o + 1],
          this.lineBuffer[o + 2],
          this.lineBuffer[o + 3],
        ];
      if (color.some((v, j) => v !== last[j])) {
        flush();
        this.setColorUniform(...color);
        last = color;
      }
      if (
        (vertexCount + exports.VERTICES_PER_LINE) * exports.FLOATS_PER_VERTEX >
        exports.MAX_VERTEX_FLOATS
      )
        flush();
      for (let j = 0; j < 6; j++)
        this.vertexDataBuffer
          .add(vertexCount * exports.VERTEX_STRIDE_BYTES + j * 4)
          .writeFloat(this.lineBuffer[o + 4 + j]);
      vertexCount += exports.VERTICES_PER_LINE;
    }
    flush();
  }
  static onBattleEnter() {
    this.inBattle = true;
    EnemyTracer_1.EnemyTracer.resetErrors();
  }
  static onBattleExit() {
    this.inBattle = false;
    this.lineCount = 0;
    this.pendingCount = 0;
  }
  static setupBattleHooks() {
    BattleScreen_1.BattleScreen.addExitListener(() => this.onBattleExit());
    BattleScreen_1.BattleScreen.addEnterListener(() => this.onBattleEnter());
    BattleScreen_1.BattleScreen.addUpdateListener(() => this.collectFrameData());
  }
  static setupHooks() {}
  static initializeGPU() {}
  static saveAndPrepareState(_matrix) {}
  static setColorUniform(_r, _g, _b, _a) {}
  static uploadAndDrawLines(_buffer, _count) {}
  static restoreState() {}
}
exports.RenderOverlay = RenderOverlay;
RenderOverlay.backend = null;
RenderOverlay.registeredRenderers = [];
RenderOverlay.collectingData = false;
RenderOverlay.currentColor = { r: 1, g: 1, b: 1, a: 1 };
RenderOverlay.vertexDataBuffer = Libc_1.Libc.malloc(
  exports.MAX_VERTEX_FLOATS * exports.BYTES_PER_FLOAT,
);
RenderOverlay.lineBuffer = new Float32Array(
  exports.MAX_LINES_PER_FRAME * exports.LINE_STRIDE_FLOATS,
);
RenderOverlay.lineCount = 0;
RenderOverlay.pendingBuffer = new Float32Array(
  exports.MAX_LINES_PER_FRAME * exports.LINE_STRIDE_FLOATS,
);
RenderOverlay.pendingCount = 0;
