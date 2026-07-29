// @ts-nocheck
const { GUI } = require("../../laser/client/game/gui/GUI");
const { StringTable } = require("../../laser/client/game/text/StringTable");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { ListContainerPopup } = require("../flash/popup/ListContainerPopup");

class BadgePreviewPopup extends ListContainerPopup {
  constructor() {
    super({ Title: "BADGES" });
    this.adjustPopupHeaderButtons("badge_preview");
    this.refreshItems();
  }

  refreshItems() {
    this.container.clearEntries();
    for (let first = 1; first <= 6; first++) {
      for (let second = 1; second <= 10; second++) {
        const clip = StringTable.getMovieClip_safe(
          "sc/ui.sc",
          BadgePreviewPopup.badgeExportName(first, second),
        );
        if (!clip) continue;
        const button = new GameButton();
        button.setMovieClip(clip, true);
        this.container.addEntry(button);
      }
    }
    const height = this.getNaviHeight();
    this.container.refreshEntryPositions(4, height, 2, 0, 0, 0, -1);
    this.container.refreshBounds(height);
  }

  static badgeExportName(first, second) {
    return `clan_badge_${this.padTwo(first)}_${this.padTwo(second)}`;
  }

  static padTwo(value) {
    return value.toString().padStart(2, "0");
  }
}

class BadgePreview {
  static show() {
    GUI.showPopup(new BadgePreviewPopup(), true, false, false);
  }
}

exports.BadgePreview = BadgePreview;
