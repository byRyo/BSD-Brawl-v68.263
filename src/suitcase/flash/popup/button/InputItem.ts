// @ts-nocheck
const { GameButton } = require("../../../../laser/client/game/gui/GameButton");
const { countryPopupListItemVtableAddr } = require("../ListContainerPopup");
const { StringTable } = require("../../../../laser/client/game/text/StringTable");
const { Localisation } = require("../../../localisation/Localisation");
class InputItem extends GameButton {
  constructor(item) {
    super();
    this.instance.writePointer(countryPopupListItemVtableAddr);
    const movieClip = StringTable.getMovieClip("sc/ui.sc", "country_item");
    this.setMovieClip(movieClip.instance, true);
    const textField = movieClip.getTextFieldByName("Text");
    textField.colorTag = true;
    textField.setTextScaleIfNecessary(Localisation.getString(item.name));
    movieClip.gotoAndStopFrameIndex(1);
    this.id = item.id;
  }
}
module.exports = { InputItem };
