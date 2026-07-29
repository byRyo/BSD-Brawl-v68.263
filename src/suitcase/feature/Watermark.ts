// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Watermark = void 0;
const StageDebugText_1 = require("./StageDebugText");
const Stage_1 = require("../../laser/titan/client/common/flash/Stage");
const PlayerInfo_1 = require("../../laser/client/game/friends/PlayerInfo");
const FONT = 20,
  DURATION = 6.6;
const GROUPS = [
  { count: 8, scale: () => 1 + Math.random(), color: () => 1157234687 },
  {
    count: 10,
    scale: (i) => (i < 4 ? 3.5 + Math.random() : 0.7 + Math.random()),
    color: (i) => (i < 4 ? 369098751 : 3154116607),
  },
  {
    count: 37,
    scale: () => 0.4 + 0.3 * Math.random(),
    color: (i) => (i % 3 == 0 ? 1140850688 : 1157234687),
  },
];
class Watermark {
  static toggle() {
    if (this.labels.length) {
      this.clear();
      return;
    }
    this.startedAt = Date.now();
    const w = Stage_1.Stage.getMatrixX(),
      h = Stage_1.Stage.getMatrixY(),
      text = this.watermarkText();
    for (const group of GROUPS)
      for (let i = 0; i < group.count; i++) {
        const label = StageDebugText_1.StageDebugText.create({
          x: Math.random() * w,
          y: Math.random() * h,
          color: group.color(i),
          fontSize: FONT,
          fontOutline: false,
        });
        label.setText(text);
        label.rotate(40 * Math.random() - 20, group.scale(i));
        this.labels.push(label);
      }
    this.update();
  }
  static isEnabled() {
    return this.labels.length > 0;
  }
  static update() {
    if (!this.labels.length) return;
    const elapsed = (Date.now() - this.startedAt) / 1000;
    for (let i = 0; i < this.labels.length; i++) {
      let phase = (elapsed - i) % DURATION;
      if (phase < 0) phase = 0;
      else if (phase > 2) phase = 2;
      const opacity = Math.min(2.5 * Math.abs(phase - 1), 1);
      this.labels[i].setAlpha(Math.round(255 * (0.49 * opacity + 0.01)));
    }
  }
  static watermarkText() {
    return "".concat(this.playerTag(), "\n", this.utcTimestamp());
  }
  static playerTag() {
    try {
      const tag = PlayerInfo_1.PlayerInfo.tag;
      if (tag) return "#".concat(tag);
    } catch (_) {}
    return "BSD";
  }
  static utcTimestamp() {
    const d = new Date(),
      p = (n) => n.toString().padStart(2, "0");
    return "".concat(
      p(d.getUTCFullYear() % 100),
      p(d.getUTCMonth() + 1),
      p(d.getUTCDate()),
      p(d.getUTCHours()),
      p(d.getUTCMinutes()),
      p(d.getUTCSeconds()),
    );
  }
  static clear() {
    for (const label of this.labels) label.destroy();
    this.labels = [];
  }
}
exports.Watermark = Watermark;
Watermark.labels = [];
Watermark.startedAt = 0;
