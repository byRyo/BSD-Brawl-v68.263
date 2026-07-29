// @ts-nocheck
const { GameButton } = require("../../../../laser/client/game/gui/GameButton");
const { StringTable } = require("../../../../laser/client/game/text/StringTable");
const { countryPopupListItemVtableAddr } = require("../ListContainerPopup");
const RARITY_COLOR_DEFINITIONS = {
  RARE: "<c7aff6b>",
  SUPER_RARE: "<c8ccaff>",
  EPIC: "<ce297ff>",
  MYTHIC: "<cff9a9a>",
  LEGENDARY: "<cfdf01f>",
  HYPERCHARGE: "<cf800ff>",
  COLLECTORS: "<cf56c42>",
  DEFAULT: "<cffffff>",
};
class SkinItem extends GameButton {
  constructor(skin, selected = false) {
    super();
    this.instance.writePointer(countryPopupListItemVtableAddr);
    const movieClip = StringTable.getMovieClip("sc/ui.sc", "player_name_color_entry");
    this.setMovieClip(movieClip.instance, true);
    const color = SkinItem.getRarityColor(skin.getRarity());
    const name = StringTable.getString(skin.getTID());
    const textField = movieClip.getTextFieldByName("label_txt");
    textField.colorTag = true;
    textField.setTextScaleIfNecessary(color + name.replace("\n", " ") + "</c>");
    movieClip.gotoAndStopFrameIndex(+!selected);
  }
  static getRarityColor(rarity) {
    return RARITY_COLOR_DEFINITIONS[rarity] ?? RARITY_COLOR_DEFINITIONS.DEFAULT;
  }
}
SkinItem.RARITY_COLOR_DEFINITIONS = RARITY_COLOR_DEFINITIONS;
module.exports = { SkinItem };
