// @ts-nocheck
const { RadioButton } = require("../../../laser/titan/client/common/flash/RadioButton");
const { StringTable } = require("../../../laser/client/game/text/StringTable");
const { Config } = require("../../config/Config");
const { FileManager } = require("../../filesystem/FileManager");
const { Localisation } = require("../../localisation/Localisation");
const { TextFieldHelper } = require("../../../laser/titan/client/common/flash/TextFieldHelper");

class ParticleAnimationRadioButton extends RadioButton {
  constructor() {
    super(
      StringTable.getMovieClip("sc/ui.sc", "edit_controls_ui_screen_hud_top"),
      "locked_movement_controls_button",
    );
    this.buttonScale = 0.75;
    this.textFieldX = -100;
    this.textFieldY = 100;
    this.setCustomButtonListener(
      this.buttonPressed.bind(this),
      "disable_particle_animation_radiobutton",
    );
    this.scale = this.buttonScale;
    this.setRadioButtonState(Config.config.ParticleAnimationDisabled ? 1 : 2);
    this.textField = TextFieldHelper.createTextTextField();
    this.textField.text = Localisation.getString("DisableParticleAnimation");
    this.textField.fontSize = 18;
    this.textField.color = 4294967295;
    this.textField.fontOutline = true;
    this.textField.x = -77.5;
    this.textField.y = 414.25;
  }
  buttonPressed() {
    Config.config.ParticleAnimationDisabled = !Config.config.ParticleAnimationDisabled;
    FileManager.updateConfigFile();
    this.nextState();
  }
}
module.exports = { ParticleAnimationRadioButton };
