// @ts-nocheck
const { MessageSignatureManager } = require("../crypto/MessageSignatureManager");
const { Logcat } = require("../debug/Logcat");

class BSDMessage {
  constructor(data, route) {
    data.signature = this.getSignature(data);
    data.magic_number = 43677 * MessageSignatureManager.getMagicalNumberWithoutMultiplier();
    this.body = JSON.stringify(data);
    this.route = route;
  }

  getSignature(data) {
    const payload = {};
    Object.keys(data).forEach((key) => {
      if (key !== "signature" && key !== "magic_number") payload[key] = data[key];
    });
    Logcat.logDebug(JSON.stringify(payload));
    return MessageSignatureManager.getRequestSignature(payload, data.magic_number);
  }
}

exports.BSDMessage = BSDMessage;
