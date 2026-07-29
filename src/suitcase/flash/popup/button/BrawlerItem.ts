// @ts-nocheck
const { GameButton } = require("../../../../laser/client/game/gui/GameButton");
const { countryPopupListItemVtableAddr } = require("../ListContainerPopup");
const { StringTable } = require("../../../../laser/client/game/text/StringTable");
const { MovieClip } = require("../../../../laser/titan/client/common/flash/MovieClip");
class BrawlerItem extends GameButton {
  constructor(data) {
    super();
    this.instance.writePointer(countryPopupListItemVtableAddr);
    const movieClip = StringTable.getMovieClip("sc/ui.sc", "player_name_color_entry");
    this.setMovieClip(movieClip.instance, true);
    const textField = MovieClip.getTextFieldByName(movieClip.instance, "label_txt");
    textField.colorTag = true;
    textField.setTextScaleIfNecessary(StringTable.getString(data.getTID()));
    this.id = data.getInstanceID();
    movieClip.gotoAndStopFrameIndex(1);
  }
}
module.exports = { BrawlerItem };
