// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { StringObject } = require("../../../titan/client/native/StringObject");
const PopupBase = require("../../../titan/client/common/flash/PopupBase");
const { Libc } = require("../../../../lib/Libc");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");

const guiInstance = Libg.offset(19844072, 18154832);
const GUI_closeAllPopups = new NativeFunction(Libg.offset(6051228, 6035588), "void", ["pointer"]);
const GUI_showFloaterTextAtDefaultPosition = new NativeFunction(
  Libg.offset(6045628, 6032024),
  "void",
  ["pointer", "pointer", "int", "float"],
);
const GUI_showPopup = new NativeFunction(Libg.offset(6048604, 6033812), "void", [
  "pointer",
  "pointer",
  "int",
  "int",
  "int",
]);
const GUI_addDataGained = new NativeFunction(Libg.offset(6052288, 6036436), "pointer", [
  "pointer",
  "pointer",
  "uint",
  "int",
  "uchar",
  "pointer",
  "pointer",
  "float",
  "float",
  "float",
]);
const popupCountOffset = LogicMemory.offset(216);
const popupArrayOffset = LogicMemory.offset(228);
const popupCloseVtableOffset = 472;
const popupIsClosingVtableOffset = 480;
const popupIsModalVtableOffset = 440;
const popupTypeVtableOffset = 464;

class GUI {
  static getInstance() {
    return guiInstance.readPointer();
  }

  static patch() {
    Interceptor.attach(PopupBase.PopupBase_dtor, {
      onEnter(args) {
        GUI.onPopupDestroyed(args[0]);
      },
    });
  }

  static onPopupDestroyed(instance) {
    if (this.popupStorage.length !== 0) {
      this.popupStorage = this.popupStorage.filter((popup) => !popup.instance.equals(instance));
    }
  }

  static closeAllPopups() {
    return GUI_closeAllPopups(this.getInstance());
  }

  static closePopup(type) {
    const popup = this.getPopupByType(type);
    if (!popup.isNull()) {
      this.popupVcall(popup, popupCloseVtableOffset, "void", []);
    }
  }

  static getPopupByType(type) {
    const instance = this.getInstance();
    if (instance.isNull()) return NULL;

    const count = instance.add(popupCountOffset).readU32();
    if (count < 1) return NULL;

    const popups = instance.add(popupArrayOffset).readPointer();
    for (let i = 0; i < count; i++) {
      const popup = popups.add(i * Process.pointerSize).readPointer();
      if (
        !this.popupVcall(popup, popupIsModalVtableOffset, "bool", []) &&
        !this.popupVcall(popup, popupIsClosingVtableOffset, "bool", []) &&
        this.popupVcall(popup, popupTypeVtableOffset, "uint32", []) === type
      ) {
        return popup;
      }
    }
    return NULL;
  }

  static popupVcall(instance, offset, returnType, argumentTypes, ...args) {
    const implementation = instance.readPointer().add(offset).readPointer();
    const fn = new NativeFunction(implementation, returnType, ["pointer", ...argumentTypes]);
    return fn(instance, ...args);
  }

  static showFloaterTextAtDefaultPosition(text = "", type = -1, duration = 0) {
    if (!this.getInstance().isNull()) {
      StringObject.with(text, (nativeText) =>
        GUI_showFloaterTextAtDefaultPosition(this.getInstance(), nativeText, type, duration),
      );
    }
  }

  static removeAllPopups() {
    this.popupStorage = [];
  }

  static update(deltaTime) {
    this.popupStorage.forEach((popup) => {
      if (popup.instance.isNull()) {
        this.removePopupByConstructor(popup.constructor);
        popup.onDestructed();
        return;
      }
      popup.updateElements(deltaTime);
    });

    if (++this.sinceLastFlush >= this.FLUSH_TICKS) {
      this.floaters.forEach((floater) => this.showFloaterTextAtDefaultPosition(floater));
      this.floaters = [];
      this.sinceLastFlush = 0;
    }
  }

  static pushFloaterTextToQueue(text) {
    this.floaters.push(text);
  }

  static removePopup(popup) {
    this.popupStorage = this.popupStorage.filter((entry) => !entry.instance.equals(popup.instance));
  }

  static removePopupByConstructor(constructor) {
    this.popupStorage = this.popupStorage.filter((popup) => !(popup instanceof constructor));
  }

  static registerUpdateable(popup) {
    this.popupStorage.push(popup);
  }

  static unregisterUpdateable(popup) {
    this.popupStorage = this.popupStorage.filter((entry) => !entry.instance.equals(popup.instance));
  }

  static addDataGained(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    const instance = this.getInstance();
    if (!instance.isNull()) {
      GUI_addDataGained(instance, arg0, arg1, arg2, arg3, NULL, arg4, arg5, arg6, arg7);
    }
  }

  static showPopup(popup, firstOffset, secondOffset, thirdOffset) {
    if (this.getInstance().isNull()) return;

    if (!(popup instanceof NativePointer)) {
      this.popupStorage.push(popup);
    }

    const popupPointer = Libc.malloc(Process.pointerSize);
    popupPointer.writePointer(popup.instance ?? popup);
    return GUI_showPopup(
      this.getInstance(),
      popupPointer,
      +firstOffset,
      +secondOffset,
      +thirdOffset,
    );
  }
}

GUI.FLUSH_TICKS = 10;
GUI.popupStorage = [];
GUI.floaters = [];
GUI.callbacks = [];
GUI.sinceLastFlush = 0;

exports.GUI = GUI;
