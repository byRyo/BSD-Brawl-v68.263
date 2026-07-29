// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicBattleModeClient } = require("../../logic/mode/LogicBattleModeClient");
const { BattleCamera } = require("../../../../suitcase/feature/BattleCamera");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { CombatHUD } = require("../gui/CombatHUD");

const updateHook = Libg.offset(8746848, 8341132);
const mapOrientationAddress = Libg.offset(19843992, 18154784);
const characterXOffset = LogicMemory.offset(48);
const characterYOffset = LogicMemory.offset(52);
const tileMapWidthOffset = LogicMemory.offset(204);
const tileMapHeightOffset = LogicMemory.offset(208);
const cameraModeOffset = LogicMemory.offset(2316);

class CameraParameters {
  static patch() {
    Interceptor.attach(updateHook, function () {
      const camera = this.context.x19;
      const ownCharacter = LogicBattleModeClient.getOwnCharacter();
      let ownX;
      let ownY;
      if (!ownCharacter.instance.isNull()) {
        ownX = ownCharacter.instance.add(characterXOffset).readU32();
        ownY = ownCharacter.instance.add(characterYOffset).readU32();
        if (CombatHUD.coordinates) {
          CombatHUD.coordinates.textField.setTextScaleIfNecessary(
            "X: ".concat(
              Math.round(ownX / 300).toString(),
              "\nY: ",
              Math.round(ownY / 300).toString(),
            ),
          );
        }
      }

      switch (BattleCamera.mode) {
        case 0:
          camera.add(cameraModeOffset).writeS32(0);
          CameraParameters.applyZoomToCameraZ(camera);
          break;
        case 1:
          camera.add(cameraModeOffset).writeS32(0);
          if (!ownCharacter.instance.isNull()) {
            const target = [ownX, -ownY];
            const cameraY =
              camera.add(CameraParameters.fields[1]).readFloat() -
              ownY -
              camera.add(CameraParameters.fields[4]).readFloat();
            const cameraX =
              camera.add(CameraParameters.fields[0]).readFloat() -
              camera.add(CameraParameters.fields[3]).readFloat() +
              target[0];
            const position = [cameraX, cameraY];
            camera.add(CameraParameters.fields[2]).writeFloat(4000 * BattleCamera.zoomMultiplier);
            camera.add(CameraParameters.fields[5]).writeFloat(300);
            camera.add(CameraParameters.fields[0]).writeFloat(position[0]);
            camera.add(CameraParameters.fields[1]).writeFloat(position[1]);
            camera.add(CameraParameters.fields[3]).writeFloat(target[0]);
            camera.add(CameraParameters.fields[4]).writeFloat(target[1]);
          }
          break;
        case 2: {
          camera.add(cameraModeOffset).writeS32(0);
          const direction = mapOrientationAddress.readU8() ? 0.58779 : -0.58779;
          const tileMap = LogicBattleModeClient.getTileMap();
          const width = tileMap.add(tileMapWidthOffset).readU32();
          const height = tileMap.add(tileMapHeightOffset).readU32();
          this.context.s2 = 0.5 * height;
          this.context.s3 = 7.5 * height;
          camera.add(CameraParameters.fields[5]).writeFloat(0);
          camera.add(CameraParameters.fields[4]).writeFloat(-0.5 * height);
          camera.add(CameraParameters.fields[0]).writeFloat(0.5 * width);
          camera.add(CameraParameters.fields[3]).writeFloat(0.5 * width);
          camera
            .add(CameraParameters.fields[2])
            .writeFloat(4.0451 * height * BattleCamera.zoomMultiplier);
          camera.add(CameraParameters.fields[1]).writeFloat(-0.5 * height + 5 * height * direction);
          break;
        }
        case 3:
          camera.add(cameraModeOffset).writeS32(4);
          CameraParameters.applyZoomToCameraZ(camera);
          break;
      }
      CameraParameters.applyCameraOffsets(camera);
    });
  }

  static applyZoomToCameraZ(camera) {
    if (BattleCamera.zoomMultiplier === 1) return;
    const value = camera.add(this.fields[2]).readFloat();
    camera.add(this.fields[2]).writeFloat(value * BattleCamera.zoomMultiplier);
  }

  static addFloatField(camera, field, value) {
    if (value === 0) return;
    const pointer = camera.add(this.fields[field]);
    pointer.writeFloat(pointer.readFloat() + value);
  }

  static applyCameraOffsets(camera) {
    if (BattleCamera.mode === 1) {
      this.addFloatField(camera, 0, BattleCamera.cameraXOffset);
      this.addFloatField(camera, 1, BattleCamera.cameraYOffset);
      this.addFloatField(camera, 2, BattleCamera.cameraZOffset);
      this.addFloatField(camera, 3, BattleCamera.cameraXOffset);
      this.addFloatField(camera, 4, BattleCamera.cameraYOffset);
      this.addFloatField(camera, 5, BattleCamera.tiltOffset);
      return;
    }
    this.addFloatField(camera, 0, BattleCamera.cameraXOffset);
    this.addFloatField(camera, 1, BattleCamera.cameraYOffset);
    this.addFloatField(camera, 2, BattleCamera.cameraZOffset);
    this.addFloatField(camera, 3, BattleCamera.targetXOffset);
    this.addFloatField(camera, 4, BattleCamera.targetYOffset);
    this.addFloatField(camera, 5, BattleCamera.tiltOffset);
  }
}

CameraParameters.fields = [2248, 2252, 2256, 2260, 2264, 2268];
exports.CameraParameters = CameraParameters;
