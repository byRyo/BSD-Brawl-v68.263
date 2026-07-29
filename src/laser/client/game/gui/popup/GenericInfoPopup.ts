// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Libc } = require("../../../../../lib/Libc");
const { GenericPopup } = require("../../../../titan/client/common/flash/GenericPopup");
const { StringObject } = require("../../../../titan/client/native/StringObject");
const { GUI } = require("../GUI");
const GenericInfoPopup_ctor = new NativeFunction(Libg.offset(7380152, 7187060), "void", [
  "pointer",
  "pointer",
  "pointer",
]);
class GenericInfoPopup extends GenericPopup {
  static allocationSize = 448;
  constructor(title, text) {
    const instance = Libc.calloc(GenericInfoPopup.allocationSize, 1);
    StringObject.withMany([title, text], ([titlePtr, textPtr]) =>
      GenericInfoPopup_ctor(instance, titlePtr, textPtr),
    );
    super(instance);
  }
  static show(title, text) {
    const popup = new GenericInfoPopup(title, text);
    GUI.showPopup(popup.instance, true, false, true);
  }
}
module.exports = { GenericInfoPopup };
