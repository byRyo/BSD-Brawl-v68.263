// @ts-nocheck
"use strict";

import { CustomTextEncoder } from "./CustomTextEncoder";

export class CryptoTools {
  static RAW_PRIVATE_SERVER_KEY = new Uint8Array([
    19, 66, 218, 17, 35, 255, 85, 1, 20, 118, 16, 101, 65, 89, 34, 19,
  ]);

  static xor(value, key) {
    const bytes = CustomTextEncoder.encode(value);
    const result = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) result[i] = bytes[i] ^ key[i % key.length];
    return result;
  }

  static getXorKey() {
    return 113;
  }

  static getTransformedPrivateServerKey() {
    const key = this.getXorKey();
    const result = new Uint8Array(this.RAW_PRIVATE_SERVER_KEY.length);
    for (let i = 0; i < this.RAW_PRIVATE_SERVER_KEY.length; i++)
      result[i] = this.RAW_PRIVATE_SERVER_KEY[i] ^ key;
    return result;
  }
}
