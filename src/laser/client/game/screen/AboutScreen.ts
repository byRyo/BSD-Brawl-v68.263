// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");

const showAboutScreen = new NativeFunction(Libg.offset(8366572, 8034708), "void", []);

class AboutScreen {
  static show() {
    showAboutScreen();
  }
}

exports.AboutScreen = AboutScreen;
