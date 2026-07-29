// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugCommandButton = void 0;
const { DebugGameButton } = require("./DebugGameButton");
const { LogicDebugButtonMessage } = require("./LogicDebugButtonMessage");
const { LogicMemory } = require("../../logic/LogicMemory");
const actionIdxOffset = LogicMemory.offset(576);
class DebugCommandButton extends DebugGameButton {
  constructor(actionIdx, intParameter, btnType) {
    super();
    this.btnType = btnType;
    this.setActionIdx(actionIdx);
    this.setIntParameter(intParameter);
  }
  setActionIdx(value) {
    this.instance.add(actionIdxOffset).writeInt(value);
  }
  static readActionIdx(instance) {
    return instance.add(actionIdxOffset).readInt();
  }
  static callback(_button, instance) {
    const button = new DebugGameButton(instance);
    LogicDebugButtonMessage.send(
      DebugCommandButton.readActionIdx(instance),
      button.getIntParameter(),
    );
  }
}
exports.DebugCommandButton = DebugCommandButton;
