// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Libc } = require("../../../../../lib/Libc");
const { GenericPopup } = require("../../../../titan/client/common/flash/GenericPopup");
const { GUI } = require("../GUI");
const MoviePlayerPopup_ctor = new NativeFunction(Libg.offset(7545780, 7333888), "void", [
  "pointer",
  "int",
]);
const MoviePlayerPopup_play = new NativeFunction(Libg.offset(7545644, 7333776), "void", [
  "pointer",
]);
class MoviePlayerPopup extends GenericPopup {
  static allocationSize = 424;
  constructor() {
    const instance = Libc.calloc(MoviePlayerPopup.allocationSize, 1);
    MoviePlayerPopup_ctor(instance, 0);
    super(instance);
  }
  static patch() {
    Interceptor.replace(MoviePlayerPopup_play, new NativeCallback(() => {}, "void", ["pointer"]));
  }
  static show() {
    const popup = new MoviePlayerPopup();
    GUI.showPopup(popup.instance, true, false, true);
  }
}
module.exports = { MoviePlayerPopup };
