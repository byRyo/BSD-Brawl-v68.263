// @ts-nocheck
const { Libg } = require("../../../../../../lib/Libg");

const showPopupNative = new NativeFunction(Libg.offset(6257684, 6195076), "void", ["pointer"]);
const getInstanceNative = new NativeFunction(Libg.offset(6213264, 5245480), "pointer", []);
const doStartReplayAddress = Libg.offset(6256368, 6194036);
const doStartReplayNative = new NativeFunction(doStartReplayAddress, "bool", [
  "pointer",
  "uint64",
  "uint64",
]);
const doStartSharedReplayAddress = Libg.offset(6256580, 6194244);
const doStartSharedReplayNative = new NativeFunction(doStartSharedReplayAddress, "bool", [
  "pointer",
  "pointer",
]);
const doStartSpectateNative = new NativeFunction(Libg.offset(6257172, 6194608), "bool", [
  "pointer",
  "pointer",
]);

class AllianceManager {
  static getInstance() {
    return getInstanceNative();
  }
  static showPopup(popup) {
    showPopupNative(popup.instance ?? popup);
  }

  static doStartReplay(high, low) {
    const instance = this.getInstance();
    return !instance.isNull() && doStartReplayNative(instance, high, low);
  }

  static doStartSharedReplay(replay) {
    const instance = this.getInstance();
    return !instance.isNull() && doStartSharedReplayNative(instance, replay);
  }

  static doStartSpectate(player) {
    const instance = this.getInstance();
    return !instance.isNull() && doStartSpectateNative(instance, player);
  }
}

AllianceManager.doStartReplayAddr = doStartReplayAddress;
AllianceManager.doStartSharedReplayAddr = doStartSharedReplayAddress;
exports.AllianceManager = AllianceManager;
