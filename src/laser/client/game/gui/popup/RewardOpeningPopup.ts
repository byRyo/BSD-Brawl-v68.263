// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { LogicClaimableRandomReward } = require("../../../logic/home/LogicClaimableRandomReward");
const { Libc } = require("../../../../../lib/Libc");
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const {
  LogicRandomRewardContainerData,
} = require("../../../logic/data/LogicRandomRewardContainerData");
const { LogicDataTables } = require("../../../logic/data/LogicDataTables");
const { Config } = require("../../../../../suitcase/config/Config");

const RewardOpeningPopup_ctorAddress = Libg.offset(7930904, 7673644);
const RewardOpeningPopup_tapHandler = Libg.offset(7932120, 7674768);
const RewardOpeningPopup_touchHandler = Libg.offset(0, 7693836);
const RewardOpeningPopup_ctor = new NativeFunction(RewardOpeningPopup_ctorAddress, "void", [
  "pointer",
  "pointer",
  "pointer",
  "int",
]);
const RewardOpeningPopup_show = new NativeFunction(Libg.offset(7929032, 7672152), "void", [
  "pointer",
]);
const RewardOpeningPopup_setData = new NativeFunction(Libg.offset(7954168, 7686432), "void", [
  "pointer",
  "pointer",
  "int",
  "int",
]);
const containerDataOffset = LogicMemory.offset(32, 0);
const callbackFunctionOffset = LogicMemory.offset(0, 496);
const tapCountRegisterValue = 0;

class RewardOpeningPopup {
  static allocationSize = 1152;

  constructor(containerData, data, index = 0, visualType = 3) {
    this.instance = Libc.calloc(RewardOpeningPopup.allocationSize, 1);
    const claimable = RewardOpeningPopup.buildClaimable(containerData, index, visualType);
    RewardOpeningPopup_ctor(
      this.instance,
      claimable.instance,
      RewardOpeningPopup.buildEmptyCallback(),
      -1,
    );
    this.setData(data, index, visualType);
  }

  setData(data, index = 0, visualType = 0) {
    RewardOpeningPopup_setData(this.instance, data.instance, index, visualType);
  }
  static show(popup) {
    RewardOpeningPopup_show(popup.instance);
  }

  static buildClaimable(containerData, index, visualType) {
    const claimable = new LogicClaimableRandomReward(index, visualType);
    const data =
      typeof containerData === "number"
        ? LogicDataTables.getDataById(LogicDataTables.table.RandomRewardContainers, containerData)
        : containerData;
    claimable.setRandomRewardContainerData(data);
    return claimable;
  }

  static buildEmptyCallback() {
    const callback = Libc.malloc(32);
    callback.add(callbackFunctionOffset).writePointer(ptr(0));
    return callback;
  }

  static getContainerData(instance) {
    const data = instance.add(containerDataOffset).readPointer();
    return data.isNull() ? null : new LogicRandomRewardContainerData(data);
  }

  static patch() {
    const state = { value: null };
    this.captureClaimableFromCtor(state);
    this.skipTapCountInCtor(state);
    if (Process.platform === "darwin") this.forceDefaultOpenBranchOnTouch(state);
  }

  static captureClaimableFromCtor(state) {
    Interceptor.attach(RewardOpeningPopup_ctorAddress, {
      onEnter(args) {
        state.value = new LogicClaimableRandomReward(args[1]);
      },
    });
  }

  static skipTapCountInCtor(state) {
    Interceptor.attach(RewardOpeningPopup_tapHandler, function () {
      if (
        Config.config.InstantStarrDropOpening &&
        state.value !== null &&
        this.context.x8.toInt32() === 4
      )
        this.context.x8 = ptr(tapCountRegisterValue);
    });
  }

  static forceDefaultOpenBranchOnTouch(state) {
    Interceptor.attach(RewardOpeningPopup_touchHandler, {
      onEnter(args) {
        this.override = false;
        if (!Config.config.InstantStarrDropOpening || state.value === null) return;
        const instance = args[0];
        if (instance.isNull()) return;
        const data = RewardOpeningPopup.getContainerData(instance);
        if (data !== null) {
          this.containerData = data;
          this.originalVisualType = data.visualType;
          this.override = true;
          data.visualType = 0;
        }
      },
      onLeave() {
        if (this.override === true) this.containerData.visualType = this.originalVisualType;
      },
    });
  }
}

module.exports = { RewardOpeningPopup };
