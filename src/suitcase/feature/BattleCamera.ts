// @ts-nocheck
class BattleCamera {
  static setNextMode() {
    this.mode = (this.mode + 1) % 4;
  }
  static toggleZoom() {
    this.zoomMultiplier = this.zoomMultiplier === 1 ? 0.6 : 1;
  }
  static reset() {
    this.zoomMultiplier = 1;
    this.cameraXOffset = this.cameraYOffset = this.cameraZOffset = 0;
    this.targetXOffset = this.targetYOffset = this.tiltOffset = 0;
  }
}
BattleCamera.mode = 0;
BattleCamera.zoomMultiplier = 1;
BattleCamera.cameraXOffset = BattleCamera.cameraYOffset = BattleCamera.cameraZOffset = 0;
BattleCamera.targetXOffset = BattleCamera.targetYOffset = BattleCamera.tiltOffset = 0;
exports.BattleCamera = BattleCamera;