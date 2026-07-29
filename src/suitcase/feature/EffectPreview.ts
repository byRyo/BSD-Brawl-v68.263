// @ts-nocheck
const { BattleMode } = require("../../laser/client/game/state/battlemode/BattleMode");
const { BattleScreen } = require("../../laser/client/game/screen/battle/BattleScreen");
const { LogicBattleModeClient } = require("../../laser/client/logic/mode/LogicBattleModeClient");
const { LogicDataTables } = require("../../laser/client/logic/data/LogicDataTables");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { Logcat } = require("../debug/Logcat");
class EffectPreview {
  static show() {
    const error = this.tryShow();
    if (error !== null) {
      GUI.showFloaterTextAtDefaultPosition(`EFFECT_PREVIEW: ${error}`);
      Logcat.logDebug(`EffectPreview aborted: ${error}`);
    }
  }
  static tryShow() {
    if (BattleMode.getInstance().isNull()) return "enter a battle first";
    const screen = BattleScreen.getInstance();
    if (screen === undefined || screen.isNull()) return "BattleScreen not captured";
    const manager = BattleScreen.getGameObjectManager();
    if (manager.isNull()) return "GameObjectManager null";
    const table = LogicDataTables.getTable(LogicDataTables.table.Effects);
    const count = table.getItemCount();
    if (count < 1) return "effects table empty";
    const own = LogicBattleModeClient.getOwnCharacter();
    if (own.instance.isNull()) return "own character not spawned";
    const index = this.cursor % count;
    this.cursor = (this.cursor + 1) % count;
    const effect = table.getItemAt(index);
    if (!effect || effect.instance.isNull()) return `effect #${index} null`;
    const x = own.x,
      y = own.y - -900;
    manager.playEffect(effect, x, y);
    const name = effect.getName();
    GUI.showFloaterTextAtDefaultPosition(`[${index + 1}/${count}] ${name}`);
    Logcat.logDebug(`EffectPreview spawned effect #${index} "${name}" at (${x}, ${y})`);
    return null;
  }
}
EffectPreview.cursor = 0;
exports.EffectPreview = EffectPreview;
