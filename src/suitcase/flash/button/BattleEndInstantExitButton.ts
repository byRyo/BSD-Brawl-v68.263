// @ts-nocheck
const { GameButton } = require("../../../laser/client/game/gui/GameButton");
const { StringTable } = require("../../../laser/client/game/text/StringTable");
const { Localisation } = require("../../localisation/Localisation");
const { Stage } = require("../../../laser/titan/client/common/flash/Stage");
const { BattleEndPopup } = require("../../../laser/client/game/gui/popup/BattleEndPopup");

class BattleEndInstantExitButton extends GameButton {
  constructor() {
    super();
    const movieClip = StringTable.getMovieClip(
      "sc/ui.sc",
      "battle_end_bottom_right",
    ).getMovieClipByName("ok_button");
    this.setMovieClip(movieClip, true);
    this.setText("txt", Localisation.getString("BattleEndInstantExitButton"));
    this.scale = 1;
    const x = Stage.getMatrixX();
    const y = this.height + this.height / 2.5;
    this.setXY(x, y);
    this.setCustomButtonListener(this.buttonPressed.bind(this));
  }
  buttonPressed() {
    BattleEndPopup.proceedToNextState(true);
    BattleEndPopup.proceedToNextState(true);
  }
}
module.exports = { BattleEndInstantExitButton };
