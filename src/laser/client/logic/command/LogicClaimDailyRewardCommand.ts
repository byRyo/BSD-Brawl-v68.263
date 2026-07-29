// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { Libc } = require("../../../../lib/Libc");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");

const ctor = new NativeFunction(Libg.offset(10935372, 10145264), "pointer", ["pointer"]);
const vtable = Libg.offset(18875080, 16914176);
const claimTypeOffset = LogicMemory.offset(28);
const rewardIndexOffset = LogicMemory.offset(32);
const allocationSize = 40;

class LogicClaimDailyRewardCommand {
  static create(claimType, rewardIndex) {
    const instance = Libc.malloc(allocationSize);
    instance.writeByteArray(new ArrayBuffer(allocationSize));
    instance.writePointer(vtable);
    ctor(instance);
    instance.add(claimTypeOffset).writeInt(claimType);
    instance.add(rewardIndexOffset).writeInt(rewardIndex);
    return instance;
  }
}
LogicClaimDailyRewardCommand.ClaimType = { MarkViewed: 1, ClaimXp: 2 };
exports.LogicClaimDailyRewardCommand = LogicClaimDailyRewardCommand;
