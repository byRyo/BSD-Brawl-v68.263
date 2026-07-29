// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { GameStateManager, GameStateId } = require("../GameStateManager");
const { LogicConfData } = require("../../../logic/data/LogicConfData");
const { EventSlot } = require("../../../logic/data/EventSlot");
const { LogicDataTables } = require("../../../logic/data/LogicDataTables");
const { LogicHeroSeenCommand } = require("../../../logic/command/LogicHeroSeenCommand");
const { LogicDailyData } = require("../../../logic/data/LogicDailyData");
const { LogicClientHome } = require("../../../logic/home/LogicClientHome");
const { Settings } = require("../../Settings");

const HomeMode_addCommandOffset = Libg.offset(10244472, 9620584);
const addCommandNative = new NativeFunction(HomeMode_addCommandOffset, "int", [
  "pointer",
  "pointer",
]);
const getConfDataNative = new NativeFunction(Libg.offset(10244812, 9620908), "pointer", []);
const getPlayerDataNative = new NativeFunction(Libg.offset(10246036, 9622036), "pointer", []);

class HomeMode {
  static HomeMode_addCommandOffset = HomeMode_addCommandOffset;
  static getInstance() {
    if (!GameStateManager.isInState(GameStateId.Home)) return null;
    const instance = GameStateManager.getCurrentState();
    if (instance.isNull()) return null;
    return instance;
  }
  static addCommand(command) {
    const instance = this.getInstance();
    if (instance !== null) addCommandNative(instance, command);
  }
  static getConfData() {
    return getConfDataNative();
  }
  static getPlayerData() {
    return getPlayerDataNative();
  }
  static getPlayerAvatar() {
    return GameStateManager.getPlayerAvatar();
  }
  static getActiveEventForSlot(slot) {
    return LogicConfData.getActiveEventForSlot(this.getConfData(), slot);
  }
  static getSelectedEventSlot() {
    return this.getActiveEventForSlot(Settings.getLastPlayedEventSlot());
  }
  static getUnclaimedXpEventSlots() {
    return LogicConfData.getEventSlots(this.getConfData())
      .filter((slot) => slot.claimLevel < EventSlot.CLAIM_LEVEL_XP_CLAIMED && slot.xpReward > 0)
      .map((slot) => ({ slotIndex: slot.slotIndex, xpReward: slot.xpReward }));
  }
  static getUnseenCharacters() {
    const avatar = this.getPlayerAvatar();
    const table = LogicDataTables.getTable(LogicDataTables.table.Characters);
    const result = [];
    for (let i = 0; i < table.getItemCount(); i++) {
      const character = table.getItemAt(i);
      if (
        character !== null &&
        avatar.getHeroSeenState(character) !== LogicHeroSeenCommand.SeenState.FullyViewed
      ) {
        result.push(character);
      }
    }
    return result;
  }
  static getNewCardItems() {
    const playerData = LogicClientHome.getPlayerData();
    if (playerData) return LogicDailyData.getNewItems(playerData);
    return null;
  }
}

HomeMode.gatchaType = {
  Character: 0,
  Skin: 0,
  PowerPoints: 1,
  Coins: 2,
  TokenDoublers: 3,
  StarPower: 4,
  EmotePack: 5,
  PlayerIcon: 6,
  Box: 7,
  Gadget: 8,
  Unknown: 9,
  StarPoints: 10,
  Hypercharge: 11,
  Empty: 12,
};

exports.HomeMode_addCommandOffset = HomeMode_addCommandOffset;
exports.HomeMode = HomeMode;
