// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.FPSLimitPopup = void 0;
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
const { FramerateManager } = require("../../laser/titan/client/src/FramerateManager");
class FPSLimitPopup extends ListContainerPopup {
  constructor() {
    super({ Title: Localisation.getString("FPSLimitTitle") });
    this.maxValue = 145;
    if (Process.platform === "darwin") this.maxValue = 121;
    this.adjustPopupHeaderButtons("fps_limit");
    this.refreshItems();
    GUI.popupStorage.push(this);
  }
  refreshItems() {
    const slider = GameSliderComponent.createDefaultSlider("fps_limit");
    slider.setValueBounds(1, this.maxValue);
    slider.y = 200;
    slider.setValue(Config.config.FPSLimit === -1 ? this.maxValue : Config.config.FPSLimit);
    slider.setMaxValueLabel("∞");
    slider.setCurrentValueToTextField();
    this.slider = slider;
    const note = StringTable.getMovieClip("sc/ui.sc", "popover_text_left").getTextFieldByName(
      "text",
    );
    note.x = -110;
    note.y = 230;
    note.color = 4294967295;
    note.colorTag = true;
    note.fontOutline = true;
    note.align = 2;
    note.text = Localisation.getString("FPSLimitNote");
    const saveClip = StringTable.getMovieClip("sc/ui.sc", "player_name_color_entry");
    const save = new GameButton();
    save.setMovieClip(saveClip, true);
    save.setCustomButtonListener(this.saveButtonPressed.bind(this), "fps_limit_save_button");
    const saveLabel = saveClip.getTextFieldByName("label_txt");
    saveLabel.colorTag = true;
    saveLabel.setTextScaleIfNecessary(Localisation.getString("SaveButton"));
    saveClip.gotoAndStopFrameIndex(1);
    save.setXY(-110, 400);
    this.saveButton = save;
    const resetClip = StringTable.getMovieClip("sc/ui.sc", "player_name_color_entry");
    const reset = new GameButton();
    reset.setMovieClip(resetClip, true);
    reset.setCustomButtonListener(this.resetButtonPressed.bind(this), "fps_limit_reset_button");
    const resetLabel = resetClip.getTextFieldByName("label_txt");
    resetLabel.colorTag = true;
    resetLabel.setTextScaleIfNecessary(Localisation.getString("ResetButton"));
    resetClip.gotoAndStopFrameIndex(1);
    reset.setXY(110, 400);
    this.resetButton = reset;
    const clip = this.getMovieClip();
    clip.addChild(slider);
    clip.addChild(note);
    clip.addChild(save);
    clip.addChild(reset);
  }
  saveButtonPressed() {
    const value = this.slider.getValue();
    Config.config.FPSLimit = value === this.maxValue ? -1 : value;
    FileManager.updateConfigFile();
    if (Process.platform === "darwin") FramerateManager.setFrameRate(Config.config.FPSLimit);
    this.saveButton.setDisabledWithHUDPrint(true, Localisation.getString("FPSLimitAlreadySaved"));
  }
  resetButtonPressed() {
    Config.config.FPSLimit = -1;
    FileManager.updateConfigFile();
    this.slider.setValue(this.maxValue);
    this.slider.setCurrentValueToTextField();
    this.saveButton.setDisabledWithHUDPrint(true, Localisation.getString("FPSLimitAlreadySaved"));
    this.resetButton.setDisabledWithHUDPrint(true, Localisation.getString("FPSLimitAlreadyReset"));
    if (Process.platform === "darwin") FramerateManager.setFrameRate(Config.config.FPSLimit);
  }
  updateElements(time) {
    if (!this.slider) return;
    const oldValue = this.slider.getValue();
    this.slider.update(time);
    if (oldValue !== this.slider.getValue()) {
      this.saveButton.setDisabledWithHUDPrint(false, "");
      this.resetButton.setDisabledWithHUDPrint(false, "");
    }
  }
}
exports.FPSLimitPopup = FPSLimitPopup;
