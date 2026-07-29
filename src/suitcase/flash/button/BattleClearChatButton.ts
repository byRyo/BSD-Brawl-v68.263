// @ts-nocheck
const { GameButton } = require("../../../laser/client/game/gui/GameButton");
const { StringTable } = require("../../../laser/client/game/text/StringTable");
const { MovieClip } = require("../../../laser/titan/client/common/flash/MovieClip");
const { Localisation } = require("../../localisation/Localisation");

class BattleClearChatButton extends GameButton {
  constructor(battleChat) {
    super();
    this.X = 150;
    this.Y = 115;
    this.battleChat = battleChat;
    const movieClip = StringTable.getMovieClip("sc/ui.sc", "map_editor_big_exit_button");
    this.setMovieClip(movieClip.instance, true);
    const textField = MovieClip.getTextFieldByName(movieClip.instance, "txt");
    textField.colorTag = true;
    textField.setTextScaleIfNecessary(Localisation.getString("BattleChatClearButton"));
    this.setXY(this.X, this.Y);
    this.setCustomButtonListener(this.buttonPressed.bind(this), "battle_chat_clear_button");
  }
  buttonPressed() {
    this.battleChat.clear();
  }
}
module.exports = { BattleClearChatButton };
