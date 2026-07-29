// @ts-nocheck
"use strict";

import { StringTable } from "../../laser/client/game/text/StringTable";

export class BattleCoordinates {
  constructor() {
    const textField = StringTable.getMovieClip("sc/ui.sc", "popover_text_left").getTextFieldByName(
      "text",
    );
    textField.x = 115;
    textField.y = 45;
    textField.color = 0xffffffff;
    textField.fontOutline = true;
    this.textField = textField;
  }

  setText(value) {
    return (this.textField.text = value);
  }
}
