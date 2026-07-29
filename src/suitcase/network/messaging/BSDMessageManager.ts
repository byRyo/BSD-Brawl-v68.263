// @ts-nocheck
const { BSDHttpClient } = require("../BSDHttpClient");
const { TSChaCha20 } = require("../../crypto/TSChaCha20");
const { CustomTextEncoder } = require("../../crypto/CustomTextEncoder");
const { MessageSignatureManager } = require("../../crypto/MessageSignatureManager");

class BSDMessageManager {
  static sendMessage(message, callback, stopSleep) {
    const cipher = new TSChaCha20(TSChaCha20.key, TSChaCha20.nonce);
    const encoded = CustomTextEncoder.encode(message.body);
    const encrypted = cipher.encrypt(encoded);
    const body = {
      data: this.bytesToEscapedString(Array.from(encrypted)),
    };
    const onComplete = stopSleep ? () => BSDHttpClient.stopSleep() : undefined;
    const response = new BSDHttpClient().post(message.route, JSON.stringify(body), onComplete);
    if (callback) callback();
    return response;
  }

  static validateMessage(message) {
    const signatureValid =
      MessageSignatureManager.getResponseSignature(message) === message.signature;
    const expected = MessageSignatureManager.getMagicalNumberWithoutMultiplier();
    const received = message.magic_number / MessageSignatureManager.responseMagicalNumberMultiplier;
    const magicNumberValid = Math.abs(expected - received) <= 10;
    return !!signatureValid && magicNumberValid;
  }

  static bytesToEscapedString(bytes) {
    return bytes.map((byte) => "\\x" + byte.toString(16).padStart(2, "0")).join("");
  }

  static escapedStringToBytes(value) {
    if (
      (value.startsWith("b'") && value.endsWith("'")) ||
      (value.startsWith('b"') && value.endsWith('"'))
    ) {
      value = value.slice(2, -1);
    }
    const bytes = [];
    const isHex = (character) => /[0-9a-fA-F]/.test(character);
    let index = 0;
    while (index < value.length) {
      const character = value[index];
      if (character !== "\\") {
        bytes.push(character.charCodeAt(0));
        index++;
        continue;
      }
      const escaped = value[index + 1];
      if (
        escaped === "x" &&
        index + 3 < value.length &&
        isHex(value[index + 2]) &&
        isHex(value[index + 3])
      ) {
        bytes.push(parseInt(value.substring(index + 2, index + 4), 16));
        index += 4;
        continue;
      }
      if (!["\\", "'", '"', "n", "r", "t"].includes(escaped)) {
        bytes.push(escaped.charCodeAt(0));
      } else if (escaped === "t") {
        bytes.push(9);
      } else if (escaped === "r") {
        bytes.push(13);
      } else if (escaped === "n") {
        bytes.push(10);
      } else {
        bytes.push(escaped.charCodeAt(0));
      }
      index += 2;
    }
    return bytes;
  }
}

exports.BSDMessageManager = BSDMessageManager;
