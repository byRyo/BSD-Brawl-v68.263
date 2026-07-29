// @ts-nocheck
const { LogicData } = require("./LogicData");
const { Libg } = require("../../../../lib/Libg");

const LogicCardData_metaType = new NativeFunction(Libg.offset(11175148, 10345676), "int", [
  "pointer",
]);

const CARD_META_STAR_POWER = 4;
const CARD_META_GADGET = 5;

class LogicCardData extends LogicData {
  get metaType() {
    return LogicCardData_metaType(this.instance);
  }
}

exports.LogicCardData = LogicCardData;
exports.CARD_META_STAR_POWER = CARD_META_STAR_POWER;
exports.CARD_META_GADGET = CARD_META_GADGET;
