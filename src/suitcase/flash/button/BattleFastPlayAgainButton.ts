// @ts-nocheck
const { GameButton } = require("../../../laser/client/game/gui/GameButton");
const { StringTable } = require("../../../laser/client/game/text/StringTable");
const { Localisation } = require("../../localisation/Localisation");
const { Stage } = require("../../../laser/titan/client/common/flash/Stage");
const { MessageManager } = require("../../../laser/client/game/network/MessageManager");
const {
  PlayAgainMessage,
} = require("../../../laser/client/game/network/messaging/message/PlayAgainMessage");
const { CombatHUD } = require("../../../laser/client/game/gui/CombatHUD");
const { GUI } = require("../../../laser/client/game/gui/GUI");

class BattleFastPlayAgainButton extends GameButton {
  constructor() {
    super();
    const movieClip = StringTable.getMovieClip("sc/ui.sc", "map_editor_big_exit_button");
    this.setMovieClip(movieClip, true);
    const textField = movieClip.getTextFieldByName("txt");
    textField.fontOutline = true;
    textField.setTextScaleIfNecessary(Localisation.getString("FastPlayAgain"));
    this.setCustomButtonListener(this.buttonPressed.bind(this), "fast_play_again_button");
    this.x = Stage.getMatrixX() - 60;
    this.y = 40;
    this.visibility = true;
    CombatHUD.fastPlayAgainButton = this;
  }
  buttonPressed() {
    MessageManager.sendMessage(new PlayAgainMessage(true));
    GUI.showFloaterTextAtDefaultPosition(Localisation.getString("WaitingForPlayAgain"));
  }
}
module.exports = { BattleFastPlayAgainButton };
