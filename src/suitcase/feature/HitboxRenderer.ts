// @ts-nocheck
const { BSDPlusManager } = require("../validation/BSDPlusManager");
const { GLOverlay } = require("./GLOverlay");
const { LogicCharacterData } = require("../../laser/client/logic/data/LogicCharacterData");
const { LogicCharacterClient } = require("../../laser/client/logic/battle/LogicCharacterClient");
class HitboxRenderer {
  static patch() {
    GLOverlay.addRenderer("HitboxRenderer", (array, count, team) =>
      this.render(array, count, team),
    );
  }
  static render(array, count, team) {
    if (!BSDPlusManager.isBSDPlusEnabled) return;
    for (let i = 0; i < count; i++) {
      const pointer = array.add(8 * i).readPointer();
      if (pointer.isNull()) continue;
      const character = new LogicCharacterClient(pointer);
      if (character.x === 0 && character.y === 0) continue;
      const stats = this.readObjectStats(pointer);
      if (stats.isHeroCharacter)
        GLOverlay.setDrawColor(
          character.teamIndex === team ? 0 : 1,
          character.teamIndex === team ? 1 : 0,
          0,
          1,
        );
      else GLOverlay.setDrawColor(0.2, 0.5, 1, 0.8);
      GLOverlay.drawWireframeCube(
        character.x - stats.collisionRadius,
        -character.y - stats.collisionRadius,
        character.z,
        character.x + stats.collisionRadius,
        -character.y + stats.collisionRadius,
        character.z + stats.modelHeight,
      );
    }
  }
  static readObjectStats(pointer) {
    let collisionRadius = 150,
      modelHeight = 400,
      isHeroCharacter = false;
    try {
      const dataPointer = new LogicCharacterClient(pointer).dataPtr;
      if (!dataPointer.isNull()) {
        const data = new LogicCharacterData(dataPointer);
        const radius = data.getCollisionRadius();
        if (radius > 0 && radius < 400) collisionRadius = radius;
        const scale = data.getScale();
        if (scale > 300 && scale < 2000) modelHeight = scale * 0.1;
        isHeroCharacter = data.isHero();
      }
    } catch (_) {}
    return { collisionRadius, modelHeight, isHeroCharacter };
  }
}
exports.HitboxRenderer = HitboxRenderer;
