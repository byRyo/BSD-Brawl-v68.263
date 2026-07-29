// @ts-nocheck
const { GameButton } = require("../../../laser/client/game/gui/GameButton");
const { StringTable } = require("../../../laser/client/game/text/StringTable");
const { DisplayObject } = require("../../../laser/titan/client/common/flash/DisplayObject");
const { MessageManager } = require("../../../laser/client/game/network/MessageManager");
const {
  TeamBotSlotDisableMessage,
} = require("../../../laser/client/game/network/messaging/message/TeamBotSlotDisableMessage");
const { TeamPopup } = require("../../../laser/client/game/screen/home/TeamPopup");
const BOT_SLOT_COUNT = 12;

class DisableBotsButton extends GameButton {
  static botsDisabled = false;
  constructor() {
    DisableBotsButton.botsDisabled = false;
    super();
    this.setupVisual();
    this.x = -685;
    this.y = 0;
    this.scale = 1;
    this.setCustomButtonListener(this.onButtonPressed.bind(this), "disable_bots_button");
  }
  setupVisual() {
    try {
      const partyMode = StringTable.getMovieClip("sc/ui.sc", "gameroom_party_mode");
      const button = partyMode?.getMovieClipByName("button_chat");
      if (!button) return;
      this.hideChildrenExceptBackground(button);
      this.setMovieClip(button, true);
      this.addBotIcon(button);
      this.addCrossOverlay(button);
    } catch (_error) {}
  }
  hideChildrenExceptBackground(movieClip) {
    const count = movieClip.getChildCount();
    const children = movieClip.getChildArray();
    for (let index = 1; index < count; index++) {
      const pointer = children.add(index * Process.pointerSize).readPointer();
      if (!pointer.isNull()) new DisplayObject(pointer).visibility = false;
    }
  }
  addBotIcon(parent) {
    const item = StringTable.getMovieClip("sc/ui.sc", "member_item_extrasmall");
    if (!item) return;
    const image = item.getMovieClipByName("image_ph");
    if (!image) return;
    const nested = image.getMovieClipByName("image_ph");
    if (!nested) return;
    const child = nested.getChildArray().readPointer();
    if (!child.isNull()) new DisplayObject(child).visibility = true;
    image.scale = 0.2;
    image.y = -10;
    parent.addChild(image);
  }
  addCrossOverlay(parent) {
    const item = StringTable.getMovieClip("sc/ui.sc", "member_item_extrasmall");
    if (!item) return;
    const cross = item.getMovieClipByName("button_slot_switch");
    if (cross) {
      cross.gotoAndStopFrameIndex(1);
      cross.scale = 0.5;
      cross.x = 27;
      cross.y = -25;
      parent.addChild(cross);
    }
  }
  onButtonPressed() {
    if (DisableBotsButton.botsDisabled) this.enableAllDisabledSlots();
    else this.disableAllBotSlots();
  }
  disableAllBotSlots() {
    for (let index = 0; index < BOT_SLOT_COUNT; index++) {
      MessageManager.sendMessage(new TeamBotSlotDisableMessage(index, true));
    }
    DisableBotsButton.botsDisabled = true;
  }
  enableAllDisabledSlots() {
    for (const index of TeamPopup.getDisabledSlotIndices()) {
      MessageManager.sendMessage(new TeamBotSlotDisableMessage(index, false));
    }
    DisableBotsButton.botsDisabled = false;
  }
}
module.exports = { DisableBotsButton };
