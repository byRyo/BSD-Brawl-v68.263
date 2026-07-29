// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { Config } = require("../../../../suitcase/config/Config");
const { StringObject } = require("../../../titan/client/native/StringObject");
const { LogicData } = require("./LogicData");

const fogNameAddress = Libg.offset(11452968, 10566776);
const fogTypeAddress = Libg.offset(11453000, 10566808);
const mapWidthColumnAddress = Libg.offset(19134952, 17798784);
const mapHeightColumnAddress = Libg.offset(19134956, 17798788);
const disabledColumnAddress = Libg.offset(19134620, 17798452);

class LogicLocationThemeData extends LogicData {
  getMapWidth() {
    return this.getIntValueAt(mapWidthColumnAddress.readInt());
  }
  getMapHeight() {
    return this.getIntValueAt(mapHeightColumnAddress.readInt());
  }
  isDisabled() {
    return this.getBooleanValueAt(disabledColumnAddress.readInt());
  }

  static patch() {
    Interceptor.attach(fogNameAddress, {
      onLeave(retval) {
        if (Config.config.FogType !== "") {
          StringObject.create("1_lab", retval);
          if (StringObject.read(retval) === "") StringObject.create("1", retval);
        } else if (StringObject.read(retval) === "1") {
          StringObject.create("", retval);
        }
      },
    });
    Interceptor.attach(fogTypeAddress, {
      onLeave(retval) {
        if (Config.config.FogType !== "") {
          StringObject.create(Config.config.FogType, retval);
        }
      },
    });
  }
}

exports.LogicLocationThemeData = LogicLocationThemeData;
