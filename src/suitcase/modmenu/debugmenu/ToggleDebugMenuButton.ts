// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleDebugMenuButton = void 0;
const { DebugGameButton } = require("./DebugGameButton");
const { DebugMenuButton } = require("../DebugMenuButton");
class ToggleDebugMenuButton extends DebugGameButton {
  constructor() {
    super();
    this.setCustomButtonListener(this.callback.bind(this));
  }
  callback() {
    DebugMenuButton.getDebugMenu()?.hide();
  }
}
exports.ToggleDebugMenuButton = ToggleDebugMenuButton;
