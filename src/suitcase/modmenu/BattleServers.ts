// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleServersPopup = exports.BattleServersManager = void 0;
const { ListContainerPopup } = require("../flash/popup/ListContainerPopup");
const { StringTable } = require("../../laser/client/game/text/StringTable");
const { Latency } = require("../../laser/client/game/network/Latency");
const { BattleSeverItem } = require("../flash/popup/button/BattleSeverItem");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { Localisation } = require("../localisation/Localisation");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { Config } = require("../config/Config");
const { FileManager } = require("../filesystem/FileManager");
const { MessageManager } = require("../../laser/client/game/network/MessageManager");

class BattleServersPopup extends ListContainerPopup {
  constructor() {
    super({ Title: Localisation.getString("BattleServersPopupTitle") });
    this.battleServers = [];
    this.adjustPopupHeaderButtons("battle_servers");
    this.refreshItems();
  }

  refreshItems() {
    this.container.clearEntries();
    this.battleServers.length = 0;
    if (BattleServersManager.shouldSpoof()) {
      this.battleServers.push({
        name: StringTable.getString("TID_EDIT_REVERT"),
        regionId: -1,
        ping: -1,
        isBest: false,
      });
    }
    const latencyTests = MessageManager.getLatencyTests();
    for (let i = 0; i < latencyTests.length; i++) {
      const test = latencyTests[i];
      if (
        BattleServersManager.preferredBattleRegionId === test.getRegionId() &&
        BattleServersManager.isInitializing
      ) {
        BattleServersManager.lastChangedBattleServerName = test.getServerName();
        BattleServersManager.lastChangedBattleServerPing = test.getPing();
        BattleServersManager.isInitializing = false;
      }
      const selected = BattleServersManager.preferredBattleRegionId === test.getRegionId();
      const defaultBest = BattleServersManager.preferredBattleRegionId === -1 && i === 1;
      this.battleServers.push({
        name: test.getServerName(),
        regionId: test.getRegionId(),
        isBest: selected || defaultBest,
        ping: test.getPing(),
      });
    }
    for (let i = 0; i < this.battleServers.length; i++) {
      const item = new BattleSeverItem(this.battleServers[i]);
      item.id = i;
      item.setCustomButtonListener(this.buttonPressed.bind(this));
      this.container.addEntry(item);
    }
    this.refresh();
  }

  buttonPressed(_button, movieClip) {
    const id = new GameButton(movieClip).id;
    const server = this.battleServers[id];
    if (server) {
      if (server.regionId === -1) {
        BattleServersManager.reset();
        GUI.showFloaterTextAtDefaultPosition(Localisation.getString("BattleServerWasReverted"));
      } else {
        BattleServersManager.setRegion(server.regionId, server.name, server.ping);
        GUI.showFloaterTextAtDefaultPosition(
          Localisation.getString("BattleServerChangeWaitWarn"),
          4287332352,
        );
      }
      Latency.test();
      GUI.closeAllPopups();
    }
  }
}
exports.BattleServersPopup = BattleServersPopup;

class BattleServersManager {
  static loadFromConfig() {
    if (typeof Config.config.RegionId === "number" && Config.config.RegionId !== -1) {
      this.preferredBattleRegionId = Config.config.RegionId;
      this.lastChangedBattleServerPing = 0;
      this.lastChangedBattleServerName = "Loading...";
      this.isInitializing = true;
    }
  }
  static setRegion(regionId, name, ping) {
    this.preferredBattleRegionId = regionId;
    this.lastChangedBattleServerName = name;
    this.lastChangedBattleServerPing = ping;
    this.isInitializing = false;
    Config.config.RegionId = regionId;
    FileManager.updateConfigFile();
  }
  static reset() {
    this.preferredBattleRegionId = -1;
    this.lastChangedBattleServerName = "";
    this.lastChangedBattleServerPing = -1;
    this.isInitializing = false;
    Config.config.RegionId = -1;
    FileManager.updateConfigFile();
  }
  static shouldSpoof() {
    return this.preferredBattleRegionId !== -1;
  }
}
BattleServersManager.preferredBattleRegionId = -1;
BattleServersManager.lastChangedBattleServerName = "";
BattleServersManager.lastChangedBattleServerPing = -1;
BattleServersManager.isInitializing = false;
exports.BattleServersManager = BattleServersManager;