// @ts-nocheck
const { GameButton } = require("../../../../laser/client/game/gui/GameButton");
const { countryPopupListItemVtableAddr } = require("../ListContainerPopup");
const { StringTable } = require("../../../../laser/client/game/text/StringTable");
class NoMusicItem extends GameButton {
  constructor(id, text, selected) {
    super();
    this.instance.writePointer(countryPopupListItemVtableAddr);
    const movieClip = StringTable.getMovieClip("sc/ui.sc", "country_item");
    this.setMovieClip(movieClip.instance, true);
    this.id = id;
    const textField = movieClip.getTextFieldByName("Text");
    if (textField) {
      textField.colorTag = true;
      textField.setTextScaleIfNecessary(text);
    }
    movieClip.gotoAndStopFrameIndex(selected ? 0 : 1);
  }
}
module.exports = { NoMusicItem };
