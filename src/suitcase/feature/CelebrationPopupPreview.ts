// @ts-nocheck
const { GUI } = require("../../laser/client/game/gui/GUI");
const { FameLevelUpPopup } = require("../../laser/client/game/gui/popup/FameLevelUpPopup");
const {
  RecruitRoadClaimBrawlerPopup,
} = require("../../laser/client/game/gui/popup/RecruitRoadClaimBrawlerPopup");
class CelebrationPopupPreview {
  static showNewBrawler() {
    const popup = new RecruitRoadClaimBrawlerPopup(false);
    GUI.showPopup(popup.instance, false, false, false);
  }
  static showFameLevelUp() {
    const popup = new FameLevelUpPopup(0, 1);
    GUI.showPopup(popup.instance, false, true, false);
  }
}
exports.CelebrationPopupPreview = CelebrationPopupPreview;
