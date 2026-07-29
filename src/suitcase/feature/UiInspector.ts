// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiInspector = void 0;
const Libc_1 = require("../../lib/Libc");
const Stage_1 = require("../../laser/titan/client/common/flash/Stage");
const DisplayObject_1 = require("../../laser/titan/client/common/flash/DisplayObject");
const MovieClip_1 = require("../../laser/titan/client/common/flash/MovieClip");
const ColorTransform_1 = require("../../laser/titan/client/common/flash/ColorTransform");
const TextField_1 = require("../../laser/titan/client/common/flash/TextField");
const StringTable_1 = require("../../laser/client/game/text/StringTable");
const BOXES = 6,
  STRIPS = 4,
  LABELS = 8,
  LABEL_STEP = 20,
  MAX_DEPTH = 4,
  ALPHA = 235,
  MAX_LEAVES = 100000,
  MAX_CHILDREN = 256,
  MAX_ENTRIES = 256,
  MAX_TEXT = 24,
  COLORS = [
    [0, 229, 255],
    [255, 64, 129],
    [124, 252, 0],
    [255, 193, 7],
    [156, 39, 176],
    [255, 87, 34],
  ];
class UiInspector {
  static isEnabled() {
    return this.enabled;
  }
  static toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      try {
        if (!Stage_1.Stage.getMainSprite().isNull()) {
          this.ensureInitialized();
          this.bringToTop();
        }
      } catch (_) {}
    } else this.hideAll();
    return this.enabled;
  }
  static patch() {
    if (this.patched) return;
    this.patched = true;
    Interceptor.attach(Stage_1.Stage.objectsUnderPointAddr, {
      onLeave: (retval) => {
        if (this.enabled) this.captureLeaves(retval);
      },
    });
  }
  static update() {
    if (this.enabled && this.captureSeq !== this.renderedSeq) {
      this.renderedSeq = this.captureSeq;
      try {
        this.render();
      } catch (_) {}
    }
  }
  static captureLeaves(result) {
    try {
      if (result.isNull()) return;
      const begin = result.readPointer(),
        end = result.add(Process.pointerSize).readPointer();
      if (begin.isNull() || end.isNull()) return;
      const count = end.sub(begin).toInt32() / Process.pointerSize;
      if (count < 0 || count > MAX_LEAVES) return;
      const leaves = [];
      for (let i = 0; i < count; i++) {
        const p = begin.add(i * Process.pointerSize).readPointer();
        if (!p.isNull()) leaves.push(p);
      }
      this.capturedLeaves = leaves;
      this.captureSeq++;
    } catch (_) {}
  }
  static render() {
    if (Stage_1.Stage.getInstance().isNull()) return;
    const root = Stage_1.Stage.getMainSprite();
    if (root.isNull()) return;
    this.ensureInitialized();
    const entries = this.collectEntries(root);
    if (!entries.length) {
      this.hideAll();
      return;
    }
    let shown = 0;
    for (let i = 0; i < entries.length && shown < BOXES; i++) {
      if (entries[i].bounds) {
        this.drawBox(shown, entries[i].bounds, COLORS[shown % COLORS.length]);
        shown++;
      }
    }
    for (let i = shown; i < BOXES; i++) this.hideBox(i);
    this.drawLabels(entries);
  }
  static drawLabels(entries) {
    const count = Math.min(entries.length, LABELS),
      first = entries[0]?.bounds,
      x = first ? first.left : 40;
    let y = first ? first.top - count * LABEL_STEP - 6 : 80;
    if (first && y < 10) y = first.bottom + 6;
    for (let i = 0; i < count; i++) {
      const label = this.labels[i];
      label.setText("Text", this.formatEntry(entries[i]));
      label.setXY(x, y + i * LABEL_STEP);
      label.visibility = 1;
    }
    for (let i = count; i < LABELS; i++) this.labels[i].visibility = 0;
  }
  static collectEntries(root) {
    const seen = new Set(),
      entries = [],
      add = (p) => {
        const key = p.toString();
        if (seen.has(key)) return null;
        seen.add(key);
        const e = { instance: p, type: "?", name: "", x: 0, y: 0, bounds: null };
        entries.push(e);
        return e;
      };
    for (const leaf of this.capturedLeaves) {
      let p = leaf,
        depth = 0;
      while (!p.isNull() && !p.equals(root) && depth < MAX_DEPTH) {
        add(p);
        p = new DisplayObject_1.DisplayObject(p).parent;
        depth++;
      }
    }
    for (const e of entries) this.fillEntry(e, root);
    this.collectTextFieldsUnderPoint(entries, seen, add, root);
    entries.sort((a, b) => this.boundsArea(a) - this.boundsArea(b));
    return entries.slice(0, MAX_ENTRIES);
  }
  static fillEntry(entry, root) {
    const object = new DisplayObject_1.DisplayObject(entry.instance);
    entry.type = object.type ?? "?";
    entry.x = object.x;
    entry.y = object.y;
    entry.bounds = this.measureBounds(entry.instance, root);
    const parent = object.parent;
    entry.name = this.resolveName(parent.isNull() ? root : parent, entry.instance);
  }
  static collectTextFieldsUnderPoint(entries, seen, add, root) {
    let cx = NaN,
      cy = NaN,
      smallest = Infinity;
    for (const e of entries)
      if (e.bounds && this.boundsArea(e) < smallest) {
        smallest = this.boundsArea(e);
        cx = (e.bounds.left + e.bounds.right) / 2;
        cy = (e.bounds.top + e.bounds.bottom) / 2;
      }
    if (Number.isNaN(cx)) return;
    for (const parent of [...entries]) {
      if (entries.length >= MAX_ENTRIES) break;
      try {
        const display = new DisplayObject_1.DisplayObject(parent.instance);
        if (!display.isMovieClip()) continue;
        const clip = new MovieClip_1.MovieClip(parent.instance),
          count = clip.getChildCount(),
          array = clip.getChildArray();
        if (array.isNull() || count <= 0 || count > MAX_CHILDREN) continue;
        for (let i = 0; i < count; i++) {
          const p = array.add(i * Process.pointerSize).readPointer();
          if (p.isNull() || seen.has(p.toString())) continue;
          const obj = new DisplayObject_1.DisplayObject(p);
          if (!obj.isTextField()) continue;
          const bounds = this.measureBounds(p, root);
          if (
            !bounds ||
            cx < bounds.left ||
            cx > bounds.right ||
            cy < bounds.top ||
            cy > bounds.bottom
          )
            continue;
          const e = add(p);
          if (e) {
            e.type = "TextField";
            e.x = obj.x;
            e.y = obj.y;
            e.bounds = bounds;
            e.name = this.resolveName(parent.instance, p);
          }
        }
      } catch (_) {}
    }
  }
  static boundsArea(e) {
    return e.bounds
      ? (e.bounds.right - e.bounds.left) * (e.bounds.bottom - e.bounds.top)
      : Infinity;
  }
  static resolveName(parent, child) {
    try {
      if (new DisplayObject_1.DisplayObject(parent).isMovieClip()) {
        const n = new MovieClip_1.MovieClip(parent).getNameOfChild(
          new MovieClip_1.MovieClip(child),
        );
        if (n) return n;
      }
    } catch (_) {}
    try {
      if (new DisplayObject_1.DisplayObject(child).isMovieClip()) {
        const n = new MovieClip_1.MovieClip(child).exportName;
        if (n) return n;
      }
    } catch (_) {}
    return "";
  }
  static formatEntry(e) {
    const name = e.name || e.type || "?",
      position = "".concat(Math.round(e.x), ",", Math.round(e.y)),
      size = e.bounds
        ? " ".concat(
            Math.round(e.bounds.right - e.bounds.left),
            "x",
            Math.round(e.bounds.bottom - e.bounds.top),
          )
        : "";
    return "".concat(name, " [", e.type, "]", this.formatText(e), " @", position, size);
  }
  static formatText(e) {
    if (e.type !== "TextField") return "";
    try {
      const text = new TextField_1.TextField(e.instance).text;
      if (!text) return "";
      return ' ="'.concat(
        text.length > MAX_TEXT ? "".concat(text.slice(0, MAX_TEXT), "...") : text,
        '"',
      );
    } catch (_) {
      return "";
    }
  }
  static measureBounds(instance, root) {
    try {
      new DisplayObject_1.DisplayObject(instance).getBounds(root, this.rectBuffer);
      const b = this.readRectBuffer();
      return !Number.isFinite(b.left) || b.left >= 100000 || b.right <= b.left || b.bottom <= b.top
        ? null
        : b;
    } catch (_) {
      return null;
    }
  }
  static readRectBuffer() {
    return {
      left: this.rectBuffer.readFloat(),
      top: this.rectBuffer.add(4).readFloat(),
      right: this.rectBuffer.add(8).readFloat(),
      bottom: this.rectBuffer.add(12).readFloat(),
    };
  }
  static drawBox(index, b, color) {
    const strips = this.boxes[index].strips,
      w = b.right - b.left,
      h = b.bottom - b.top,
      t = Math.max(0.5, Math.min(1, w / 2, h / 2));
    this.placeStrip(strips[0], b.left, b.top, w, t, color);
    this.placeStrip(strips[1], b.left, b.bottom - t, w, t, color);
    this.placeStrip(strips[2], b.left, b.top, t, h, color);
    this.placeStrip(strips[3], b.right - t, b.top, t, h, color);
  }
  static placeStrip(strip, x, y, w, h, color) {
    ColorTransform_1.ColorTransform.setColor(strip.instance, color[0], color[1], color[2], ALPHA);
    const nw = this.stripNatural.right - this.stripNatural.left || 1,
      nh = this.stripNatural.bottom - this.stripNatural.top || 1,
      sx = Math.max(w, 0.5) / nw,
      sy = Math.max(h, 0.5) / nh;
    strip.scaleX = sx;
    strip.scaleY = sy;
    strip.setXY(x - this.stripNatural.left * sx, y - this.stripNatural.top * sy);
    strip.visibility = 1;
  }
  static hideBox(i) {
    for (const strip of this.boxes[i].strips) strip.visibility = 0;
  }
  static hideAll() {
    if (!this.initialized) return;
    for (let i = 0; i < BOXES; i++) this.hideBox(i);
    for (const label of this.labels) label.visibility = 0;
  }
  static bringToTop() {
    if (!this.initialized) return;
    for (const box of this.boxes)
      for (const strip of box.strips) {
        Stage_1.Stage.removeChild(strip.instance);
        Stage_1.Stage.addChild(strip.instance);
      }
    for (const label of this.labels) {
      Stage_1.Stage.removeChild(label.instance);
      Stage_1.Stage.addChild(label.instance);
    }
  }
  static ensureInitialized() {
    if (this.initialized) return;
    for (let i = 0; i < BOXES; i++) {
      const strips = [];
      for (let j = 0; j < STRIPS; j++) {
        const strip = StringTable_1.StringTable.getMovieClip("sc/ui.sc", "map_editor_ui_darkening");
        Stage_1.Stage.addChild(strip.instance);
        strip.visibility = 0;
        strips.push(strip);
      }
      this.boxes.push({ strips });
    }
    this.measureStripNatural();
    for (let i = 0; i < LABELS; i++) {
      const label = StringTable_1.StringTable.getMovieClip("sc/debug.sc", "debug_menu_text");
      Stage_1.Stage.addChild(label.instance);
      label.visibility = 0;
      this.labels.push(label);
    }
    this.initialized = true;
  }
  static measureStripNatural() {
    try {
      const root = Stage_1.Stage.getMainSprite();
      if (root.isNull()) return;
      const strip = this.boxes[0].strips[0];
      strip.scaleX = 1;
      strip.scaleY = 1;
      strip.setXY(0, 0);
      strip.getBounds(root, this.rectBuffer);
      const b = this.readRectBuffer();
      if (Number.isFinite(b.left) && b.left < 100000 && b.right > b.left && b.bottom > b.top)
        this.stripNatural = b;
    } catch (_) {}
  }
}
exports.UiInspector = UiInspector;
UiInspector.patched = false;
UiInspector.enabled = false;
UiInspector.initialized = false;
UiInspector.boxes = [];
UiInspector.labels = [];
UiInspector.rectBuffer = Libc_1.Libc.malloc(16);
UiInspector.stripNatural = { left: 0, top: 0, right: 1, bottom: 1 };
UiInspector.capturedLeaves = [];
UiInspector.captureSeq = 0;
UiInspector.renderedSeq = -1;