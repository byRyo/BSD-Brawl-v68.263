// @ts-nocheck
const { Localisation } = require("../localisation/Localisation");
const { NativeDialog } = require("../../laser/titan/client/native/NativeDialog");
const { INativeDialogListener } = require("../../laser/titan/client/native/INativeDialogListener");
const { Libc } = require("../../lib/Libc");

class LogicNativeDialog {
  static killGame(_argument0, argument1) {
    if (argument1 === 0) Libc.kill(Libc.getpid(), 15);
  }

  static showRestartRequiredDialog() {
    NativeDialog.show(
      Localisation.getString("RestartRequiredTitle"),
      Localisation.getString("RestartRequiredDescription"),
      Localisation.getString("RestartRequiredExitGameButton"),
      Localisation.getString("RestartRequiredLaterButton"),
      "",
      this.restartNativeDialogListener.instance,
    );
  }
}

LogicNativeDialog.restartNativeDialogListener = new INativeDialogListener(
  LogicNativeDialog.killGame,
);

exports.LogicNativeDialog = LogicNativeDialog;
