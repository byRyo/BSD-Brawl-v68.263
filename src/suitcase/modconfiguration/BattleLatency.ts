// @ts-nocheck
"use strict";

import { LogicColor } from "../logic/LogicColor";
import { TextFieldHelper } from "../../laser/titan/client/common/flash/TextFieldHelper";

export class BattleLatency {
  static latencyColorArray = LogicColor.generateColorArray(0xffff00, 0x32cb32, 40).concat(
    LogicColor.generateColorArray(0xff0000, 0xffff00, 40),
  );

  constructor() {
    const textField = TextFieldHelper.createTextTextField();
    textField.x = 400;
    textField.y = 15;
    textField.color = 0xffffffff;
    textField.fontOutline = true;
    textField.fontSize = 15;
    this.textField = textField;
  }

  set text(value) {
    this.textField.text = value;
  }

  static getColor(latency) {
    if (latency < 60) return 0x32cb32;
    if (latency < 140) return this.latencyColorArray[latency - 60];
    return 0xff0000;
  }
}
