// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicLaserMessageFactory } = require("../../logic/message/LogicLaserMessageFactory");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { CombatHUD } = require("../gui/CombatHUD");
const { Config } = require("../../../../suitcase/config/Config");
const { PlayAgainMessage } = require("./messaging/message/PlayAgainMessage");
const { Breadcrumbs } = require("../../../../suitcase/debug/Breadcrumbs");
const { LoadingScreen } = require("../state/loading/LoadingScreen");
const { BattleEndMessage } = require("./messaging/message/BattleEndMessage");
const { HashTagCodeGenerator } = require("../utils/HashTagCodeGenerator");
const { LogicDataTables } = require("../../logic/data/LogicDataTables");
const { PlayerInfo } = require("../friends/PlayerInfo");
const { BSDMessageManager } = require("../../../../suitcase/network/messaging/BSDMessageManager");
const {
  BSDReportBattleEndResultsMessage,
} = require("../../../../suitcase/network/messaging/message/BSDReportBattleEndResultsMessage");
const { LatencyData } = require("./LatencyData");
const { StringTable } = require("../text/StringTable");
const { FriendListMessage } = require("./messaging/message/FriendListMessage");
const { FriendEntry } = require("../friends/FriendEntry");
const { MyAllianceMessage } = require("./messaging/message/MyAllianceMessage");
const { AllianceMemberEntry } = require("../alliance/AllianceMemberEntry");
const { GameButton, DEFAULT_TEXT_FIELD_NAME } = require("../gui/GameButton");
const instance = Libg.offset(19845904, 18155184);
const send = new NativeFunction(Libg.offset(8447624, 8095244), "int", ["pointer", "pointer"]);
const startTutorial = new NativeFunction(Libg.offset(8476772, 8122132), "void", [
  "pointer",
  "pointer",
  "char",
]);
const requestRewards = new NativeFunction(Libg.offset(8479888, 8124340), "void", [
  "pointer",
  "int",
  "char",
]);
const MessageManager_update = Libg.offset(8475000, 8120472);
const latencyCount = LogicMemory.offset(3 * Process.pointerSize),
  latencyArray = LogicMemory.offset(465);
const seasonRewards = LogicMemory.offset(460),
  piranhaMessageOffset = LogicMemory.offset(448);
