// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { PopupBase } = require("./PopupBase");
const { StringObject } = require("../../native/StringObject");
const { GameButton } = require("../../../../client/game/gui/GameButton");
const { Libc } = require("../../../../../lib/Libc");

const GenericPopup_ctor = new NativeFunction(Libg.offset(7380644, 7187568), "void", [
  "pointer",
  "pointer",
  "int",
  "int",
  "pointer",
  "pointer",
  "pointer",
  "pointer",
  "pointer",
]);
const GenericPopup_buttonPressed = new NativeFunction(Libg.offset(7384140, 7190416), "void", [
  "pointer",
  "pointer",
]);
const GenericPopup_setTitleTid = new NativeFunction(Libg.offset(7381852, 7188752), "void", [
  "pointer",
  "pointer",
]);
const GenericPopup_setUpScreenHeader = new NativeFunction(Libg.offset(7385036, 7191072), "void", [
  "pointer",
]);
const GenericPopup_addPopupButton = new NativeFunction(Libg.offset(7383788, 7190116), "pointer", [
  "pointer",
  "pointer",
  "int",
  "pointer",
]);

class GenericPopup extends PopupBase {
  constructor(
    popupExportName,
    isModal,
    showCloseButton,
    titleTid = "",
    headerTid = "",
    buttonTid = "",
    additionalTid = "",
    resourceFile = "sc/ui.sc",
  ) {
    if (popupExportName instanceof NativePointer) {
      super(popupExportName);
      return;
    }

    const instance = Libc.malloc(GenericPopup.allocationSize);
    StringObject.withMany(
      [popupExportName, titleTid, headerTid, buttonTid, additionalTid, resourceFile],
      ([popupExport, title, header, button, additional, resource]) => {
        GenericPopup_ctor(
          instance,
          popupExport,
          +isModal,
          +showCloseButton,
          title,
          header,
          button,
          additional,
          resource,
        );
      },
    );

    super(instance, popupExportName, isModal, showCloseButton, titleTid, headerTid, buttonTid);
  }

  buttonPressed(_button, buttonInstance) {
    GenericPopup_buttonPressed(this.instance, buttonInstance);
  }

  addPopupButton(exportName, buttonType, text) {
    return StringObject.withMany([exportName, text], ([buttonExport, buttonText]) => {
      return new GameButton(
        GenericPopup_addPopupButton(this.instance, buttonExport, buttonType, buttonText),
      );
    });
  }

  setTitleTid(titleTid) {
    StringObject.with(titleTid, (title) => {
      GenericPopup_setTitleTid(this.instance, title);
    });
  }

  setUpScreenHeader() {
    GenericPopup_setUpScreenHeader(this.instance);
  }
}

GenericPopup.allocationSize = 664;

module.exports = { GenericPopup };
