// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { Config } = require("../../../../suitcase/config/Config");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicData } = require("./LogicData");
const { LogicEffectData } = require("./LogicEffectData");

const castingRangeAddress = Libg.offset(11585776, 10673316);
const castingRangeColumnAddress = Libg.offset(19137392, 17801224);
const attackEffectOffset = LogicMemory.offset(272);
const castingEffectOffset = LogicMemory.offset(280);

class LogicSkillData extends LogicData {
  getAttackEffect() {
    return this.readWrappedPointer(attackEffectOffset, (instance) => new LogicEffectData(instance));
  }
  getCastingEffect() {
    return this.readWrappedPointer(
      castingEffectOffset,
      (instance) => new LogicEffectData(instance),
    );
  }
  getCastingRangeTiles() {
    return this.getIntValueAt(castingRangeColumnAddress.readInt());
  }
  static getCastingRangeTiles(instance) {
    return LogicData.getIntValueAt(instance, castingRangeColumnAddress.readInt());
  }
  static patch() {
    Interceptor.attach(castingRangeAddress, {
      onEnter(args) {
        this.shouldReplaceTo26 = !(
          !Config.config.BetterRange || LogicData.getName(args[0]) !== "KickerDudeWeapon"
        );
      },
      onLeave(retval) {
        if (this.shouldReplaceTo26) retval.replace(ptr(26));
      },
    });
  }
}
exports.LogicSkillData = LogicSkillData;
