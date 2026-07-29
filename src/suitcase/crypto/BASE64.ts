// @ts-nocheck
"use strict";

export class BASE64 {
  static decode(input) {
    const lookup = new Array(256);
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    for (let i = 0; i < 64; i++) lookup[alphabet.charCodeAt(i)] = i;
    const padding =
      input.charAt(input.length - 2) === "=" ? 2 : input.charAt(input.length - 1) === "=" ? 1 : 0;
    const length = 3 * Math.ceil(input.length / 4) - padding;
    const output = new Uint8Array(length);
    let source = 0;
    let target = 0;
    while (source < input.length) {
      const a = lookup[input.charCodeAt(source++)];
      const b = lookup[input.charCodeAt(source++)];
      const c = lookup[input.charCodeAt(source++)];
      const d = lookup[input.charCodeAt(source++)];
      output[target++] = (a << 2) | (b >> 4);
      target < length && (output[target++] = ((b & 15) << 4) | (c >> 2));
      target < length && (output[target++] = ((c & 3) << 6) | d);
    }
    return output;
  }

  static encode(input) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let output = "";
    for (let i = 0; i < input.length; i += 3) {
      const a = input[i];
      const b = input[i + 1];
      const c = input[i + 2];
      const d = ((a & 3) << 4) | (b >> 4);
      const e = ((b & 15) << 2) | (c >> 6);
      const f = c & 63;
      output +=
        alphabet.charAt(a >> 2) +
        alphabet.charAt(d) +
        (i + 1 < input.length ? alphabet.charAt(e) : "=") +
        (i + 2 < input.length ? alphabet.charAt(f) : "=");
    }
    return output;
  }
}
