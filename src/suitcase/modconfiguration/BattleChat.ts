// @ts-nocheck
"use strict";

import { MovieClip } from "../../laser/titan/client/common/flash/MovieClip";
import { StringTable } from "../../laser/client/game/text/StringTable";
import { CombatHUD } from "../../laser/client/game/gui/CombatHUD";

export class BattleChat {
  constructor(fontSize = 12, maxMessagesPerScreen = 10) {
    this.fontSize = fontSize;
    this.maxMessagesPerScreen = maxMessagesPerScreen;
    this.linesOnScreen = 0;
    this.text = "";
    CombatHUD.battleChat = this;
  }

  addMessage(name, message, friendly) {
    message = this.wrapWords(message, name);
    this.text += `<c${friendly ? "16c73c" : "80f6f2"}>[${name}]:</c> ${message}\n`;
    this.linesOnScreen = this.text.split("\n").length - 1;
  }

  clear() {
    this.linesOnScreen = 0;
    this.text = "";
  }

  create(baseSprite) {
    this.baseSprite = baseSprite;
    this.battleChatTextField = MovieClip.getTextFieldByName(
      StringTable.getMovieClip("sc/ui.sc", "popover_text_left").instance,
      "text",
    );
    this.battleChatTextField.x = 20;
    this.battleChatTextField.y = 150;
    this.battleChatTextField.color = 0xffffffff;
    this.battleChatTextField.colorTag = true;
    this.battleChatTextField.fontOutline = true;
    this.battleChatTextField.fontSize = this.fontSize;
    baseSprite.addChild(this.battleChatTextField);
  }

  destroy() {
    if (this.battleChatTextField) {
      this.baseSprite?.removeChild(this.battleChatTextField);
      this.baseSprite = null;
      this.battleChatTextField = null;
    }
  }

  isCreated() {
    return !!this.battleChatTextField;
  }

  update() {
    if (!this.isCreated()) return;
    if (this.linesOnScreen > this.maxMessagesPerScreen) {
      const lines = this.text.split("\n");
      this.text = lines.slice(1, lines.length).join("\n");
      this.linesOnScreen--;
    }
    this.battleChatTextField.text = this.text;
  }

  wrapWords(text, name) {
    const words = text.split(" ");
    const lines = [];
    let available = 32 - name.length - 4;
    let line = "";
    let used = 0;
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const length = word.length;
      const next = used + length + (used > 0 ? 1 : 0);
      if (next <= available) {
        line += (used > 0 ? " " : "") + word;
        used = next;
      } else {
        lines.push(line);
        line = word;
        used = length;
      }
      if (lines.length === 1 && available < 32) available += name.length + 4;
    }
    if (line.length > 0) lines.push(line);
    return lines.join("\n");
  }
}
