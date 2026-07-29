// @ts-nocheck
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicData } = require("./LogicData");

const variationOffset = LogicMemory.offset(84);
const disabledFlagsOffset = LogicMemory.offset(88);
const bannerSwfOffset = LogicMemory.offset(164);
const bannerExportOffset = LogicMemory.offset(180);
const itemClaimDelayOffset = LogicMemory.offset(720);
const veryLargeMapOffset = LogicMemory.offset(724);
const spectateAfterGameOverOffset = LogicMemory.offset(725);
const spectateAfterDeathOffset = LogicMemory.offset(726);
const bossFightOffset = LogicMemory.offset(831);

class LogicGameModeVariationData extends LogicData {
  getVariation() {
    return LogicGameModeVariationData.getVariation(this.instance);
  }
  get isEnabled() {
    return !(1 & this.readU8(disabledFlagsOffset));
  }
  get hasBannerOverride() {
    return this.readU32(bannerSwfOffset) !== 0 && this.readU32(bannerExportOffset) !== 0;
  }
  get itemClaimDelaySeconds() {
    return this.readU32(itemClaimDelayOffset);
  }
  get isClaimStarsWithDelay() {
    return this.readS32(itemClaimDelayOffset) > 0;
  }
  get isPlayedOnVeryLargeMap() {
    return this.readBoolByte(veryLargeMapOffset);
  }
  get spectateAfterGameOver() {
    return this.readBoolByte(spectateAfterGameOverOffset);
  }
  get spectateAfterDeath() {
    return this.readBoolByte(spectateAfterDeathOffset);
  }
  get isTypeOfBossFight() {
    return this.readBoolByte(bossFightOffset);
  }

  static getVariation(instance) {
    return instance.add(variationOffset).readU32();
  }
}

exports.LogicGameModeVariationData = LogicGameModeVariationData;
