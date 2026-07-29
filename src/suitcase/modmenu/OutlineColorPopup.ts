// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutlineColorPopup = void 0;
const { ListContainerPopup } = require("../flash/popup/ListContainerPopup");
const { Localisation } = require("../localisation/Localisation");
const {
  GameSliderComponent,
} = require("../../laser/titan/client/common/flash/GameSliderComponent");
const { Outline } = require("../../laser/client/game/renderer3d/Outline");
const { StringTable } = require("../../laser/client/game/text/StringTable");
const { LogicColor } = require("../logic/LogicColor");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { SimpleWebView } = require("../../laser/client/game/gui/SimpleWebView");
const { Config } = require("../config/Config");
const { FileManager } = require("../filesystem/FileManager");
class OutlineColorPopup extends ListContainerPopup {
  constructor() {
    super({ Title: Localisation.getString("OutlineColorPopupTitle") });
    this.tempOutlineColor = [];
    this.sliders = [];
    this.adjustPopupHeaderButtons("outline_settings");
    this.tempOutlineColor = Outline.outlineColor;
    const root = this.getMovieClip();
    [
      { currentValueOffset: 3, maxValue: 100, y: 150 },
      { currentValueOffset: 0, maxValue: 100, y: 250 },
      { currentValueOffset: 1, maxValue: 100, y: 350 },
      { currentValueOffset: 2, maxValue: 100, y: 450 },
    ].forEach((s) => {
      const slider = GameSliderComponent.createDefaultSlider(
        "outline" + s.currentValueOffset,
        false,
      );
      slider.x = -150;
      slider.y = s.y;
      slider.setValue(Outline.outlineColor[s.currentValueOffset]);
      slider.setValueBounds(0, s.maxValue);
      this.sliders.push(slider);
      root.addChild(slider);
    });
    const value = LogicColor.argbToIntString(Outline.outlineColor);
    const hex = StringTable.getMovieClip("sc/ui.sc", "popover_text_left").getTextFieldByName(
      "text",
    );
    hex.x = 140;
    hex.y = 130;
    hex.color = parseInt(value, 16);
    hex.fontOutline = true;
    hex.align = 2;
    hex.fontSize = 40;
    hex.text = "#" + value.substring(2);
    this.hexColorTextField = hex;
    const make = (fn, key, text, y) => {
      const clip = StringTable.getMovieClip("sc/ui.sc", "player_name_color_entry"),
        b = new GameButton();
      b.setMovieClip(clip, true);
      b.setCustomButtonListener(fn.bind(this), key);
      const l = clip.getTextFieldByName("label_txt");
      l.colorTag = true;
      l.setTextScaleIfNecessary(Localisation.getString(text));
      clip.gotoAndStopFrameIndex(1);
      b.setXY(250, y);
      root.addChild(b);
      return b;
    };
    this.saveButton = make(this.saveButtonPressed, "outline_save_button", "SaveButton", 350);
    this.resetButton = make(this.resetButtonPressed, "outline_reset_button", "ResetButton", 450);
    this.colorPickerButton = make(
      this.colorPickerButtonClicked,
      "outline_reset_button",
      "ColorPicker",
      250,
    );
    OutlineColorPopup.CAPTIONS.forEach((c) => {
      const f = StringTable.getMovieClip("sc/ui.sc", "popover_text_left").getTextFieldByName(
        "text",
      );
      f.setXY(-260, c.y);
      f.color = c.color;
      f.colorTag = true;
      f.fontOutline = true;
      f.align = 2;
      f.text = Localisation.getString(c.text);
      root.addChild(f);
    });
    root.addChild(hex);
    GUI.popupStorage.push(this);
  }
  saveButtonPressed() {
    Outline.outlineColor = this.tempOutlineColor.slice();
    Config.config.OutlineColor = Outline.outlineColor.slice();
    FileManager.updateConfigFile();
    this.saveButton.setDisabledWithHUDPrint(
      true,
      Localisation.getString("OutlineColorAlreadySaved"),
    );
  }
  resetButtonPressed() {
    Config.config.OutlineColor = Config.configStatic.OutlineColor.slice();
    Outline.outlineColor = Config.config.OutlineColor.slice();
    this.tempOutlineColor = Outline.outlineColor.slice();
    FileManager.updateConfigFile();
    this.sliders.forEach((s) => s.setValue(0));
    this.sliders[0].setValue(100);
    this.refreshHex();
    this.saveButton.setDisabledWithHUDPrint(
      true,
      Localisation.getString("OutlineColorAlreadySaved"),
    );
    this.resetButton.setDisabledWithHUDPrint(
      true,
      Localisation.getString("OutlineColorAlreadyReset"),
    );
  }
  refreshHex() {
    const value = LogicColor.argbToIntString(this.tempOutlineColor);
    this.hexColorTextField.color = parseInt(value, 16);
    this.hexColorTextField.text = "#" + value.substring(2);
  }
  colorPickerButtonClicked() {
    const web = SimpleWebView.create();
    web.setTitleTid(Localisation.getString("ColorPicker"));
    web.loadURL("https://bsd.meowfox.net/colorpicker");
    web.setDisallowModalTap(true);
    GUI.showPopup(web, false, true, true);
  }
  updateElements(time) {
    let i = 0;
    for (const slider of this.sliders) {
      if (!slider.isNull()) {
        const old = slider.getValue();
        slider.update(time);
        const value = slider.getValue();
        if (old !== value) {
          this.tempOutlineColor[OutlineColorPopup.offsetMappings[i]] = value;
          this.saveButton.setDisabledWithHUDPrint(false, "");
          this.resetButton.setDisabledWithHUDPrint(false, "");
          this.refreshHex();
        }
      }
      i = (i + 1) % this.tempOutlineColor.length;
    }
  }
}
OutlineColorPopup.CAPTIONS = [
  { text: "ColorAlpha", y: 180, color: 0 },
  { text: "ColorRed", y: 280, color: 4294901760 },
  { text: "ColorGreen", y: 380, color: 4278255360 },
  { text: "ColorBlue", y: 480, color: 4278190335 },
];
OutlineColorPopup.offsetMappings = [3, 0, 1, 2];
exports.OutlineColorPopup = OutlineColorPopup;
