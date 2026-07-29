// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Libc } = require("../../../../../lib/Libc");
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const { GenericPopup } = require("../../../../titan/client/common/flash/GenericPopup");
const { GUI } = require("../GUI");

const FamePopup_ctor = new NativeFunction(Libg.offset(7355556, 7161304), "void", ["pointer"]);
const FamePopup_setFame = new NativeFunction(Libg.offset(7356616, 7162268), "void", [
  "pointer",
  "int",
]);
const fameValueOffset = LogicMemory.offset(500, 500);

class FamePopup extends GenericPopup {
  static allocationSize = 520;
  static overrideInstance = NULL;
  static overrideFame = 0;

  constructor() {
    const instance = Libc.calloc(FamePopup.allocationSize, 1);
    FamePopup_ctor(instance);
    super(instance);
  }

  static patch() {
    Interceptor.attach(FamePopup_setFame, {
      onEnter(args) {
        if (!FamePopup.overrideInstance.isNull() && args[0].equals(FamePopup.overrideInstance)) {
          this.target = args[0];
          this.realFame = args[1].toInt32();
          args[1] = ptr(FamePopup.overrideFame);
        }
      },
      onLeave() {
        if (this.target) this.target.add(fameValueOffset).writeInt(this.realFame);
      },
    });
  }

  static show(fame) {
    const popup = new FamePopup();
    FamePopup.overrideInstance = popup.instance;
    FamePopup.overrideFame = fame;
    GUI.showPopup(popup.instance, false, false, true);
    FamePopup_setFame(popup.instance, fame);
  }
}

module.exports = { FamePopup };
