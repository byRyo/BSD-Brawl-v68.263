// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusSelectorPopup = void 0;
const { ListContainerPopup } = require("../flash/popup/ListContainerPopup");
const { Localisation } = require("../localisation/Localisation");
const { StatusItem } = require("../flash/popup/button/StatusItem");
const {
  TeamMemberStatusMessage,
} = require("../../laser/client/game/network/messaging/message/TeamMemberStatusMessage");
const { MessageManager } = require("../../laser/client/game/network/MessageManager");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { GameButton } = require("../../laser/client/game/gui/GameButton");

class StatusSelectorPopup extends ListContainerPopup {
  constructor() {
    super({ Title: Localisation.getString("StatusesPopupTitle") });
    this.statusesArray = [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    this.statusItemsCount = 0;
    this.adjustPopupHeaderButtons("status_selector");
    this.refreshItems();
    StatusSelectorPopup.instance = this;
  }
  refreshItems() {
    this.container.clearEntries();
    this.statusItemsCount = this.statusesArray.length;
    for (let i = 0; i < this.statusItemsCount; i++) {
      const item = new StatusItem(this.statusesArray[i]);
      item.setCustomButtonListener(this.buttonPressed.bind(this));
      this.container.addEntry(item);
    }
    const height = this.getNaviHeight();
    this.container.refreshEntryPositions(4, height, 8, false, false, false, -1);
    this.container.refreshBounds(height);
  }
  buttonPressed(_button, movieClip) {
    const id = new GameButton(movieClip).id;
    const message = new TeamMemberStatusMessage(id);
    MessageManager.sendMessage(message);
    GUI.closeAllPopups();
  }
}
exports.StatusSelectorPopup = StatusSelectorPopup;
