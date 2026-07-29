// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Libc } = require("../../../../../lib/Libc");
const { GenericPopup } = require("../../../../titan/client/common/flash/GenericPopup");
const { GUIContainer } = require("../../../../titan/client/common/flash/GUIContainer");
const { MovieClip } = require("../../../../titan/client/common/flash/MovieClip");
const { GUI } = require("../GUI");

const LatencyTestsPopup_ctor = new NativeFunction(Libg.offset(7417276, 7217400), "void", [
  "pointer",
]);
const LatencyTestsPopup_refreshOfflineReport = new NativeFunction(
  Libg.offset(7418224, 7218276),
  "void",
  ["pointer"],
);
const allocationSize = 480;
const reportTextFieldName = "scroll_area";

class LatencyTestsPopup extends GenericPopup {
  static offlineInstance = NULL;
  constructor() {
    const instance = Libc.malloc(allocationSize);
    LatencyTestsPopup_ctor(instance);
    super(instance);
  }
  static show() {
    if (!GUI.getInstance().isNull()) GUI.showPopup(new LatencyTestsPopup(), false, false, true);
  }
  static refreshOfflineReport() {
    const instance = this.getOrCreateOfflineInstance();
    if (instance.isNull()) return this.unavailableReport;
    LatencyTestsPopup_refreshOfflineReport(instance);
    const field = MovieClip.getTextFieldByName(
      GUIContainer.getMovieClip(instance),
      reportTextFieldName,
    );
    return field ? field.text : this.unavailableReport;
  }
  static get unavailableReport() {
    return "LatencyTestResults: ---";
  }
  static getOrCreateOfflineInstance() {
    if (!this.offlineInstance.isNull()) return this.offlineInstance;
    const instance = Libc.malloc(allocationSize);
    LatencyTestsPopup_ctor(instance);
    this.offlineInstance = instance;
    return instance;
  }
}

module.exports = { LatencyTestsPopup };
