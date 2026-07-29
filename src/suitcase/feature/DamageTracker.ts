// @ts-nocheck
const { Character } = require("../../laser/client/game/gameobject/Character");
const { CombatHUD } = require("../../laser/client/game/gui/CombatHUD");
const { TextFieldHelper } = require("../../laser/titan/client/common/flash/TextFieldHelper");
const { LogicBattleModeClient } = require("../../laser/client/logic/mode/LogicBattleModeClient");
class DamageTracker {
  static reset() {
    this.entries = [];
  }
  static createTextField() {
    const field = TextFieldHelper.createTextTextField();
    field.x = 115;
    field.y = 70;
    field.color = 0xffffffff;
    field.fontOutline = true;
    field.fontSize = 13;
    field.text = "DPS: 0";
    this.textField = field;
    return field;
  }
  static colorForDps(dps) {
    if (dps >= 20000) return 0xffff00ff;
    if (dps >= 15000) return 0xffff4100;
    if (dps >= 10000) return 0xffffa500;
    if (dps >= 5000) return 0xffffff00;
    return 0xffffffff;
  }
  static patch() {
    Character.addFloatingNumberListener((character, damage) => {
      try {
        const own = LogicBattleModeClient.getOwnCharacter();
        if (!own.instance.isNull() && character.logic.index !== own.index)
          this.entries.push({ ts: Date.now(), dmg: -damage });
      } catch (_) {}
    });
    CombatHUD.addUpdateListener(() => {
      if (!this.textField) return;
      const cutoff = Date.now() - 1000;
      while (this.entries.length && this.entries[0].ts < cutoff) this.entries.shift();
      const dps = this.entries.reduce((sum, entry) => sum + entry.dmg, 0);
      this.textField.text = `DPS: ${dps}`;
      this.textField.color = this.colorForDps(dps);
    });
  }
}
DamageTracker.entries = [];
DamageTracker.textField = null;
exports.DamageTracker = DamageTracker;
