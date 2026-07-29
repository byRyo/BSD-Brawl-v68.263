// @ts-nocheck
const { GameButton } = require("../../../../laser/client/game/gui/GameButton");
const { countryPopupListItemVtableAddr } = require("../ListContainerPopup");
const { StringTable } = require("../../../../laser/client/game/text/StringTable");
const { Localisation } = require("../../../localisation/Localisation");
const { Config } = require("../../../config/Config");
const { FontManager } = require("../../../../laser/titan/client/common/font/FontManager");
class FontItem extends GameButton {
  constructor(item) {
    super();
    this.name = "";
    this.disabled = false;
    this.instance.writePointer(countryPopupListItemVtableAddr);
    const movieClip = StringTable.getMovieClip("sc/ui.sc", "country_item");
    this.setMovieClip(movieClip.instance, true);
    const textField = movieClip.getTextFieldByName("Text");
    textField.colorTag = true;
    textField.setTextScaleIfNecessary(Localisation.getString(item.localeName));
    this.name = item.name ?? "";
    const selected =
      Config.config.Font !== -1 && item.name === FontManager.BSD_FONTS[Config.config.Font].name;
    movieClip.gotoAndStopFrameIndex(+!selected);
  }
}
module.exports = { FontItem };
