// @ts-nocheck
"use strict";

import { INativeDialogListener } from "../../laser/titan/client/native/INativeDialogListener";
import { Config } from "../config/Config";
import { FileManager } from "../filesystem/FileManager";
import { GameMain } from "../../laser/client/GameMain";

export class BSDProxy {
  static showProxyDialog = true;
  static proxyNativeDialogListener = new INativeDialogListener(BSDProxy.enable);

  static enable(_button, result) {
    if (result === 2) {
      Config.config.BSDProxy = false;
      FileManager.updateConfigFile();
      GameMain.reloadGame();
    } else GameMain.reloadGame();
  }
}
