// @ts-nocheck
const { LogicData } = require("../../laser/client/logic/data/LogicData");
const { LogicCharacterData } = require("../../laser/client/logic/data/LogicCharacterData");
const { LogicCharacterClient } = require("../../laser/client/logic/battle/LogicCharacterClient");
const { GLOverlay } = require("./GLOverlay");
class EnemyTracer {
  static resetErrors() {
    this.errorCount = 0;
  }
  static patch() {
    GLOverlay.addRenderer("EnemyTracer", (array, count, team, player) =>
      this.render(array, count, team, player),
    );
  }
  static render(array, count, team, player) {
    const own = this.findOwnCharacterPosition(array, count, player);
    if (!own) return;
    for (let i = 0; i < count && this.errorCount < 3; i++) {
      try {
        const pointer = array.add(8 * i).readPointer();
        if (pointer.isNull() || !this.isHeroObject(pointer)) continue;
        const character = new LogicCharacterClient(pointer);
        if (character.teamIndex === team || (character.x === 0 && character.y === 0)) continue;
        const dx = own.x - character.x,
          dy = own.y - character.y;
        const range = this.getAttackRangeGameUnits(pointer);
        if (dx * dx + dy * dy <= range * range) GLOverlay.setDrawColor(1, 0.2, 0.2, 0.9);
        else GLOverlay.setDrawColor(1, 0.9, 0.2, 0.7);
        GLOverlay.drawLineSegment(
          own.x,
          -own.y,
          own.z + 100,
          character.x,
          -character.y,
          character.z + 100,
        );
      } catch (_) {
        this.errorCount++;
      }
    }
  }
  static findOwnCharacterPosition(array, count, playerIndex) {
    for (let i = 0; i < count; i++)
      try {
        const pointer = array.add(8 * i).readPointer();
        if (pointer.isNull() || !this.isHeroObject(pointer)) continue;
        const character = new LogicCharacterClient(pointer);
        if (character.playerIndex === playerIndex)
          return { x: character.x, y: character.y, z: character.z };
      } catch (_) {
        this.errorCount++;
      }
    return null;
  }
  static isHeroObject(pointer) {
    if (this.errorCount >= 3) return false;
    try {
      const data = new LogicCharacterClient(pointer).dataPtr;
      if (data.isNull() || new LogicData(data).getClassID() !== 16) return false;
      const result = new LogicCharacterData(data).isHero();
      this.errorCount = 0;
      return result;
    } catch (_) {
      this.errorCount++;
      return false;
    }
  }
  static getAttackRangeGameUnits(pointer) {
    try {
      const data = new LogicCharacterClient(pointer).dataPtr;
      if (data.isNull() || new LogicData(data).getClassID() !== 16) return 0;
      const skill = new LogicCharacterData(data).weaponSkill;
      return skill ? skill.getCastingRangeTiles() * 100 : 0;
    } catch (_) {
      return 0;
    }
  }
}
EnemyTracer.errorCount = 0;
exports.EnemyTracer = EnemyTracer;
