// @ts-nocheck
const { StringObject } = require("../../../titan/client/native/StringObject");
const REGION_ID = 0,
  PING = 4,
  SERVER_NAME = 40;
class LatencyData {
  constructor(instance) {
    this.instance = instance;
  }
  getRegionId() {
    return this.instance.add(REGION_ID).readInt();
  }
  getPing(raw = false) {
    const ping = this.instance.add(PING).readInt();
    return !raw && ping > 1000 ? ping - 1000 : ping;
  }
  getServerName() {
    return StringObject.read(this.instance.add(SERVER_NAME).readPointer());
  }
}
exports.LatencyData = LatencyData;
