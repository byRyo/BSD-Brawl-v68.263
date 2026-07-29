// @ts-nocheck
const { GameButton } = require("../../../../laser/client/game/gui/GameButton");
const { countryPopupListItemVtableAddr } = require("../ListContainerPopup");
const { StringTable } = require("../../../../laser/client/game/text/StringTable");
const { EDebugger } = require("../../../debug/EDebugger");
const { Localisation } = require("../../../localisation/Localisation");
class LocationThemeItem extends GameButton {
  constructor(theme, selectedTheme) {
    super();
    this.instance.writePointer(countryPopupListItemVtableAddr);
    const movieClip = StringTable.getMovieClip("sc/ui.sc", "country_item");
    this.setMovieClip(movieClip.instance, true);
    const textField = movieClip.getTextFieldByName("Text");
    if (textField) {
      textField.colorTag = true;
      textField.setTextScaleIfNecessary(Localisation.getString(theme.getName()));
      movieClip.gotoAndStopFrameIndex(+(selectedTheme.getGlobalID() !== theme.getGlobalID()));
    } else EDebugger.addMessage(EDebugger.ERROR, "Missing button TextField!");
  }
}
module.exports = { LocationThemeItem };
