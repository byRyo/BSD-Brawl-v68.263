// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraSettingsPopup = void 0;
const { GenericPopup } = require("../../laser/titan/client/common/flash/GenericPopup");
const { Localisation } = require("../localisation/Localisation");
const {
  GameSliderComponent,
} = require("../../laser/titan/client/common/flash/GameSliderComponent");
const { StringTable } = require("../../laser/client/game/text/StringTable");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { BattleCamera } = require("../feature/BattleCamera");
const ZOOM_SCALE = 100,
  SLIDER_X = 45,
  SLIDER_SPACING = 130,
  LABEL_X = -255,
  LABEL_Y_OFFSET = -25,
  START_Y_OFFSET = -15,
  DOUBLE_TAP_MS = 200;
class CameraSettingsPopup extends GenericPopup {
  constructor() {
    super("popup_generic");
    this.sliders = [];
    this.labels = [];
    this.tapStates = [];
    CameraSettingsPopup.openInstance = this;
    this.setTitleTid(Localisation.getString("CameraSettingsPopupTitle"));
    const root = this.getMovieClip();
    ["button_negative", "button_no", "button_yes", "button_ok"].forEach(
      (n) => (root.getMovieClipByName(n).visibility = false),
    );
    const txt = root.getTextFieldByName("txt");
    const y = txt.y;
    txt.visibility = false;
    this.createCloseButton();
    this.createSliders(y);
    this.refreshLabels();
  }
  createCloseButton() {
    this.addGameButton("button_close", true).setCustomButtonListener(
      this.closeButtonPressed.bind(this),
    );
  }
  createSliders(y) {
    const root = this.getMovieClip();
    let start =
      y - ((CameraSettingsPopup.SLIDER_SPECS.length - 1) * SLIDER_SPACING) / 2 + START_Y_OFFSET;
    CameraSettingsPopup.SLIDER_SPECS.forEach((spec, i) => {
      const slider = GameSliderComponent.createCompactSlider("camera_settings_" + spec.key);
      slider.x = SLIDER_X;
      slider.y = start + i * SLIDER_SPACING;
      slider.setValueBounds(spec.minValue, spec.maxValue);
      slider.setValue(this.readSliderValue(spec));
      this.sliders.push(slider);
      this.tapStates.push({ lastTapStartTime: 0, wasPressed: false });
      root.addChild(slider);
      const label = StringTable.getMovieClip("sc/ui.sc", "popover_text_left").getTextFieldByName(
        "text",
      );
      label.x = LABEL_X;
      label.y = slider.y + LABEL_Y_OFFSET;
      label.color = 4294967295;
      label.colorTag = true;
      label.fontOutline = true;
      label.fontSize = 22;
      label.align = 2;
      this.labels.push(label);
      root.addChild(label);
    });
  }
  refreshLabels() {
    CameraSettingsPopup.SLIDER_SPECS.forEach((spec, i) => {
      const value = this.sliders[i].getValue();
      this.labels[i].text = "".concat(
        Localisation.getString(spec.labelKey),
        ": ",
        this.formatValue(spec, value),
      );
    });
  }
  resetSlider(i) {
    const spec = CameraSettingsPopup.SLIDER_SPECS[i],
      slider = this.sliders[i];
    slider.setValue(spec.defaultValue);
    slider.instance.add(320).writeU8(0);
    this.applySliderValue(spec, spec.defaultValue);
  }
  formatValue(spec, value) {
    return spec.key === "zoom" ? (value / ZOOM_SCALE).toFixed(2) + "x" : value.toString();
  }
  readSliderValue(spec) {
    switch (spec.key) {
      case "zoom":
        return Math.round(BattleCamera.zoomMultiplier * ZOOM_SCALE);
      case "cameraX":
        return BattleCamera.cameraXOffset;
      case "cameraY":
        return BattleCamera.cameraYOffset;
      case "cameraZ":
        return BattleCamera.cameraZOffset;
      case "tilt":
        return BattleCamera.tiltOffset;
    }
  }
  applySliderValue(spec, value) {
    switch (spec.key) {
      case "zoom":
        BattleCamera.zoomMultiplier = value / ZOOM_SCALE;
        break;
      case "cameraX":
        BattleCamera.cameraXOffset = value;
        break;
      case "cameraY":
        BattleCamera.cameraYOffset = value;
        break;
      case "cameraZ":
        BattleCamera.cameraZOffset = value;
        break;
      case "tilt":
        BattleCamera.tiltOffset = value;
    }
  }
  updateElements(time) {
    let changed = false,
      now = Date.now();
    CameraSettingsPopup.SLIDER_SPECS.forEach((spec, i) => {
      const slider = this.sliders[i];
      if (slider.isNull()) return;
      const state = this.tapStates[i];
      const pressed = !!(1 & slider.instance.add(320).readU8());
      const justPressed = pressed && !state.wasPressed;
      state.wasPressed = pressed;
      if (justPressed) {
        if (state.lastTapStartTime > 0 && now - state.lastTapStartTime < DOUBLE_TAP_MS) {
          this.resetSlider(i);
          state.lastTapStartTime = 0;
          changed = true;
          return;
        }
        state.lastTapStartTime = now;
      }
      const old = slider.getValue();
      slider.update(time);
      const value = slider.getValue();
      if (old !== value) {
        this.applySliderValue(spec, value);
        changed = true;
      }
    });
    if (changed) this.refreshLabels();
  }
  closeButtonPressed(a, b) {
    if (CameraSettingsPopup.openInstance === this) CameraSettingsPopup.openInstance = null;
    super.closeButtonPressed(a, b);
  }
  onDestructed() {
    if (CameraSettingsPopup.openInstance === this) CameraSettingsPopup.openInstance = null;
  }
  syncSlidersFromBattleCamera() {
    CameraSettingsPopup.SLIDER_SPECS.forEach((spec, i) => {
      const s = this.sliders[i];
      if (!s.isNull()) {
        s.setValue(this.readSliderValue(spec));
        s.instance.add(320).writeU8(0);
      }
    });
    this.refreshLabels();
  }
  static show() {
    GUI.showPopup(new CameraSettingsPopup(), true, false, false);
  }
  static resetAll() {
    BattleCamera.reset();
    const popup = this.openInstance;
    if (popup && !popup.instance.isNull()) popup.syncSlidersFromBattleCamera();
  }
}
CameraSettingsPopup.SLIDER_SPECS = [
  { key: "zoom", labelKey: "CameraSettingsZoom", minValue: 0, maxValue: 200, defaultValue: 100 },
  {
    key: "cameraZ",
    labelKey: "CameraSettingsHeight",
    minValue: -10000,
    maxValue: 10000,
    defaultValue: 0,
  },
  {
    key: "cameraX",
    labelKey: "CameraSettingsPanX",
    minValue: -10000,
    maxValue: 10000,
    defaultValue: 0,
  },
  {
    key: "cameraY",
    labelKey: "CameraSettingsPanY",
    minValue: -10000,
    maxValue: 10000,
    defaultValue: 0,
  },
  {
    key: "tilt",
    labelKey: "CameraSettingsTilt",
    minValue: -10000,
    maxValue: 10000,
    defaultValue: 0,
  },
];
CameraSettingsPopup.openInstance = null;
exports.CameraSettingsPopup = CameraSettingsPopup;
