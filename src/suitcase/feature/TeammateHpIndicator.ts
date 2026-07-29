// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeammateHpIndicator = void 0;
const Config_1 = require("../config/Config");
const BattleMode_1 = require("../../laser/client/game/state/battlemode/BattleMode");
const LogicGameModeUtil_1 = require("../../laser/client/logic/data/LogicGameModeUtil");
const LogicCharacterClient_1 = require("../../laser/client/logic/battle/LogicCharacterClient");
const LogicBattleModeClient_1 = require("../../laser/client/logic/mode/LogicBattleModeClient");
const MovieClip_1 = require("../../laser/titan/client/common/flash/MovieClip");
const ColorTransform_1 = require("../../laser/titan/client/common/flash/ColorTransform");
const CombatHUD_1 = require("../../laser/client/game/gui/CombatHUD");
const ARROW = "arrow",
  CRITICAL = 0.25,
  PULSE = 600,
  YELLOW = 0.4,
  COLOR_SCALE = 255,
  MIN_RED = 0.4;
class TeammateHpIndicator {
  static patch() {
    if (!this.patched) {
      this.patched = true;
      CombatHUD_1.CombatHUD.addOffscreenIndicatorListener((a, b, c, d) => {
        if (Config_1.Config.config.TeammateHPIndicator)
          try {
            this.colorizeArrowForTeammate(a, b, c, d);
          } catch (_) {}
      });
    }
  }
  static colorizeArrowForTeammate(a, b, clip, index) {
    if (clip.isNull()) return;
    const ptr = BattleMode_1.BattleMode.getLogicBattleModeClient();
    if (ptr.isNull() || !this.isTeamShowdownCached(ptr)) return;
    const teammate = this.resolveTeammateForArrow(ptr, a, b, index);
    if (teammate === null) return;
    const character = new LogicCharacterClient_1.LogicCharacterClient(teammate),
      max = character.maxHitPoints;
    if (max <= 0) return;
    const arrow = new MovieClip_1.MovieClip(clip).getChildByName(ARROW);
    if (!arrow) return;
    const ratio = Math.max(0, Math.min(1, character.hitPoints / max));
    const [r, g, bl] = this.colorForHealthRatio(ratio);
    ColorTransform_1.ColorTransform.setColor(arrow.instance, r, g, bl, COLOR_SCALE);
  }
  static isTeamShowdownCached(ptr) {
    const mode = new LogicBattleModeClient_1.LogicBattleModeClient(ptr),
      index = mode.modeIndex;
    if (index !== this.cachedModeIndex) {
      this.cachedModeIndex = index;
      const util = mode.getGameModeUtil();
      this.cachedIsTeamShowdown =
        !util.isNull() && LogicGameModeUtil_1.LogicGameModeUtil.isShowdownLikeMode(util);
    }
    return this.cachedIsTeamShowdown;
  }
  static resolveTeammateForArrow(ptr, team, own, index) {
    const list = this.collectAliveTeammates(ptr, team, own);
    if (!list.length) return null;
    if (list.length === 1) return list[0];
    return list[index] ?? list[list.length - 1];
  }
  static collectAliveTeammates(ptr, team, own) {
    const objects = new LogicBattleModeClient_1.LogicBattleModeClient(ptr).getGameObjects(),
      array = objects.getArray();
    if (array.isNull()) return [];
    const result = [];
    for (let i = 0; i < objects.getItemsCount(); i++) {
      const p = array.add(i * Process.pointerSize).readPointer();
      if (p.isNull()) continue;
      const c = new LogicCharacterClient_1.LogicCharacterClient(p);
      if (!c.isCharacter()) break;
      if (!p.equals(own) && c.teamIndex === team && c.isAliveHero()) result.push(p);
    }
    return result;
  }
  static colorForHealthRatio(ratio) {
    if (ratio <= CRITICAL) return this.criticalPulseColor();
    const t = (ratio - CRITICAL) / 0.75;
    if (t > YELLOW) return [Math.round(COLOR_SCALE * (1 - t) * 2), COLOR_SCALE, 0];
    return [COLOR_SCALE, Math.round(COLOR_SCALE * t * 2), 0];
  }
  static criticalPulseColor() {
    const phase = (Date.now() % PULSE) / PULSE,
      p = 0.5 + 0.5 * Math.sin(2 * phase * Math.PI),
      r = MIN_RED + 0.6 * p;
    return [Math.round(COLOR_SCALE * r), 0, 0];
  }
}
exports.TeammateHpIndicator = TeammateHpIndicator;
TeammateHpIndicator.patched = false;
TeammateHpIndicator.cachedModeIndex = -1;
TeammateHpIndicator.cachedIsTeamShowdown = false;
