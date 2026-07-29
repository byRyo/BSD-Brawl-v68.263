// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { StringObject } = require("./StringObject");
const { SafeJNI } = require("../application/SafeJNI");

const showNative = new NativeFunction(Libg.offset(15364928, 14262752), "void", [
  "pointer",
  "pointer",
  "pointer",
  "pointer",
  "pointer",
  "pointer",
]);

class NativeDialog {
  static show(title = "", message = "", button1 = "", button2 = "", button3 = "", listener = NULL) {
    if (SafeJNI.isAvailable() || Process.platform === "darwin") {
      StringObject.withMany(
        [title, message, button1, button2, button3],
        ([nativeTitle, nativeMessage, nativeButton1, nativeButton2, nativeButton3]) => {
          showNative(
            listener,
            nativeTitle,
            nativeMessage,
            nativeButton1,
            nativeButton2,
            nativeButton3,
          );
        },
      );
    }
  }
}

exports.NativeDialog = NativeDialog;
