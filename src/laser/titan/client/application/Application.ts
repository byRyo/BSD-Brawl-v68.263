// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { StringObject } = require("../native/StringObject");

const copyStringNative = new NativeFunction(Libg.offset(15792300, 14204440), "void", ["pointer"]);
const openUrlNative = new NativeFunction(Libg.offset(15793728, 14215308), "void", ["pointer"]);
const openShareDialogNative = new NativeFunction(Libg.offset(15365308, 14265532), "void", [
  "pointer",
  "pointer",
  "pointer",
  "pointer",
]);

class Application {
  static copyString(value) {
    StringObject.with(value, (nativeValue) => copyStringNative(nativeValue));
  }

  static openUrl(url) {
    StringObject.with(url, (nativeUrl) => openUrlNative(nativeUrl));
  }

  static openShareDialog(text, title = "Share") {
    StringObject.withMany([text, title], ([nativeText, nativeTitle]) =>
      openShareDialogNative(nativeText, nativeTitle, NULL, NULL),
    );
  }
}

exports.Application = Application;
