// @ts-nocheck
const { MessageManager } = require("./MessageManager");
const { LatencyTestsPopup } = require("../gui/popup/LatencyTestsPopup");
const { TriggerLatencyTestMessage } = require("./messaging/message/TriggerLatencyTestMessage");
class Latency {
  static test() {
    MessageManager.sendMessage(new TriggerLatencyTestMessage());
  }
  static getLatencyReport() {
    if (MessageManager.getInstance().isNull()) return LatencyTestsPopup.unavailableReport;
    return LatencyTestsPopup.refreshOfflineReport();
  }
  static getBestLatency() {
    if (MessageManager.getLatencyTestsCount() < 1) return;
    const tests = MessageManager.getLatencyTests();
    let best = tests[0];
    for (let i = 1; i < tests.length; i++)
      if (tests[i].getPing(true) < best.getPing(true)) best = tests[i];
    return best;
  }
  static parseBestLatency() {
    const best = this.getBestLatency();
    return best ? `${best.getPing()} ms (${best.getServerName()})` : "N/A";
  }
}
exports.Latency = Latency;
