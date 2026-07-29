// @ts-nocheck
const { GameButton } = require("../../../../laser/client/game/gui/GameButton");
const { countryPopupListItemVtableAddr } = require("../ListContainerPopup");
const { StringTable } = require("../../../../laser/client/game/text/StringTable");
const { EDebugger } = require("../../../debug/EDebugger");
class ThemeItem extends GameButton {
  constructor(theme, selectedTheme) {
    super();
    this.instance.writePointer(countryPopupListItemVtableAddr);
    const movieClip = StringTable.getMovieClip("sc/ui.sc", "country_item");
    this.setMovieClip(movieClip.instance, true);
    this.themeId = theme.getInstanceID();
    this.id = this.themeId;
    const textField = movieClip.getTextFieldByName("Text");
    if (!textField) EDebugger.addMessage(EDebugger.ERROR, "Missing button TextField!");
    textField.colorTag = true;
    textField.setTextScaleIfNecessary(theme.getName());
    if (selectedTheme && !selectedTheme.instance.isNull())
      movieClip.gotoAndStopFrameIndex(+!selectedTheme.instance.equals(theme.instance));
    else movieClip.gotoAndStopFrameIndex(1);
  }
}
module.exports = { ThemeItem };
