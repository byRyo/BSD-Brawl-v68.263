// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg"),
  { DropGUIContainer } = require("./DropGUIContainer"),
  { MovieClip } = require("./MovieClip"),
  { Libc } = require("../../../../../lib/Libc"),
  { StringTable } = require("../../../../client/game/text/StringTable"),
  { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory"),
  { StringObject } = require("../../native/StringObject");
const ctor = new NativeFunction(Libg.offset(6086716, 6059636), "void", [
    "pointer",
    "pointer",
    "pointer",
    "pointer",
    "int",
  ]),
  setText = new NativeFunction(Libg.offset(6087776, 6060408), "void", ["pointer"]),
  O = { value: 232, min: 236, max: 240, label: 264, bubble: 304, update: 53 * Process.pointerSize };
for (const k in O) O[k] = LogicMemory.offset(O[k]);
class GameSliderComponent extends DropGUIContainer {
  constructor(owner, bg, slider, bubble, flag = false) {
    const p = Libc.malloc(GameSliderComponent.allocationSize);
    ctor(p, bg.instance, slider.instance, bubble ? bubble.instance : NULL, +flag);
    super(p);
  }
  setValue(v) {
    this.instance.add(O.value).writeInt(v);
  }
  getValue() {
    return this.instance.add(O.value).readInt();
  }
  setCurrentValueToTextField() {
    setText(this.instance);
  }
  setMinValueBound(v) {
    this.instance.add(O.min).writeInt(v);
  }
  setMaxValueBound(v) {
    this.instance.add(O.max).writeInt(v);
  }
  setValueBounds(a, b) {
    this.setMinValueBound(a);
    this.setMaxValueBound(b);
  }
  setMaxValueLabel(v) {
    StringObject.create(v, this.instance.add(O.label));
  }
  setBubblePixelSnappedXY(x, y) {
    this.getBubble().setPixelSnappedXY(x, y);
  }
  setBubbleScale(v) {
    this.getBubble().scale = v;
  }
  getBubble() {
    return new MovieClip(this.instance.add(O.bubble).readPointer());
  }
  getMinValueBound() {
    return this.instance.add(O.min).readInt();
  }
  getMaxValueBound() {
    return this.instance.add(O.max).readInt();
  }
  update(delta) {
    return new NativeFunction(this.instance.readPointer().add(O.update).readPointer(), "int", [
      "pointer",
      "float",
    ])(this.instance, delta);
  }
  static createDefaultSlider(owner, bubble = true) {
    const root = StringTable.getMovieClip("sc/ui.sc", "age_gate_dialog"),
      bg = root.getMovieClipByName("slider_bg"),
      slider = root.getMovieClipByName("slider"),
      b = bubble ? root.getMovieClipByName("slider_bubble") : undefined;
    return new this(owner, bg, slider, b);
  }
  static createCompactSlider(owner) {
    const root = StringTable.getMovieClip("sc/ui.sc", "edit_controls_ui").getMovieClipByName(
        "slider_scale",
      ),
      bg = root.getMovieClipByName("slider_bg"),
      button = root.getMovieClipByName("slider_button");
    bg.x = bg.y = button.x = button.y = 0;
    const width = button.width,
      bounds = button.getChildByName("bounds"),
      actual = bounds ? bounds.width : width,
      slider = new this(owner, bg, button, undefined, true);
    if (bounds && width !== actual) {
      const d = (width - actual) / 2,
        p = slider.instance.add(LogicMemory.offset(312)).readPointer();
      p.writeFloat(p.readFloat() - d);
    }
    return slider;
  }
  store(key) {
    GameSliderComponent._sliderMap.set(this, key);
  }
}
GameSliderComponent.allocationSize = 376;
GameSliderComponent._sliderMap = new Map();
module.exports = { GameSliderComponent };
