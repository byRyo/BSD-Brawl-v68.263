// @ts-nocheck
const { StringTable } = require("../../../../client/game/text/StringTable");
const { MovieClip } = require("./MovieClip");
class TextFieldHelper {
  static createTextTextField() {
    const clip = StringTable.getMovieClip("sc/ui.sc", "popover_text_left");
    return MovieClip.getTextFieldByName(clip.instance, "text");
  }
}
module.exports = { TextFieldHelper };
