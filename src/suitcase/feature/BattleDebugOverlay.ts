// @ts-nocheck
const { LogicBattleModeClient } = require("../../laser/client/logic/mode/LogicBattleModeClient");
const { BattleMode } = require("../../laser/client/game/state/battlemode/BattleMode");
const { StageDebugText } = require("./StageDebugText");

class BattleDebugOverlay {
  static toggle() {
    if (this.overlay) {
      this.overlay.destroy();
      this.overlay = null;
      return;
    }
    if (!BattleMode.getInstance().isNull())
      this.overlay = StageDebugText.create({ x: 20, y: 60, fontSize: 14 });
  }

  static update() {
    if (!this.overlay) return;
    if (BattleMode.getInstance().isNull()) {
      this.overlay.setText("not in battle");
      return;
    }
    try {
      const own = LogicBattleModeClient.getOwnCharacter();
      if (own.instance.isNull()) {
        this.overlay.setText("");
        return;
      }
      this.overlay.setText(
        `pos: ${(own.x / 300).toFixed(1)}, ${(own.y / 300).toFixed(1)}\nplayer: ${own.index}`,
      );
    } catch (_) {}
  }
}
BattleDebugOverlay.overlay = null;
exports.BattleDebugOverlay = BattleDebugOverlay;
