// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkinPreview = void 0;
const GUI_1 = require("../../laser/client/game/gui/GUI");
const BrawlerMenu_1 = require("../modmenu/gatcha/BrawlerMenu");
const HomeMode_1 = require("../../laser/client/game/state/homemode/HomeMode");
class SkinPreview {
  static show() {
    GUI_1.GUI.showPopup(
      new BrawlerMenu_1.BrawlerMenuPopup(true, HomeMode_1.HomeMode.gatchaType.Skin, true),
      true,
      true,
      false,
    );
  }
}
exports.SkinPreview = SkinPreview;