class MessageManager {
  static getInstance() {
    return instance.readPointer();
  }
  static getPiranhaMessageInstance() {
    return this.piranhaMessage;
  }
  static sendMessage(message) {
    const manager = this.getInstance();
    const fn = new NativeFunction(
      manager.readPointer().add(piranhaMessageOffset).readPointer(),
      "void",
      ["pointer", "pointer"],
    );
    return fn(manager, message.instance);
  }
  static startTutorial(value) {
    startTutorial(this.getInstance(), value, 0);
  }
  static getLatencyTestsCount() {
    return this.getInstance().add(latencyCount).readInt();
  }
  static getLatencyTests() {
    const value = this.getInstance(),
      count = value.add(latencyCount).readInt(),
      array = value.add(latencyArray).readPointer(),
      result = [];
    for (let i = 0; i < count; i++)
      result.push(new LatencyData(array.add(Process.pointerSize * i).readPointer()));
    return result;
  }
  static requestSeasonRewards(season = 0, animate = true) {
    if (Process.platform === "darwin") return;
    const value = this.getInstance();
    if (!value.isNull()) requestRewards(value, season, +animate);
  }
  static startTutorialFromConversionPopup() {
    const value = this.getInstance();
    if (!value.isNull()) value.add(seasonRewards).writeU8(1);
  }
  static patch() {
    Interceptor.attach(MessageManager_update, {
      onEnter(args) {
        const message = LogicLaserMessageFactory.createMessageByInstance(args[1]),
          type = message.getMessageType();
        if (!MessageManager.DO_NOT_LOG_MESSAGES.includes(type) && type < 40000)
          Breadcrumbs.push(`MessageManager::receiveMessage: ${type}`);
        if (type === 20103 || type === 20104) LoadingScreen.onLoginResponse(type);
        const handlers = {
          20105: "onFriendListMessageReceived",
          20405: "onMatchMakingStatusMessageReceived",
          24108: "onMatchmakeFailedMessageReceived",
          23456: "onBattleEndMessageReceived",
          24301: "onAllianceDataMessageReceived",
          24399: "onMyAllianceMessageReceived",
          24777: "onPlayAgainStatusMessageReceived",
        };
        if (handlers[type]) MessageManager[handlers[type]](message);
      },
    });
  }
  static onFriendListMessageReceived(message) {
    FriendListMessage.friendsIds.clear();
    const list = message.friendList;
    for (let i = 0; i < list.getItemsCount(); i++) {
      const ptr = list.getElement(i);
      if (!ptr.isNull()) FriendListMessage.friendsIds.add(new FriendEntry(ptr).playerId.toString());
    }
  }
  static onMatchMakingStatusMessageReceived(message) {
    if (!this.inMatchMaking || !this.readyButton || this.readyButton.isNull()) return;
    new GameButton(this.readyButton).setText(
      DEFAULT_TEXT_FIELD_NAME,
      `${message.playerCount}/${message.maxPlayers}`,
    );
  }
  static onMatchmakeFailedMessageReceived(_message) {
    this.stopMatchMaking();
  }
  static stopMatchMaking() {
    if (!this.readyButton || this.readyButton.isNull()) return;
    this.inMatchMaking = false;
    new GameButton(this.readyButton).setText(
      DEFAULT_TEXT_FIELD_NAME,
      StringTable.getString("TID_BATTLE"),
    );
  }
  static onBattleEndMessageReceived(message) {
    const count = message.playersArray?.getItemsCount() || 0,
      variation = LogicDataTables.getDataById(
        LogicDataTables.table.GameModeVariations,
        message.gameModeVariation,
      );
    const result = {
      battleUuid: message.battleUUId,
      gameMode: variation ? variation.getName() : "UNK",
      type: message.type,
      result: message.result,
      ownIndex: -1,
      winstreak: message.winstreak,
      players: [],
    };
    for (let i = 0; i < count; i++)
      try {
        const p = message.getPlayer(i);
        if (!p) continue;
        const tag = p.playerId ? HashTagCodeGenerator.convertLongToPlayerTag(p.playerId) : "BOT";
        if (p.playerId?.equals(PlayerInfo.accountId)) result.ownIndex = i;
        result.players.push({
          playerTag: tag,
          kills: p.kills,
          deaths: p.deaths,
          damage: p.damage,
          heal: p.heal,
        });
      } catch (_) {
        Breadcrumbs.push(
          `[MessageManager.onBattleEndMessageReceived] Couldn't handle data for player with index ${i}`,
        );
      }
    if (!message.state264 && !message.trainingBattle) {
      BattleEndMessage.result = result;
      BSDMessageManager.sendMessage(new BSDReportBattleEndResultsMessage(result));
    }
  }
  static onAllianceDataMessageReceived(message) {
    if (!PlayerInfo.allianceId) return;
    const entry = message.fullEntry,
      header = entry.header;
    if (!PlayerInfo.allianceId.equals(header.allianceId)) return;
    MyAllianceMessage.membersIds.clear();
    const members = entry.members;
    for (let i = 0; i < members.getItemsCount(); i++) {
      const ptr = members.getElement(i);
      if (!ptr.isNull())
        MyAllianceMessage.membersIds.add(new AllianceMemberEntry(ptr).playerId.toString());
    }
  }
  static onMyAllianceMessageReceived(message) {
    if (message.header) PlayerInfo.allianceId = message.header.allianceId;
  }
  static onPlayAgainStatusMessageReceived(message) {
    const status = message.getPlayAgainStatus();
    if ([1, 2, 3].includes(status)) return;
    if (Config.config.ShowFastPlayAgainButton && CombatHUD.fastPlayAgainButton)
      CombatHUD.fastPlayAgainButton.visibility = true;
    if (Config.config.AutoPlayAgain) this.sendMessage(new PlayAgainMessage(true));
  }
}
MessageManager.inMatchMaking = false;
MessageManager.DO_NOT_LOG_MESSAGES = [20108, 24109];
MessageManager.TEST = false;
exports.MessageManager_update = MessageManager_update;
exports.MessageManager = MessageManager;
