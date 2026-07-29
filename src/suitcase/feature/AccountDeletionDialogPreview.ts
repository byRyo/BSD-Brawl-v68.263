// @ts-nocheck
const { GUI } = require("../../laser/client/game/gui/GUI");
const { StringTable } = require("../../laser/client/game/text/StringTable");
const { GenericPopup } = require("../../laser/titan/client/common/flash/GenericPopup");

const TIME_TOKEN = "<time>";
const STOCK_BUTTONS = ["button_negative", "button_no", "button_yes"];

class AccountDeletionDialog extends GenericPopup {
  constructor() {
    super("popup_generic", true, true);
    const movieClip = this.getMovieClip();
    AccountDeletionDialog.hideUnusedStockButtons(movieClip);
    const title =
      StringTable.getString("TID_ACCOUNT_DELETION_WARNING_TITLE") || "Account Deletion Warning";
    this.setTitleTid(title);
    const text =
      StringTable.getString("TID_ACCOUNT_DELETION_WARNING_TEXT") ||
      `Your account will be deleted in ${TIME_TOKEN}.`;
    movieClip.getTextFieldByName("txt").text = text.replace(TIME_TOKEN, "30 days");
    this.bindContactSupportButton();
    this.bindCloseButton();
  }

  bindContactSupportButton() {
    const button = this.addGameButton("button_ok", 1);
    button.getMovieClip().getTextFieldByName("txt").text =
      StringTable.getString("TID_ACCOUNT_DELETION_WARNING_BUTTON_CONTACT_PS") || "Contact Support";
    button.setCustomButtonListener(() => this.fadeOut());
  }

  bindCloseButton() {
    this.addGameButton("button_close", 1).setCustomButtonListener(() => this.fadeOut());
  }

  static hideUnusedStockButtons(movieClip) {
    for (const name of STOCK_BUTTONS) {
      const button = movieClip.getMovieClipByName(name);
      if (button) button.visibility = false;
    }
  }
}

class AccountDeletionDialogPreview {
  static show() {
    GUI.showPopup(new AccountDeletionDialog(), true, false, true);
  }
}

exports.AccountDeletionDialogPreview = AccountDeletionDialogPreview;
