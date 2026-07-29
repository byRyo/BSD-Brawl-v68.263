// @ts-nocheck
const { GameButton } = require("../../../../laser/client/game/gui/GameButton");
const { countryPopupListItemVtableAddr } = require("../ListContainerPopup");
const { StringTable } = require("../../../../laser/client/game/text/StringTable");
class BattleSeverItem extends GameButton {
  constructor(server) {
    super();
    this.instance.writePointer(countryPopupListItemVtableAddr);
    const movieClip = StringTable.getMovieClip("sc/ui.sc", "country_item");
    this.setMovieClip(movieClip.instance, true);
    const text =
      server.regionId === -1 || server.ping === 1
        ? server.name
        : `${server.name} (${server.ping.toString()} ms)`;
    const textField = movieClip.getTextFieldByName("Text");
    textField.colorTag = true;
    textField.setTextScaleIfNecessary(text);
    movieClip.gotoAndStopFrameIndex(+!server.isBest);
  }
}
module.exports = { BattleSeverItem };
