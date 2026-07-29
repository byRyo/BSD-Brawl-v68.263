// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.EInputPopupType = exports.InputPopup = void 0;
const { GenericPopup } = require("../../laser/titan/client/common/flash/GenericPopup");
const { GameInputField } = require("../../laser/titan/client/common/flash/GameInputField");
const { Localisation } = require("../localisation/Localisation");
const { HashTagCodeGenerator } = require("../../laser/client/game/utils/HashTagCodeGenerator");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { PlayerInfo } = require("../../laser/client/game/friends/PlayerInfo");
const { AllianceManager } = require("../../laser/client/game/screen/home/alliance/AllianceManager");
const { HomeScreen } = require("../../laser/client/game/screen/home/HomeScreen");
const { FamePopup } = require("../../laser/client/game/gui/popup/FamePopup");
const { SharedReplay } = require("../feature/SharedReplay");
const { BSDMessageManager } = require("../network/messaging/BSDMessageManager");
const {
  StartSCUtilsSpectateMessage,
} = require("../network/messaging/message/StartSCUtilsSpectateMessage");
const { LinkBSDPlusMessage } = require("../network/messaging/message/LinkBSDPlusMessage");
const { BSDSetTitleMessage } = require("../network/messaging/message/BSDSetTitleMessage");
const { GiveByGlobalId } = require("../feature/GiveByGlobalId");
const { GameMain } = require("../../laser/client/GameMain");
const EInputPopupType = {};
[
  "CHANGE_NAME",
  "OPEN_PROFILE",
  "FOLLOW_PLAYER",
  "PLUS_LINK",
  "GET_BSD_PLUS_STATE",
  "SET_TITLE",
  "GIVE_BY_GLOBAL_ID",
  "GIVE_FROM_CONTAINER_PICK_CONTAINER",
  "GIVE_FROM_CONTAINER_PICK_ITEM",
  "SPECTATE_FRIEND_BY_TAG",
  "JOIN_CLAN_BY_TAG",
  "SHOW_FAME",
  "WATCH_SHARED_REPLAY",
  "ADD_SPECTATORS",
  "ADD_SPECTATORS_BRAWLTV",
].forEach((name, i) => {
  EInputPopupType[name] = i;
  EInputPopupType[i] = name;
});
exports.EInputPopupType = EInputPopupType;
class InputPopup extends GenericPopup {
  constructor(popupType) {
    super("popup_generic");
    this.popupType = popupType;
    this.setTitleTid(Localisation.getString(InputPopup.POPUP_NAMES[popupType]));
    this.createInputField();
    const button = this.addGameButton("button_ok", true);
    button.setTextFieldText(Localisation.getString(InputPopup.CONFIRM_BUTTON_TEXTS[popupType]));
    button.setCustomButtonListener(this.buttonPressed.bind(this));
  }
  createInputField() {
    this.inputField = new GameInputField();
    this.inputField.setMovieClip(this.getMovieClip().getMovieClipByName("input"));
    this.inputField.setTextField(this.getMovieClip().getTextFieldByName("input_txt"));
    this.inputField.setInputFieldListener(this.onInputFieldClicked.bind(this));
    this.getMovieClip().addChild(this.inputField);
  }
  onInputFieldClicked() {
    this.inputField.activate(true);
  }
  text() {
    return this.inputField.getInputText().trim();
  }
  closeInput() {
    this.inputField.activate(false);
    this.fadeOut();
  }
  validTag(value) {
    return (
      !!value &&
      [...value.toUpperCase()].every((c) =>
        ["#", ...HashTagCodeGenerator.CONVERSION_CHARS].includes(c),
      )
    );
  }
  buttonPressed() {
    const handlers = {
      0: "handleChangeNameType",
      1: "handleOpenProfileType",
      3: "handleLinkBSDPlusType",
      5: "handleSetTitleType",
      6: "handleGiveByGlobalIdType",
      7: "handleGiveFromContainerPickContainer",
      8: "handleGiveFromContainerPickItem",
      9: "handleSpectateFriendByTagType",
      10: "handleJoinClanByTagType",
      11: "handleShowFameType",
      12: "handleWatchSharedReplayType",
    };
    if (this.popupType === 13 || this.popupType === 14)
      this.handleAddSpectatorsType(this.popupType === 14);
    else if (handlers[this.popupType]) this[handlers[this.popupType]]();
  }
  handleSpectateFriendByTagType() {
    const value = this.text().toUpperCase();
    if (!this.validTag(value))
      return GUI.showFloaterTextAtDefaultPosition(Localisation.getString("IncorrectTag"));
    const tag = HashTagCodeGenerator.convertPlayerTagToLong(value);
    this.closeInput();
    AllianceManager.doStartSpectate(tag.instance);
  }
  handleJoinClanByTagType() {
    const value = this.text().toUpperCase();
    if (!this.validTag(value))
      return GUI.showFloaterTextAtDefaultPosition(Localisation.getString("IncorrectTag"));
    const tag = HashTagCodeGenerator.convertPlayerTagToLong(value);
    this.closeInput();
    HomeScreen.joinClanByTag(tag.instance, value);
  }
  handleShowFameType() {
    const value = parseInt(this.text(), 10);
    if (Number.isFinite(value) && value >= 0) {
      this.closeInput();
      FamePopup.show(value);
    }
  }
  handleWatchSharedReplayType() {
    const value = this.text();
    if (value) {
      this.closeInput();
      SharedReplay.watchByCode(value);
    }
  }
  handleAddSpectatorsType(brawlTv) {
    const count = parseInt(this.text(), 10);
    if (!Number.isFinite(count) || count <= 0) return;
    if (count > 5000)
      return GUI.showFloaterTextAtDefaultPosition(
        Localisation.getString("AddSpectatorsMaxExceeded"),
      );
    this.closeInput();
    BSDMessageManager.sendMessage(new StartSCUtilsSpectateMessage(count, brawlTv));
  }
  isAddSpectatorsPopup() {
    return (
      this.popupType === EInputPopupType.ADD_SPECTATORS ||
      this.popupType === EInputPopupType.ADD_SPECTATORS_BRAWLTV
    );
  }
  handleChangeNameType() {
    const value = this.text();
    if (value) {
      PlayerInfo.name = value;
      this.closeInput();
      HomeScreen.reload();
    }
  }
  handleOpenProfileType() {
    const value = this.text().toUpperCase();
    if (!this.validTag(value))
      return GUI.showFloaterTextAtDefaultPosition(Localisation.getString("IncorrectTag"));
    this.closeInput();
    PlayerInfo.openProfileByTag(value);
  }
  handleLinkBSDPlusType() {
    const value = this.text();
    if (value) {
      this.closeInput();
      BSDMessageManager.sendMessage(new LinkBSDPlusMessage(value));
    }
  }
  handleGiveByGlobalIdType() {
    const value = parseInt(this.text(), 10);
    if (Number.isFinite(value)) {
      this.closeInput();
      GiveByGlobalId.give(value);
    }
  }
  handleGiveFromContainerPickContainer() {
    const value = parseInt(this.text(), 10);
    if (Number.isFinite(value)) {
      this.closeInput();
      GiveByGlobalId.containerId = value;
      GUI.showPopup(
        new InputPopup(EInputPopupType.GIVE_FROM_CONTAINER_PICK_ITEM),
        true,
        true,
        false,
      );
    }
  }
  handleGiveFromContainerPickItem() {
    const value = parseInt(this.text(), 10);
    if (Number.isFinite(value)) {
      this.closeInput();
      GiveByGlobalId.giveFromContainer(GiveByGlobalId.containerId, value);
    }
  }
  handleSetTitleType() {
    const value = this.text();
    if (value) {
      this.closeInput();
      BSDMessageManager.sendMessage(new BSDSetTitleMessage(value));
    }
  }
  updateElements(time) {
    super.updateElements?.(time);
    if (this.inputField) this.inputField.update(time);
  }
  onDestructed() {
    this.inputField?.destruct();
  }
}
InputPopup.allocationSize = 768;
InputPopup.lastTimePressedActiveButton = 0;
InputPopup.POPUP_NAMES = {
  0: "VisualNameChange",
  1: "OpenPlayerProfile",
  2: "FollowPlayerByTag",
  3: "LinkBSDPlusInputFieldTitle",
  4: "GetBSDPlusState",
  5: "SetTitle",
  6: "GiveByGlobalIdInputTitle",
  7: "GiveFromContainerPickContainerInputTitle",
  8: "GiveFromContainerPickItemInputTitle",
  9: "SpectateFriendByTagInputTitle",
  10: "JoinClanByTagInputTitle",
  11: "ShowFameInputTitle",
  12: "WatchSharedReplayInputTitle",
  13: "AddSpectatorsInputTitle",
  14: "AddSpectatorsBrawlTvInputTitle",
};
InputPopup.CONFIRM_BUTTON_TEXTS = {
  0: "VisualNameChangeButton",
  1: "OpenPlayerProfileButton",
  2: "FollowPlayerByTagButton",
  3: "LinkBSDPlusButton",
  4: "",
  5: "SetTitleButton",
  6: "GiveByGlobalIdButton",
  7: "GiveFromContainerNextButton",
  8: "GiveByGlobalIdButton",
  9: "SpectateButton",
  10: "JoinClanByTagButton",
  11: "ShowFameButton",
  12: "WatchSharedReplayButton",
  13: "AddSpectatorsButton",
  14: "AddSpectatorsButton",
};
exports.InputPopup = InputPopup;
