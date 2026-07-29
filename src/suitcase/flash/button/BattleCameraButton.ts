// @ts-nocheck
const { GameButton } = require("../../../laser/client/game/gui/GameButton");
const { StringTable } = require("../../../laser/client/game/text/StringTable");
const { MovieClip } = require("../../../laser/titan/client/common/flash/MovieClip");
const { Localisation } = require("../../localisation/Localisation");
const { BattleCamera } = require("../../feature/BattleCamera");

class BattleCameraButton extends GameButton {
  constructor() {
    super();
    const movieClip = StringTable.getMovieClip("sc/ui.sc", "map_editor_big_exit_button");
    this.setMovieClip(movieClip.instance, true);
    const textField = MovieClip.getTextFieldByName(movieClip.instance, "txt");
    textField.fontOutline = true;
    textField.setTextScaleIfNecessary(Localisation.getString("CameraModesButton"));
    this.setXY(60, 60);
    this.setCustomButtonListener(this.buttonClicked.bind(this), "battle_camera_button");
  }
  buttonClicked() {
    BattleCamera.setNextMode();
  }
}
module.exports = { BattleCameraButton };
