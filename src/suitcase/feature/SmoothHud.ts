// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmoothHud = void 0;
const MovieClip_1 = require("../../laser/titan/client/common/flash/MovieClip");
const StringTable_1 = require("../../laser/client/game/text/StringTable");
const Stage_1 = require("../../laser/titan/client/common/flash/Stage");
const SmoothHudGraph_1 = require("./SmoothHudGraph");
class SmoothHud {
  static isEnabled() {
    return this.textField !== null;
  }
  static toggle() {
    if (this.textField) {
      Stage_1.Stage.removeChild(this.textField.instance);
      this.textField = null;
      SmoothHudGraph_1.SmoothHudGraph.enabled = false;
      return false;
    }
    this.textField = MovieClip_1.MovieClip.getTextFieldByName(
      StringTable_1.StringTable.getMovieClip("sc/ui.sc", "popover_text_left").instance,
      "text",
    );
    this.textField.x = 20;
    this.textField.y =
      SmoothHudGraph_1.SMOOTH_HUD_GRAPH_HEIGHT_PX / Stage_1.Stage.getPointSize() + 8;
    this.textField.fontOutline = true;
    Stage_1.Stage.addChild(this.textField.instance);
    this.resetWindow(Date.now());
    SmoothHudGraph_1.SmoothHudGraph.enabled = true;
    return true;
  }
  static update() {
    if (!this.textField) return;
    const now = Date.now(),
      ms = now - this.lastFrameAt;
    this.lastFrameAt = now;
    if (ms < this.minFrameMs) this.minFrameMs = ms;
    if (ms > this.maxFrameMs) this.maxFrameMs = ms;
    this.frames++;
    const elapsed = now - this.windowStartedAt;
    if (elapsed < 500) return;
    const fps = Math.round((1000 * this.frames) / elapsed),
      avg = elapsed / this.frames;
    this.textField.color = 3489660928 + (fps >= 50 ? 3329330 : fps >= 30 ? 16776960 : 16711680);
    this.textField.text = "FPS ".concat(
      fps,
      "\n",
      avg.toFixed(1),
      " ms (",
      this.minFrameMs,
      "-",
      this.maxFrameMs,
      ")",
    );
    this.resetWindow(now);
  }
  static resetWindow(now) {
    this.frames = 0;
    this.windowStartedAt = now;
    this.lastFrameAt = now;
    this.minFrameMs = Number.POSITIVE_INFINITY;
    this.maxFrameMs = 0;
  }
}
exports.SmoothHud = SmoothHud;
SmoothHud.textField = null;
SmoothHud.frames = 0;
SmoothHud.windowStartedAt = 0;
SmoothHud.lastFrameAt = 0;
SmoothHud.minFrameMs = Number.POSITIVE_INFINITY;
SmoothHud.maxFrameMs = 0;
