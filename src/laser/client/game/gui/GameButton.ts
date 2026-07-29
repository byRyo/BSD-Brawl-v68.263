// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { Libc } = require("../../../../lib/Libc");
const { CustomButton } = require("../../../titan/client/common/flash/CustomButton");
const { StringObject } = require("../../../titan/client/native/StringObject");

const GameButton_ctor = new NativeFunction(Libg.offset(6069488, 6046184), "void", ["pointer"]);
const GameButton_buttonPressed = new NativeFunction(Libg.offset(6070800, 6046756), "void", [
  "pointer",
]);
const GameButton_setDisabledWithHUDPrint = new NativeFunction(
  Libg.offset(6072520, 6048356),
  "void",
  ["pointer", "int", "pointer", "int"],
);
const GameButton_setHighlight = new NativeFunction(Libg.offset(6072760, 6048596), "void", [
  "pointer",
  "int",
  "int",
  "int",
  "float",
]);
const DEFAULT_TEXT_FIELD_NAME = "txt";

class GameButton extends CustomButton {
  static allocationSize = 704;

  constructor(instance) {
    if (!instance || instance.isNull()) {
      instance = Libc.malloc(GameButton.allocationSize);
      GameButton_ctor(instance);
    }
    super(instance);
  }

  setText(textFieldName, text) {
    this.getMovieClip().getTextFieldByName(textFieldName).text = text;
  }

  getText(textFieldName) {
    return this.getMovieClip().getTextFieldByName(textFieldName).text;
  }

  setHighlight(highlight, color, pulse, alpha) {
    GameButton_setHighlight(this.instance, highlight, color, pulse, alpha);
  }

  setDisabledWithHUDPrint(disabled, text) {
    StringObject.with(text, (value) =>
      GameButton_setDisabledWithHUDPrint(this.instance, +disabled, value, 0),
    );
  }
}

module.exports = { GameButton, GameButton_buttonPressed, DEFAULT_TEXT_FIELD_NAME };
