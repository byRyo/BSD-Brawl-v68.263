// @ts-nocheck
const { GameButton } = require("../../../../laser/client/game/gui/GameButton");
const { countryPopupListItemVtableAddr } = require("../ListContainerPopup");
const { StringTable } = require("../../../../laser/client/game/text/StringTable");
const { MovieClip } = require("../../../../laser/titan/client/common/flash/MovieClip");
class StatusItem extends GameButton {
  constructor(id) {
    super();
    this.instance.writePointer(countryPopupListItemVtableAddr);
    const movieClip = StringTable.getMovieClip("sc/ui.sc", "country_item");
    this.setMovieClip(movieClip.instance, true);
    const textField = MovieClip.getTextFieldByName(movieClip.instance, "Text");
    const statusName = this.getStatusName(id);
    this.id = id;
    textField.colorTag = true;
    textField.setTextScaleIfNecessary(StringTable.getString(statusName));
    movieClip.gotoAndStopFrameIndex(1);
  }
  getStatusName(id) {
    if (id === -1) return "TID_EDIT_REVERT";
    if (id === 12) return "TID_TEAM_MEMBER_STATUS_NEW_".concat(id);
    return "TID_TEAM_MEMBER_STATUS_".concat(id);
  }
}
module.exports = { StatusItem };
