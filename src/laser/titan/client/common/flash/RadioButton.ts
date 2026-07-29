// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg"),
  { GameButton } = require("../../../../client/game/gui/GameButton"),
  { StringObject } = require("../../native/StringObject");
const create = new NativeFunction(Libg.offset(6169748, 6126296), "pointer", [
    "pointer",
    "pointer",
    "pointer",
  ]),
  setState = new NativeFunction(Libg.offset(6168952, 6125772), "void", ["pointer", "int"]);
class RadioButton extends GameButton {
  constructor(parent, name) {
    super(StringObject.with(name, (s) => create(parent.instance, s, NULL)));
    this.state = 1;
  }
  setRadioButtonState(state) {
    this.state = state;
    return setState(this.instance, state);
  }
  getRadioButtonState() {
    return this.state;
  }
  nextState() {
    const state = this.getRadioButtonState() === 1 ? 2 : 1;
    this.setRadioButtonState(state);
    this.state = state;
  }
}
module.exports = { RadioButton };
