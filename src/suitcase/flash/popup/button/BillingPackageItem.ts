// @ts-nocheck
const { GameButton } = require("../../../../laser/client/game/gui/GameButton");
const { countryPopupListItemVtableAddr } = require("../ListContainerPopup");
const { StringTable } = require("../../../../laser/client/game/text/StringTable");
class BillingPackageItem extends GameButton {
  constructor(text) {
    super();
    this.instance.writePointer(countryPopupListItemVtableAddr);
    const movieClip = StringTable.getMovieClip("sc/ui.sc", "country_item");
    this.setMovieClip(movieClip.instance, true);
    const textField = movieClip.getTextFieldByName("Text");
    textField.colorTag = true;
    textField.setTextScaleIfNecessary(text);
    movieClip.gotoAndStopFrameIndex(1);
  }
}
module.exports = { BillingPackageItem };
