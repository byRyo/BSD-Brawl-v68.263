// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { GUIContainer } = require("../../../../titan/client/common/flash/GUIContainer");
const {
  BattleEndInstantExitButton,
} = require("../../../../../suitcase/flash/button/BattleEndInstantExitButton");
const { Config } = require("../../../../../suitcase/config/Config");
const { Breadcrumbs } = require("../../../../../suitcase/debug/Breadcrumbs");

const BattleEndPopup_ctor = Libg.offset(6543328, 6450664);
const BattleEndPopup_proceedToNextState = new NativeFunction(
  Libg.offset(6624672, 6509456),
  "void",
  ["pointer", "int"],
);
const BattleEndPopup_update = Libg.offset(6618252, 6504244);

class BattleEndPopup {
  static instance;
  static proceedToNextState(state) {
    BattleEndPopup_proceedToNextState(this.instance.instance, state);
  }
  static patch() {
    Interceptor.attach(BattleEndPopup_ctor, {
      onEnter(args) {
        BattleEndPopup.instance = new GUIContainer(args[0]);
        Breadcrumbs.push("BattleEndPopup::ctor");
      },
      onLeave() {
        if (Config.config.BattleEndInstantExit) {
          const button = new BattleEndInstantExitButton();
          BattleEndPopup.instance.getMovieClip().addChild(button);
        }
      },
    });
    Interceptor.attach(BattleEndPopup_update, {
      onLeave(retval) {
        if (Config.config.BattleEndInstantExit) retval.replace(ptr(0));
      },
    });
  }
}

module.exports = { BattleEndPopup };
