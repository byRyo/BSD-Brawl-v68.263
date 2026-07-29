// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugBottomMenu = void 0;
const { StringTable } = require("../../../laser/client/game/text/StringTable");
const { DropGUIContainer } = require("../../../laser/titan/client/common/flash/DropGUIContainer");
const { Stage } = require("../../../laser/titan/client/common/flash/Stage");
const { DebugGameButton } = require("./DebugGameButton");

class DebugBottomMenu extends DropGUIContainer {
  constructor(widthOffset = 0) {
    super();
    this.movieClip = StringTable.getMovieClip("sc/debug.sc", "debug_menu_bottom");
    this.setMovieClip(this.movieClip);
    const matrixX = Stage.getMatrixX();
    const matrixY = Stage.getMatrixY();
    this.setPixelSnappedXY(-matrixX, matrixY);
    const background = this.movieClip.getMovieClipByName("bg");
    if (background) background.setWidth(matrixX - widthOffset);
    this.itemArea = this.movieClip.getMovieClipByName("item_area");
    this.currentX = this.itemArea.x + 100;
    this.currentY = this.itemArea.y;
    this.currentRow = 0;
  }

  nextRow() {
    this.currentRow += 1;
    this.currentX = this.itemArea.x + 100;
  }

  createButton(text, callback = undefined) {
    const movieClip = StringTable.getMovieClip("sc/debug.sc", "debug_menu_item_small");
    const button = new DebugGameButton();
    button.setMovieClip(movieClip, true);
    button.setTextFieldText(text);
    if (callback) button.setCustomButtonListener((button, event) => callback(event, button));
    return button;
  }

  createAndPositionButton(text, callback = undefined) {
    const button = this.createButton(text, callback);
    const movieClip = button.getMovieClip();
    this.movieClip.addChild(movieClip);
    movieClip.setPixelSnappedXY(this.currentX, this.currentY + movieClip.height * this.currentRow);
    this.currentX += movieClip.width;
    return button;
  }
}
exports.DebugBottomMenu = DebugBottomMenu;
