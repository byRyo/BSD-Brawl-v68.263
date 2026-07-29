// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicData } = require("./LogicData");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicSkinData } = require("./LogicSkinData");
const { Config } = require("../../../../suitcase/config/Config");
const { LogicSkillData } = require("./LogicSkillData");

const LogicCharacterData_isDisabled = new NativeFunction(Libg.offset(11218604, 10382264), "bool", [
  "pointer",
]);
const LogicCharacterData_getCharacterType = new NativeFunction(
  Libg.offset(11218620, 10382280),
  "int",
  ["pointer"],
);
const disabledValueAddress = Libg.offset(19132112, 17795944);
const characterTypeOffset = LogicMemory.offset(432);
const projectileStartZOffset = LogicMemory.offset(444);
const flyingHeightOffset = LogicMemory.offset(452);
const speedOffset = LogicMemory.offset(464);
const autoAttackRangeOffset = LogicMemory.offset(468);
const scaleOffset = LogicMemory.offset(496);
const shadowScaleXOffset = LogicMemory.offset(500);
const shadowScaleYOffset = LogicMemory.offset(516);
const collisionRadiusOffset = LogicMemory.offset(528);
const healthBarOffsetYOffset = LogicMemory.offset(572);
const defaultSkinOffset = LogicMemory.offset(608);
const weaponSkillOffset = LogicMemory.offset(616);
const ultimateSkillOffset = LogicMemory.offset(624);
const overchargedUltimateSkillOffset = LogicMemory.offset(240);
const CHARACTER_TYPE_HERO = 0;
const CHARACTER_TYPE_MINION = 26;

class LogicCharacterData extends LogicData {
  isDisabled() {
    return this.getBooleanValueAt(disabledValueAddress.readInt());
  }

  isHero() {
    const type = this.readS32(characterTypeOffset);
    return type === CHARACTER_TYPE_HERO || type === CHARACTER_TYPE_MINION;
  }

  getCharacterType() {
    return this.readS32(characterTypeOffset);
  }

  getProjectileStartZ() {
    return this.readS32(projectileStartZOffset);
  }

  getFlyingHeight() {
    return this.readS32(flyingHeightOffset);
  }

  getSpeed() {
    return this.readS32(speedOffset);
  }

  getAutoAttackRange() {
    return this.readS32(autoAttackRangeOffset);
  }

  getScale() {
    return this.readFloat(scaleOffset);
  }

  getShadowScaleX() {
    return this.readFloat(shadowScaleXOffset);
  }

  getShadowScaleY() {
    return this.readFloat(shadowScaleYOffset);
  }

  getCollisionRadius() {
    return this.readS32(collisionRadiusOffset);
  }

  getHealthBarOffsetY() {
    return this.readS32(healthBarOffsetYOffset);
  }

  getDefaultSkin() {
    return new LogicSkinData(this.readPointer(defaultSkinOffset));
  }

  get weaponSkill() {
    return this.readWrappedPointer(weaponSkillOffset, (instance) => new LogicSkillData(instance));
  }

  get ultimateSkill() {
    return this.readWrappedPointer(ultimateSkillOffset, (instance) => new LogicSkillData(instance));
  }

  get overchargedUltimateSkill() {
    return this.readWrappedPointer(
      overchargedUltimateSkillOffset,
      (instance) => new LogicSkillData(instance),
    );
  }

  static patch() {
    Interceptor.replace(
      LogicCharacterData_isDisabled,
      new NativeCallback(
        (instance) => {
          if (
            new LogicCharacterData(instance).getName() === "NinjaFake" &&
            Config.config.HighlightLeonClone
          )
            return true;
          return LogicCharacterData_isDisabled(instance);
        },
        "bool",
        ["pointer"],
      ),
    );
    Interceptor.replace(
      LogicCharacterData_getCharacterType,
      new NativeCallback(
        (instance) => {
          if (
            new LogicCharacterData(instance).getName() === "NinjaFake" &&
            Config.config.HighlightLeonClone
          )
            return 255;
          return LogicCharacterData_getCharacterType(instance);
        },
        "int",
        ["pointer"],
      ),
    );
  }
}

exports.LogicCharacterData = LogicCharacterData;
