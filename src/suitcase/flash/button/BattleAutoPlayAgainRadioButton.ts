// @ts-nocheck
const { RadioButton } = require("../../../laser/titan/client/common/flash/RadioButton");
const { StringTable } = require("../../../laser/client/game/text/StringTable");
const { Config } = require("../../config/Config");
const { FileManager } = require("../../filesystem/FileManager");
const { Localisation } = require("../../localisation/Localisation");
const { PlayerInfo } = require("../../../laser/client/game/friends/PlayerInfo");
const { TextFieldHelper } = require("../../../laser/titan/client/common/flash/TextFieldHelper");

class BattleAutoPlayAgainRadioButton extends RadioButton {
  constructor() {
    super(
      StringTable.getMovieClip("sc/ui.sc", "edit_controls_ui_screen_hud_top"),
      "locked_movement_controls_button",
    );
    this.buttonX = 32.5;
    this.buttonY = 105;
    this.buttonScale = 0.75;
    this.textChatYOffset = Config.config.BattleTextChat && PlayerInfo.isInGameroom ? 55 : 0;
    this.textFieldX = 54.5;
    this.textFieldY = 98.5;
    this.setCustomButtonListener(this.buttonPressed.bind(this), "auto_play_again_radiobutton");
    this.x = this.buttonX;
    this.y = this.buttonY + this.textChatYOffset;
    this.scale = this.buttonScale;
    this.setRadioButtonState(Config.config.AutoPlayAgain ? 1 : 2);
    this.textField = TextFieldHelper.createTextTextField();
    this.textField.text = Localisation.getString("AutoPlayAgain");
    this.textField.fontSize = 14;
    this.textField.color = 4294967295;
    this.textField.fontOutline = true;
    this.textField.x = this.textFieldX;
    this.textField.y = this.textFieldY + this.textChatYOffset;
  }

  buttonPressed() {
    Config.config.AutoPlayAgain = !Config.config.AutoPlayAgain;
    FileManager.updateConfigFile();
    this.nextState();
  }
}

module.exports = { BattleAutoPlayAgainRadioButton };
