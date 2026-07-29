// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");

const SettingsPopup_show = new NativeFunction(Libg.offset(8020112, 7737464), "void", []);

class SettingsPopup {
  static show() {
    SettingsPopup_show();
  }
}

module.exports = { SettingsPopup };
