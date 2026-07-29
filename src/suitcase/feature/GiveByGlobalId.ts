// @ts-nocheck
const { Logcat } = require("../debug/Logcat");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { GameStateManager } = require("../../laser/client/game/state/GameStateManager");
const { LogicClientHome } = require("../../laser/client/logic/home/LogicClientHome");
const { LogicDataTables } = require("../../laser/client/logic/data/LogicDataTables");
const { LogicDailyData } = require("../../laser/client/logic/data/LogicDailyData");
const { GlobalID } = require("../../laser/client/game/utils/GlobalID");
const {
  LogicGatchaDrop,
  EGatchaDropTypes,
} = require("../../laser/client/logic/home/LogicGatchaDrop");
const { DeliveryUnit } = require("../../laser/client/game/screen/home/gatcha/DeliveryUnit");
const { LogicArrayList } = require("../../laser/client/logic/data/LogicArrayList");
const { RewardOpeningPopup } = require("../../laser/client/game/gui/popup/RewardOpeningPopup");
const { HomeScreen } = require("../../laser/client/game/screen/home/HomeScreen");
const { HomeMode } = require("../../laser/client/game/state/homemode/HomeMode");
class GiveByGlobalId {
  static rememberContainerId(id) {
    this.pendingContainerId = id;
  }
  static giveInstant(globalId) {
    const data = LogicDataTables.getDataById(globalId);
    if (!data || data.instance.isNull()) {
      GUI.showFloaterTextAtDefaultPosition(`Unknown global ID ${globalId}`);
      return;
    }
    const table = GlobalID.getClassID(globalId),
      tables = LogicDataTables.table;
    if (table === tables.Characters) {
      HomeScreen.doOfflineGatcha(HomeMode.gatchaType.Character, data);
      return;
    }
    if (table === tables.Skins) {
      const character = data.getCharacter();
      if (character) HomeScreen.doOfflineGatcha(HomeMode.gatchaType.Skin, character, data);
      else GUI.showFloaterTextAtDefaultPosition(`Skin ${globalId} has no character`);
      return;
    }
    if (table === tables.Cards) {
      const avatar = GameStateManager.getPlayerAvatar();
      if (!avatar.instance.isNull()) avatar.setItem(data);
      GUI.showFloaterTextAtDefaultPosition(`Given ${globalId}`);
      return;
    }
    GUI.showFloaterTextAtDefaultPosition(`Unsupported data type ${table} for ${globalId}`);
    Logcat.logDebug(`GIVE_BY_GLOBAL_ID unsupported tableId=${table} for instant give`);
  }
  static giveFromPendingContainer(globalId) {
    const containerId = this.pendingContainerId,
      container = LogicDataTables.getDataById(
        LogicDataTables.table.RandomRewardContainers,
        containerId,
      );
    if (!container || container.instance.isNull()) {
      GUI.showFloaterTextAtDefaultPosition(`Unknown container ID ${containerId}`);
      return;
    }
    const data = LogicDataTables.getDataById(globalId);
    if (!data || data.instance.isNull()) {
      GUI.showFloaterTextAtDefaultPosition(`Unknown global ID ${globalId}`);
      return;
    }
    const table = GlobalID.getClassID(globalId),
      id = GlobalID.getInstanceID(globalId),
      drop = this.unlockAndBuildDrop(table, id, data);
    if (!drop) {
      GUI.showFloaterTextAtDefaultPosition(`Unsupported data type ${table} for ${globalId}`);
      return;
    }
    if (this.canRenderContainerVisual(container)) this.showGachaAnimation(drop, containerId);
    else {
      this.giveWithoutContainer(table, id, data);
      GUI.showFloaterTextAtDefaultPosition(
        `Container ${containerId} (visualType=${container.visualType}) shown without chest`,
      );
    }
  }
  static canRenderContainerVisual(container) {
    return [0, 1, 2, 4].includes(container.visualType);
  }
  static giveWithoutContainer(table, id, data) {
    const tables = LogicDataTables.table;
    if (table === tables.Characters)
      HomeScreen.doOfflineGatcha(HomeMode.gatchaType.Character, data);
    else if (table === tables.Skins) {
      const character = data.getCharacter();
      if (character) HomeScreen.doOfflineGatcha(HomeMode.gatchaType.Skin, character, data);
    } else
      Logcat.logDebug(
        `GIVE_FROM_CONTAINER tableId=${table} id=${id} reward credited, no animation`,
      );
  }
  static applyUnlock(table, data) {
    const avatar = GameStateManager.getPlayerAvatar(),
      home = LogicClientHome.getPlayerData(),
      tables = LogicDataTables.table;
    if (table === tables.Characters) {
      if (avatar.instance.isNull()) return false;
      const card = LogicDataTables.getCardForMetaType(data, 0);
      if (card) avatar.unlockHero(card.instance, 3);
      return true;
    }
    if (table === tables.Cards) {
      if (!avatar.instance.isNull()) avatar.setItem(data);
      return true;
    }
    if (table === tables.Skins) {
      if (home) LogicDailyData.addUnlockedSkin(home, data);
      return true;
    }
    if (table === tables.Emotes || table === tables.Sprays) {
      Logcat.logDebug(
        `GIVE_BY_GLOBAL_ID vanity tableId=${table} given as animation-only (no persistence)`,
      );
      return true;
    }
    Logcat.logDebug(`GIVE_BY_GLOBAL_ID unsupported tableId=${table}`);
    return false;
  }
  static unlockAndBuildDrop(table, id, data) {
    if (!this.applyUnlock(table, data)) return null;
    const tables = LogicDataTables.table;
    if (table === tables.Characters) return new LogicGatchaDrop(EGatchaDropTypes.CHARACTER, 1, id);
    if (table === tables.Cards) return new LogicGatchaDrop(EGatchaDropTypes.SKILL, 1, id);
    if (table === tables.Skins) return new LogicGatchaDrop(EGatchaDropTypes.SKIN, 1, id);
    if (table === tables.Emotes || table === tables.Sprays)
      return new LogicGatchaDrop(EGatchaDropTypes.VANITY_ITEM, 1, id, table);
    return null;
  }
  static showGachaAnimation(drop, containerId) {
    const unit = new DeliveryUnit(3);
    unit.addDrop(drop);
    const units = new LogicArrayList(1).addElement(unit.instance);
    const popup = new RewardOpeningPopup(containerId, units, 0, 0);
    GUI.showPopup(popup.instance, true, false, false);
  }
}
GiveByGlobalId.pendingContainerId = 0;
exports.GiveByGlobalId = GiveByGlobalId;
