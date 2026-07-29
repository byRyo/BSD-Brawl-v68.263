// @ts-nocheck
const { countryPopupListItemVtableAddr } = require("../ListContainerPopup");
const { StringTable } = require("../../../../laser/client/game/text/StringTable");
const { MovieClip } = require("../../../../laser/titan/client/common/flash/MovieClip");
const { GameButton } = require("../../../../laser/client/game/gui/GameButton");
const { Localisation } = require("../../../localisation/Localisation");
class KillEffectTypeItem extends GameButton {
  constructor(item) {
    super();
    this.instance.writePointer(countryPopupListItemVtableAddr);
    const movieClip = StringTable.getMovieClip("sc/ui.sc", "country_item");
    this.setMovieClip(movieClip.instance, true);
    const textField = MovieClip.getTextFieldByName(movieClip.instance, "Text");
    textField.colorTag = true;
    textField.setTextScaleIfNecessary(Localisation.getString(item.name));
    movieClip.gotoAndStopFrameIndex(1);
  }
}
module.exports = { KillEffectTypeItem };
