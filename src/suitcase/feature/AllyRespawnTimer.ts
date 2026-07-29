// @ts-nocheck
const { Config } = require("../config/Config");
const { StringObject } = require("../../laser/titan/client/native/StringObject");
const { BattleMode } = require("../../laser/client/game/state/battlemode/BattleMode");
const { LogicBattleModeClient } = require("../../laser/client/logic/mode/LogicBattleModeClient");
const { LogicCharacterClient } = require("../../laser/client/logic/battle/LogicCharacterClient");
const { LogicGameModeUtil } = require("../../laser/client/logic/data/LogicGameModeUtil");
const { StringTable } = require("../../laser/client/game/text/StringTable");
const { TextField } = require("../../laser/titan/client/common/flash/TextField");
const { CombatHUD } = require("../../laser/client/game/gui/CombatHUD");
const REDIRECTABLE_TIDS = new Set([
  "TID_TEAM_MATE_GONE",
  "TID_ALL_TEAM_MATES_GONE",
  "TID_ALL_TEAM_MATES_GONE_5P",
  "TID_ALL_TEAM_MATES_GONE_2V2",
]);

class AllyRespawnTimer {
  static patch() {
    if (this.patched) return;
    this.patched = true;
    CombatHUD.addHintTextsListener((hud) => {
      if (Config.config.AllyRespawnTimer)
        try {
          this.tick(hud);
        } catch (_) {}
    });
    StringTable.addStringByCStringRedirector((tid, returnAddress) => {
      if (!Config.config.AllyRespawnTimer || this.currentTimerStringObject.isNull()) return null;
      return CombatHUD.isReturnAddressInUpdateHintTexts(returnAddress) &&
        this.isRedirectableTid(tid)
        ? this.currentTimerStringObject
        : null;
    });
  }
  static tick(hud) {
    if (BattleMode.getInstance().isNull()) {
      this.resetTrackingState();
      return;
    }
    const modePointer = BattleMode.getLogicBattleModeClient();
    if (modePointer.isNull()) {
      this.resetTrackingState();
      return;
    }
    const mode = new LogicBattleModeClient(modePointer),
      index = mode.modeIndex;
    if (LogicGameModeUtil.isDuoShowdown(index) || index === 34) {
      this.resetTrackingState();
      return;
    }
    const util = mode.getGameModeUtil();
    if (util.isNull() || !LogicGameModeUtil.isShowdownLikeMode(util)) {
      this.resetTrackingState();
      return;
    }
    if (this.currentMatchModeIndex !== index) {
      this.currentMatchModeIndex = index;
      this.resetTrackingState();
    }
    const alive = this.countAliveTeammates(modePointer);
    this.applyAliveCountTransition(alive);
    if (!this.deathTimestampsMs.length) {
      this.clearTimerString();
      return;
    }
    const respawn = this.resolveRespawnSeconds(modePointer, util);
    if (respawn <= 0) {
      this.clearTimerString();
      return;
    }
    const seconds = this.computeDisplaySeconds(respawn);
    this.updateTimerString(
      seconds > 0 ? this.getEngineRespawnTemplate().replace("<num>", String(seconds)) : "",
    );
    this.applyTimerStringToTextField(hud);
  }
  static applyAliveCountTransition(alive) {
    const now = Date.now();
    if (this.lastObservedAliveTeammateCount >= 0 && alive < this.lastObservedAliveTeammateCount)
      for (let i = 0; i < this.lastObservedAliveTeammateCount - alive; i++)
        this.deathTimestampsMs.push(now);
    else if (
      this.lastObservedAliveTeammateCount >= 0 &&
      alive > this.lastObservedAliveTeammateCount
    )
      for (
        let i = 0;
        i < alive - this.lastObservedAliveTeammateCount && this.deathTimestampsMs.length;
        i++
      )
        this.deathTimestampsMs.shift();
    this.lastObservedAliveTeammateCount = alive;
  }
  static resolveRespawnSeconds(mode, util) {
    return LogicGameModeUtil.getRespawnSeconds(
      util,
      LogicBattleModeClient.hasEventModifier(mode, 69),
    );
  }
  static computeDisplaySeconds(respawn) {
    return Math.ceil(respawn - (Date.now() - this.deathTimestampsMs[0]) / 1000 - 1);
  }
  static getEngineRespawnTemplate() {
    if (this.cachedEngineRespawnTemplate !== null) return this.cachedEngineRespawnTemplate;
    try {
      const value = StringTable.getString("TID_TEAM_MATE_RESPAWNING");
      if (value && value.indexOf("<num>") !== -1) return (this.cachedEngineRespawnTemplate = value);
    } catch (_) {}
    return "Respawn in <num>";
  }
  static applyTimerStringToTextField(hud) {
    if (this.currentTimerStringObject.isNull()) return;
    const pointer = CombatHUD.getPrimaryHintTextField(hud);
    if (pointer.isNull()) return;
    const field = new TextField(pointer);
    field.setStringObject(this.currentTimerStringObject);
    field.setAllowColorCodes(true);
    field.color = this.colorForDeadCount(this.deathTimestampsMs.length);
    CombatHUD.setPrimaryHintActive(hud, true);
    CombatHUD.setSecondaryHintActive(hud, false);
  }
  static colorForDeadCount(count) {
    return count >= 2 ? 0xffcc0000 : 0xffed3400;
  }
  static updateTimerString(text) {
    if (text !== this.lastFormattedText || this.currentTimerStringObject.isNull()) {
      this.clearTimerString();
      this.currentTimerStringObject = StringObject.create(text);
      this.lastFormattedText = text;
    }
  }
  static clearTimerString() {
    if (!this.currentTimerStringObject.isNull()) {
      StringObject.clear(this.currentTimerStringObject);
      this.currentTimerStringObject = NULL;
      this.lastFormattedText = "";
    }
  }
  static resetTrackingState() {
    this.deathTimestampsMs = [];
    this.lastObservedAliveTeammateCount = -1;
    this.clearTimerString();
  }
  static isRedirectableTid(pointer) {
    if (pointer.isNull()) return false;
    const tid = pointer.readCString();
    return tid !== null && REDIRECTABLE_TIDS.has(tid);
  }
  static countAliveTeammates(modePointer) {
    const mode = new LogicBattleModeClient(modePointer),
      objects = mode.getGameObjects(),
      array = objects.getArray();
    if (array.isNull()) return 0;
    const count = objects.getItemsCount(),
      ownPlayer = mode.ownPlayerIndex | 0,
      ownTeam = mode.ownPlayerTeam | 0;
    let alive = 0;
    for (let i = 0; i < count; i++) {
      const pointer = array.add(i * Process.pointerSize).readPointer();
      if (pointer.isNull()) continue;
      const character = new LogicCharacterClient(pointer);
      if (!character.isCharacter()) break;
      if (
        character.playerIndex !== ownPlayer &&
        character.teamIndex === ownTeam &&
        character.isAliveHero()
      )
        alive++;
    }
    return alive;
  }
}
AllyRespawnTimer.deathTimestampsMs = [];
AllyRespawnTimer.lastObservedAliveTeammateCount = -1;
AllyRespawnTimer.currentMatchModeIndex = -1;
AllyRespawnTimer.currentTimerStringObject = NULL;
AllyRespawnTimer.lastFormattedText = "";
AllyRespawnTimer.cachedEngineRespawnTemplate = null;
AllyRespawnTimer.patched = false;
exports.AllyRespawnTimer = AllyRespawnTimer;
