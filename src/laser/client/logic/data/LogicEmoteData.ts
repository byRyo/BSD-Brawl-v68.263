// @ts-nocheck
const { LogicData } = require("./LogicData");
const { Libg } = require("../../../../lib/Libg");

const emoteEnabledAddress = Libg.offset(11380932, 10502932);
const iconSwfColumnAddress = Libg.offset(19133212, 17797044);
const iconExportColumnAddress = Libg.offset(19133216, 17797048);

class LogicEmoteData extends LogicData {
  getRarity() {
    return this.getStringValueAt(10);
  }
  getIconSWF() {
    return this.getStringValueAt(iconSwfColumnAddress.readInt());
  }
  getIconExportName() {
    return this.getStringValueAt(iconExportColumnAddress.readInt());
  }

  static patch() {
    Interceptor.attach(emoteEnabledAddress, {
      onLeave(retval) {
        if (retval.equals(ptr(1))) retval.replace(ptr(0));
      },
    });
  }
}

exports.LogicEmoteData = LogicEmoteData;
