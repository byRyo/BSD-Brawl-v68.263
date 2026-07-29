// @ts-nocheck
const { GUI } = require("../../laser/client/game/gui/GUI");
const { BrawlTvIntroPopup } = require("../../laser/client/game/gui/popup/BrawlTvIntroPopup");
class BrawlTvIntroPopupPreview {
  static show() {
    const popup = new BrawlTvIntroPopup();
    popup.addGameButton("ok_button", 0).setCustomButtonListener(() => popup.fadeOut());
    GUI.showPopup(popup.instance, true, false, true);
  }
}
exports.BrawlTvIntroPopupPreview = BrawlTvIntroPopupPreview;
