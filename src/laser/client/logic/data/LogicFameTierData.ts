// @ts-nocheck
const { LogicData } = require("./LogicData");
const { Libg } = require("../../../../lib/Libg");
const { StringObject } = require("../../../titan/client/native/StringObject");

const getIconStarsExportNameNative = new NativeFunction(
  Libg.offset(11388412, 10508920),
  "pointer",
  ["pointer"],
);

class LogicFameTierData extends LogicData {
  get iconStarsExportName() {
    return StringObject.read(getIconStarsExportNameNative(this.instance));
  }
}

exports.LogicFameTierData = LogicFameTierData;
