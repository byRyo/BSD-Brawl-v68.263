// @ts-nocheck
const { LogicMemory } = require("../logic/LogicMemory");
const { BattleMode } = require("../../laser/client/game/state/battlemode/BattleMode");
const { LogicBattleModeClient } = require("../../laser/client/logic/mode/LogicBattleModeClient");
const { StageDebugText } = require("./StageDebugText");
const currentLatencyOffset = LogicMemory.offset(48);
const maxLatencyOffset = LogicMemory.offset(52);
const badWifiTicksOffset = LogicMemory.offset(68);
const droppedVisualUpdatesOffset = LogicMemory.offset(340);

class BattleNetStatsOverlay {
  static toggle() {
    if (this.overlay) {
      this.overlay.destroy();
      this.overlay = null;
      return;
    }
    if (!BattleMode.getInstance().isNull())
      this.overlay = StageDebugText.create({ x: 20, y: 100, fontSize: 12 });
  }
  static update() {
    if (!this.overlay) return;
    try {
      if (BattleMode.getInstance().isNull()) {
        this.overlay.setText("not in battle");
        return;
      }
      const input = BattleMode.clientInputManager;
      if (input.isNull()) {
        this.overlay.setText("no input manager");
        return;
      }
      const current = input.add(currentLatencyOffset).readU32();
      const max = input.add(maxLatencyOffset).readU32();
      const badWifi = input.add(badWifiTicksOffset).readU32();
      const mode = LogicBattleModeClient.getInstance();
      const dropped = mode.isNull() ? 0 : mode.add(droppedVisualUpdatesOffset).readU32();
      this.overlay.setText(
        `lat curr: ${current} ms\nlat max: ${max} ms\ndropped VU: ${dropped}\nbad wifi ticks: ${badWifi}`,
      );
    } catch (_) {}
  }
}
BattleNetStatsOverlay.overlay = null;
exports.BattleNetStatsOverlay = BattleNetStatsOverlay;
