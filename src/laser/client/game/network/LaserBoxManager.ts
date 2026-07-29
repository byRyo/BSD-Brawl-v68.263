// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const updateManifest = Libg.offset(8347856, 8022732);
const show = Libg.offset(8348092, 8022880);
const hide = new NativeFunction(Libg.offset(8334888, 8014864), "void", ["pointer"]);
const instance = Libg.offset(19845640, 18155128);
const webview = Libg.offset(19845472, 18155120);
const enable = new NativeFunction(Libg.offset(6080972, 6054692), "void", ["pointer"]);
const activate = new NativeFunction(Libg.offset(6081932, 6055400), "void", ["pointer"]);
const webviewOffset = LogicMemory.offset(8);
const alpha = LogicMemory.offset(208),
  x = LogicMemory.offset(212),
  y = LogicMemory.offset(216);
const width = LogicMemory.offset(220),
  height = LogicMemory.offset(224);
const tabsReturn1 = Libg.offset(9352688, 8858528),
  tabsReturn2 = Libg.offset(9352832, 8858624);
class LaserBoxManager {
  static getInstance() {
    return instance.readPointer();
  }
  static getWebview() {
    const value = this.getInstance();
    return value.isNull() ? NULL : value.add(webviewOffset).readPointer();
  }
  static updateManifest() {
    const value = webview.readPointer();
    if (!value.isNull()) updateManifest(value);
  }
  static showWebview() {
    const value = this.getWebview();
    if (!value.isNull()) {
      value.add(alpha).writeFloat(1);
      enable(value);
      activate(value);
    }
  }
  static hideWebview() {
    const value = this.getWebview();
    if (!value.isNull()) {
      value.add(alpha).writeFloat(0);
      value.add(x).writeFloat(0);
      value.add(y).writeFloat(0);
      value.add(width).writeFloat(0);
      value.add(height).writeFloat(0);
      hide(value);
    }
  }
  static patch() {
    const callback = function (retval) {
      if (
        LaserBoxManager.forceTabsAvailable &&
        (this.returnAddress.equals(tabsReturn1) || this.returnAddress.equals(tabsReturn2))
      )
        retval.replace(ptr(1));
    };
    Interceptor.attach(show, { onLeave: callback });
    Interceptor.attach(hide, { onLeave: callback });
  }
}
LaserBoxManager.forceTabsAvailable = false;
exports.LaserBoxManager = LaserBoxManager;
