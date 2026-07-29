// @ts-nocheck
const { GenericPopup } = require("../../../laser/titan/client/common/flash/GenericPopup");

class QuestionPopup extends GenericPopup {
  constructor(title = "", text = "", color) {
    super("popup_generic");
    const movieClip = this.getMovieClip();
    this.movieClip = movieClip;
    movieClip.getMovieClipByName("button_negative").visibility = false;
    movieClip.getMovieClipByName("button_no").visibility = false;
    movieClip.getMovieClipByName("button_yes").visibility = false;
    this.setTitleTid(title);
    this.textTextField = movieClip.getTextFieldByName("txt");
    this.textTextField.text = text;
    if (color !== undefined) this.textTextField.color = color;
    const okButton = this.addGameButton("button_ok", true);
    const okText = okButton.getMovieClip().getTextFieldByName("txt");
    if (okText) okText.text = "OK";
    okButton.setCustomButtonListener(this.closeButtonPressed.bind(this));
    this.closeButton = this.addGameButton("button_close", true);
    this.closeButton.setCustomButtonListener(this.closeButtonPressed.bind(this));
  }
}
module.exports = { QuestionPopup };
