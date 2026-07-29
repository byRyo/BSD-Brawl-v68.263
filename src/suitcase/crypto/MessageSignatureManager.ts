// @ts-nocheck
"use strict";

import { CryptoTools } from "./CryptoTools";
import { CustomCRC32 } from "./CustomCRC32";
import { LoginOkMessage } from "../../laser/client/game/network/messaging/message/LoginOkMessage";

export class MessageSignatureManager {
  static responseMagicalNumberMultiplier = 41391;
  static requestMagicalNumberMultiplier = 43677;

  static getResponseSignature(response) {
    if (!response.magic_number) return;
    const data = {};
    Object.keys(response).forEach((key) => {
      if (key !== "signature" && key !== "magic_number") data[key] = response[key];
    });
    const encrypted = CryptoTools.xor(
      JSON.stringify(data),
      CryptoTools.getTransformedPrivateServerKey(),
    );
    const crc = CustomCRC32.compute(encrypted);
    return BigInt(crc * (response.magic_number / this.responseMagicalNumberMultiplier))
      .toString(16)
      .slice(0, -2);
  }

  static getRequestSignature(request, multiplier) {
    const encrypted = CryptoTools.xor(
      JSON.stringify(request),
      CryptoTools.getTransformedPrivateServerKey(),
    );
    return BigInt(CustomCRC32.compute(encrypted) * multiplier)
      .toString(16)
      .slice(0, -2);
  }

  static getMagicalNumberWithoutMultiplier() {
    return LoginOkMessage.playTimeInSeconds - LoginOkMessage.getSecondsSinceLoginOk();
  }
}
