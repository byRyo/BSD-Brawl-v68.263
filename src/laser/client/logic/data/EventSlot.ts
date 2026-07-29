// @ts-nocheck
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicLocationData } = require("./LogicLocationData");

const slotIndexOffset = LogicMemory.offset(4);
const xpRewardOffset = LogicMemory.offset(20);
const claimLevelOffset = LogicMemory.offset(24);
const locationOffset = LogicMemory.offset(40);

const CLAIM_LEVEL_VIEWED = 1;
const CLAIM_LEVEL_XP_CLAIMED = 2;

class EventSlot {
  static CLAIM_LEVEL_XP_CLAIMED = CLAIM_LEVEL_XP_CLAIMED;
  constructor(instance) {
    this.instance = instance;
  }

  get slotIndex() {
    return this.instance.add(slotIndexOffset).readInt();
  }

  get xpReward() {
    return this.instance.add(xpRewardOffset).readInt();
  }

  get claimLevel() {
    return this.instance.add(claimLevelOffset).readInt();
  }

  getLocation() {
    const instance = this.instance.add(locationOffset).readPointer();
    return instance.isNull() ? null : new LogicLocationData(instance);
  }
}

exports.EventSlot = EventSlot;
exports.CLAIM_LEVEL_VIEWED = CLAIM_LEVEL_VIEWED;
exports.CLAIM_LEVEL_XP_CLAIMED = CLAIM_LEVEL_XP_CLAIMED;
