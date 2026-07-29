// @ts-nocheck
const { Libc } = require("../../../../lib/Libc");
const { Libg } = require("../../../../lib/Libg");
const { LogicRandomRewardContainerData } = require("../data/LogicRandomRewardContainerData");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicArrayList } = require("../data/LogicArrayList");

const offersOffset = LogicMemory.offset(8);
const randomRewardsOffset = LogicMemory.offset(24);
const typeOffset = LogicMemory.offset(40);
const countOffset = LogicMemory.offset(44);
const ctor = new NativeFunction(Libg.offset(10523844, 11210804), "void", ["pointer"]);

function syncList(instance, offset, list) {
  instance.add(offset).writePointer(list.getArray());
  instance.add(offset + 8).writeInt(list.getCapacity());
  instance.add(offset + 12).writeInt(list.getItemsCount());
}

class LogicClaimableRandomReward {
  constructor(instance, count) {
    if (instance instanceof NativePointer) {
      this.instance = instance;
      return;
    }
    this.instance = Libc.malloc(LogicClaimableRandomReward.allocationSize);
    ctor(this.instance);
    this.array = new LogicArrayList();
    syncList(this.instance, offersOffset, this.array);
    this.randomRewardsArray = new LogicArrayList();
    syncList(this.instance, randomRewardsOffset, this.randomRewardsArray);
    if (instance !== undefined) this.instance.add(typeOffset).writeInt(instance);
    if (count !== undefined) this.instance.add(countOffset).writeInt(count);
  }
  setRandomRewardContainerData(value) {
    this.instance.writePointer(value.instance);
  }
  getRandomRewardContainerData() {
    return new LogicRandomRewardContainerData(this.instance.readPointer());
  }
  addRandomReward(value) {
    this.randomRewardsArray.addElement(ptr(value.getGlobalID()));
    syncList(this.instance, randomRewardsOffset, this.randomRewardsArray);
  }
  addGemOffer(value) {
    this.array.addElement(value.instance);
    syncList(this.instance, offersOffset, this.array);
  }
}
LogicClaimableRandomReward.allocationSize = 48;
exports.LogicClaimableRandomReward = LogicClaimableRandomReward;
