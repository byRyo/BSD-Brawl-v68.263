// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsTrackersPopup = void 0;
const { ListContainerPopup } = require("../flash/popup/ListContainerPopup");
const { Localisation } = require("../localisation/Localisation");
const { StatsTrackerItem } = require("../flash/popup/button/StatsTrackerItem");
const { StringTable } = require("../../laser/client/game/text/StringTable");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { MovieClip } = require("../../laser/titan/client/common/flash/MovieClip");
const { Stage } = require("../../laser/titan/client/common/flash/Stage");
const { LogicTime } = require("../logic/LogicTime");
const {
  LoginOkMessage,
} = require("../../laser/client/game/network/messaging/message/LoginOkMessage");
const { NativeDialog } = require("../../laser/titan/client/native/NativeDialog");
const { SimpleWebView } = require("../../laser/client/game/gui/SimpleWebView");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { PlayerInfo } = require("../../laser/client/game/friends/PlayerInfo");
class StatsTrackersPopup extends ListContainerPopup {
  constructor() {
    super({ Title: Localisation.getString("StatsTrackersPopup") });
    this.adjustPopupHeaderButtons("stats_popup");
    this.refreshItems();
  }
  refreshItems() {
    this.container.clearEntries();
    for (const tracker of StatsTrackersPopup.TRACKERS) {
      if (tracker.disabled) continue;
      const item = new StatsTrackerItem(tracker);
      item.setCustomButtonListener(
        this.buttonClicked.bind(this),
        "tracker_".concat(tracker.id, "_button"),
      );
      item.id = tracker.id;
      this.container.addEntry(item);
    }
    const height = this.getNaviHeight();
    this.container.refreshEntryPositions(2, height, 32, false, false, false, -1);
    this.container.refreshBounds(height);
    const clip = StringTable.getMovieClip("sc/ui.sc", "country_item");
    const button = new GameButton();
    button.setCustomButtonListener(
      this.onAccountStatsButtonPressed.bind(this),
      "account_stats_button",
    );
    button.setMovieClip(clip.instance, true);
    const label = MovieClip.getTextFieldByName(clip.instance, "Text");
    label.fontOutline = true;
    label.setTextScaleIfNecessary(Localisation.getString("AccountStats"));
    clip.gotoAndStopFrameIndex(1);
    button.x = 0;
    button.y = Stage.getMatrixY() - Stage.getMatrixY() / 6;
    this.accountStatsButton = button;
    this.getMovieClip().addChild(button.instance);
  }
  buttonClicked(_button, movieClip) {
    const id = new GameButton(movieClip).id;
    const tracker = StatsTrackersPopup.TRACKERS.find((entry) => entry.id === id);
    if (!tracker) return;
    const web = SimpleWebView.create();
    web.loadURL(tracker.uri + PlayerInfo.tag);
    web.setTitleTid(tracker.name);
    web.setDisallowModalTap(true);
    GUI.showPopup(web, false, true, true);
  }
  formatTimePart(value, unit) {
    return value > 0 ? "".concat(value, " ", unit, " ") : "";
  }
  getFormattedPlayedTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    Math.floor(seconds % 60);
    return (
      this.formatTimePart(hours, Localisation.getString("HoursShort")) +
      this.formatTimePart(minutes, Localisation.getString("MinsShort")) +
      this.formatTimePart(minutes, Localisation.getString("SecsShort"))
    ).trim();
  }
  onAccountStatsButtonPressed() {
    const now = Date.now();
    const text = [
      "".concat(Localisation.getString("AccountCreationDate"), ":"),
      LogicTime.timestampToDate(parseInt(LoginOkMessage.accountCreatedDate)),
      "",
      "".concat(Localisation.getString("SpentTimeOnline"), ":"),
      "".concat(
        this.getFormattedPlayedTime(
          LoginOkMessage.playTimeInSeconds + (now - LoginOkMessage.sessionStartedTimestamp) / 1000,
        ),
        " /// ",
        this.getFormattedPlayedTime((now - LoginOkMessage.sessionStartedTimestamp) / 1000),
      ),
      "",
      "".concat(Localisation.getString("SessionCount"), ":"),
      LoginOkMessage.sessionCount,
    ].join("\n");
    NativeDialog.show(Localisation.getString("AccountStats"), text, "OK");
  }
}
StatsTrackersPopup.TRACKERS = [
  { name: "Brawl Stats", id: 0, disabled: false, uri: "https://brawlstats.com/profile/" },
  { name: "Brawlify", id: 1, disabled: false, uri: "https://brawlify.com/stats/profile/" },
  { name: "Noff", id: 2, disabled: false, uri: "https://www.noff.gg/brawl-stars/profile/" },
  { name: "BrawlFind", id: 3, disabled: false, uri: "https://www.brawlfind.com/player/" },
];
exports.StatsTrackersPopup = StatsTrackersPopup;
