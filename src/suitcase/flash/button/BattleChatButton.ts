// @ts-nocheck
const { LogicMemory } = require("../../logic/LogicMemory");
const { GameButton } = require("../../../laser/client/game/gui/GameButton");
const { StringTable } = require("../../../laser/client/game/text/StringTable");
const { MovieClip } = require("../../../laser/titan/client/common/flash/MovieClip");
const { Localisation } = require("../../localisation/Localisation");
const { TeamStream } = require("../../../laser/client/game/stream/TeamStream");
const battleChatOffset = LogicMemory.offset(40);

class BattleChatButton extends GameButton {
  constructor() {
    super();
    this.X = 60;
    this.Y = 115;
    const movieClip = StringTable.getMovieClip("sc/ui.sc", "map_editor_big_exit_button");
    this.setMovieClip(movieClip.instance, true);
    const textField = MovieClip.getTextFieldByName(movieClip.instance, "txt");
    textField.fontOutline = true;
    textField.setTextScaleIfNecessary(Localisation.getString("BattleChatButton"));
    this.setXY(this.X, this.Y);
    this.setCustomButtonListener(this.buttonPressed.bind(this), "battle_chat_button");
  }
  buttonPressed() {
    TeamStream.buttonClicked(battleChatOffset);
  }
}
module.exports = { BattleChatButton };
