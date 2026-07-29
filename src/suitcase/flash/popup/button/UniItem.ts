// @ts-nocheck
const { GameButton } = require("../../../../laser/client/game/gui/GameButton");
const { StringTable } = require("../../../../laser/client/game/text/StringTable");
const { Localisation } = require("../../../localisation/Localisation");
const { countryPopupListItemVtableAddr } = require("../ListContainerPopup");
class UniItem extends GameButton {
  constructor(name, stateCallback) {
    super();
    this.instance.writePointer(countryPopupListItemVtableAddr);
    const movieClip = StringTable.getMovieClip("sc/ui.sc", "country_item");
    this.setMovieClip(movieClip.instance, true);
    const textField = movieClip.getTextFieldByName("Text");
    textField.colorTag = true;
    textField.setTextScaleIfNecessary(Localisation.getString(name));
    movieClip.gotoAndStopFrameIndex(stateCallback ? +!stateCallback() : 1);
  }
  setText(text) {
    this.getMovieClip().getTextFieldByName("Text").setTextScaleIfNecessary(text);
  }
}
module.exports = { UniItem };
