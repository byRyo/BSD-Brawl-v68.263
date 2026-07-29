// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticleParametersPopup = void 0;
const { ListContainerPopup } = require("../flash/popup/ListContainerPopup");
const { Localisation } = require("../localisation/Localisation");
const {
  GameSliderComponent,
} = require("../../laser/titan/client/common/flash/GameSliderComponent");
const { Config } = require("../config/Config");
const { FileManager } = require("../filesystem/FileManager");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { StringTable } = require("../../laser/client/game/text/StringTable");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { LogicColor } = require("../logic/LogicColor");
const { GameMain } = require("../../laser/client/GameMain");
const { ParticleAnimationRadioButton } = require("../flash/button/ParticleAnimationRadioButton");
const { ParticleSelectorPopup } = require("./ParticleSelector");
class ParticleParametersPopup extends ListContainerPopup {
  constructor() {
    super({ Title: Localisation.getString("ParticleParametersPopup") });
    this.sliders = [];
    this.adjustPopupHeaderButtons("particle_parameters_popup");
    this.refreshItems();
    GUI.popupStorage.push(this);
  }
  refreshItems() {
    const specs = [
      {
        name: "scale",
        minValue: 1,
        maxValue: 1000,
        currentValue: Config.config.ParticleScale,
        y: 150,
      },
      {
        name: "speed",
        minValue: 0,
        maxValue: 10000,
        currentValue: Config.config.ParticleSpeed,
        y: 250,
      },
      {
        name: "count",
        minValue: 1,
        maxValue: 10000,
        currentValue: Config.config.ParticleCount,
        y: 350,
      },
    ];
    const root = this.getMovieClip();
    for (const spec of specs) {
      const slider = GameSliderComponent.createDefaultSlider(
        "particle_parameters_" + spec.name,
        false,
      );
      slider.x = 0;
      slider.y = spec.y;
      slider.setValue(spec.currentValue);
      slider.setValueBounds(spec.minValue, spec.maxValue);
      this.sliders.push(slider);
      root.addChild(slider);
    }
    const fields = specs.map((spec) => {
      const field = StringTable.getMovieClip("sc/ui.sc", "popover_text_left").getTextFieldByName(
        "text",
      );
      field.x = -110;
      field.y = spec.y - 60;
      field.color = 4294967295;
      field.colorTag = true;
      field.fontOutline = true;
      field.align = 2;
      root.addChild(field);
      return field;
    });
    [this.scaleTextField, this.speedTextField, this.countTextField] = fields;
    this.updateTextField();
    const makeButton = (listener, name, text, x) => {
      const clip = StringTable.getMovieClip("sc/ui.sc", "player_name_color_entry");
      const button = new GameButton();
      button.setMovieClip(clip, true);
      button.setCustomButtonListener(listener.bind(this), name);
      const label = clip.getTextFieldByName("label_txt");
      label.colorTag = true;
      label.setTextScaleIfNecessary(Localisation.getString(text));
      clip.gotoAndStopFrameIndex(1);
      button.setXY(x, 500);
      root.addChild(button);
      return button;
    };
    this.saveButton = makeButton(
      this.saveButtonPressed,
      "particle_parameters_save_button",
      "SaveButton",
      -110,
    );
    this.resetButton = makeButton(
      this.resetButtonPressed,
      "particle_parameters_reset_button",
      "ResetButton",
      110,
    );
    const radio = new ParticleAnimationRadioButton();
    radio.x = -100;
    radio.y = 425;
    radio.textField.scale = 1;
    root.addChild(radio);
    root.addChild(radio.textField);
  }
  saveButtonPressed() {
    Config.config.ParticleScale = this.sliders[0].getValue();
    Config.config.ParticleSpeed = this.sliders[1].getValue();
    Config.config.ParticleCount = this.sliders[2].getValue();
    FileManager.updateConfigFile();
    this.saveButton.setDisabledWithHUDPrint(
      true,
      Localisation.getString("ParticleParametersAlreadySaved"),
    );
    if (ParticleSelectorPopup.needsReload) GameMain.reloadGame();
    ParticleSelectorPopup.needsReload = false;
  }
  resetButtonPressed() {
    this.sliders[0].setValue(100);
    this.sliders[1].setValue(100);
    this.sliders[2].setValue(200);
    Config.config.ParticleScale = this.sliders[0].getValue();
    Config.config.ParticleSpeed = this.sliders[1].getValue();
    Config.config.ParticleCount = this.sliders[2].getValue();
    FileManager.updateConfigFile();
    this.saveButton.setDisabledWithHUDPrint(
      true,
      Localisation.getString("ParticleParametersAlreadySaved"),
    );
    this.resetButton.setDisabledWithHUDPrint(
      true,
      Localisation.getString("ParticleParametersAlreadyReset"),
    );
  }
  updateTextField() {
    this.scaleTextField.text = "".concat(
      Localisation.getString("ScaleParticleText"),
      ": ",
      this.getFormattedSize(),
    );
    this.speedTextField.text = "".concat(
      Localisation.getString("SpeedParticleText"),
      ": ",
      this.getFormattedSpeed(),
    );
    this.countTextField.text = "".concat(
      Localisation.getString("CountParticleText"),
      ": ",
      this.getFormattedCount(),
    );
  }
  updateElements(time) {
    if (!this.sliders[0]) return;
    const before = this.sliders.map((s) => s.getValue());
    this.sliders.forEach((s) => s.update(time));
    const after = this.sliders.map((s) => s.getValue());
    this.updateTextField();
    if (!before.every((v, i) => v === after[i])) {
      this.saveButton.setDisabledWithHUDPrint(false, "");
      this.resetButton.setDisabledWithHUDPrint(false, "");
      if (before[2] !== after[2]) ParticleSelectorPopup.needsReload = true;
    }
  }
  getFormattedSize() {
    const value = this.sliders[0].getValue() / 100;
    return value > 1 ? value.toFixed(1) : value;
  }
  getFormattedSpeed() {
    const value = this.sliders[1].getValue() / 100;
    return value > 1 ? Math.round(value) : value;
  }
  getFormattedCount() {
    const value = this.sliders[2].getValue();
    this.countTextField.color = this.getGradientColorForValue(value);
    return value;
  }
  getGradientColorForValue(value, alpha = 255) {
    const v = Math.max(0, Math.min(10000, value));
    let color;
    if (v < 2400) color = 16777215;
    else if (v <= 2500) color = LogicColor.lerpColor(16777215, 10145074, (v - 2400) / 100);
    else if (v <= 5000) color = LogicColor.lerpColor(10145074, 16776960, (v - 2500) / 2500);
    else if (v <= 8000) color = LogicColor.lerpColor(16776960, 16711680, (v - 5000) / 3000);
    else color = 16711680;
    return (((alpha & 255) << 24) | (color & 16777215)) >>> 0;
  }
}
exports.ParticleParametersPopup = ParticleParametersPopup;
