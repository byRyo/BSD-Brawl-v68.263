// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageDebugText = void 0;
const MovieClip_1 = require("../../laser/titan/client/common/flash/MovieClip");
const Stage_1 = require("../../laser/titan/client/common/flash/Stage");
const StringTable_1 = require("../../laser/client/game/text/StringTable");
const TextField_1 = require("../../laser/titan/client/common/flash/TextField");
class StageDebugText {
  constructor(textfield) {
    this.textfield = textfield;
  }
  static create(options) {
    const clip = StringTable_1.StringTable.getMovieClip("sc/ui.sc", "popover_text_left");
    const field = MovieClip_1.MovieClip.getTextFieldByName(clip.instance, "text");
    field.x = options.x;
    field.y = options.y;
    field.color = options.color ?? 4294967295;
    field.fontOutline = options.fontOutline ?? true;
    field.fontSize = options.fontSize ?? 12;
    const textfield = new TextField_1.TextField(field.instance);
    Stage_1.Stage.addChild(textfield.instance);
    return new StageDebugText(textfield);
  }
  setText(text) {
    this.textfield.text = text;
  }
  rotate(angle, pivot) {
    this.textfield.rotate(angle, pivot, pivot);
  }
  setAlpha(alpha) {
    this.textfield.alpha = alpha;
  }
  destroy() {
    Stage_1.Stage.removeChild(this.textfield.instance);
  }
}
exports.StageDebugText = StageDebugText;
