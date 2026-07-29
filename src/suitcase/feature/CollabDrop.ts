// @ts-nocheck
const { GenericPopup } = require("../../laser/titan/client/common/flash/GenericPopup");
const { Localisation } = require("../localisation/Localisation");
class CollabDropPopup extends GenericPopup {
  constructor(text, title = Localisation.getString("CollabDropPopupTitle")) {
    super("popup_generic");
    const movieClip = this.getMovieClip();
    this.movieClip = movieClip;
    for (const name of ["button_negative", "button_ok", "button_no", "button_yes"])
      movieClip.getMovieClipByName(name).visibility = false;
    this.setTitleTid(title);
    this.textTextField = movieClip.getTextFieldByName("txt");
    this.textTextField.text = text;
    this.textTextField.shiftY(-30);
    this.textTextField.fontSize = 11;
    this.closeButton = this.addGameButton("button_close", 1);
    this.closeButton.setCustomButtonListener(this.closeButtonPressed.bind(this));
  }
}
exports.CollabDropPopup = CollabDropPopup;
