// @ts-nocheck
"use strict";

export class CustomTextEncoder {
  instance;

  constructor(value) {
    this.instance = CustomTextEncoder.encode(value);
  }

  static encode(value) {
    const output = [];
    for (let i = 0; i < value.length; i++) {
      let code = value.charCodeAt(i);
      if (code >= 0xd800 && code <= 0xdbff && i + 1 < value.length) {
        const low = value.charCodeAt(i + 1);
        if (low >= 0xdc00 && low <= 0xdfff) {
          code = 0x10000 + ((code - 0xd800) << 10) + (low - 0xdc00);
          i++;
        }
      }
      if (code < 0x80) output.push(code);
      else if (code < 0x800) output.push(0xc0 | (code >> 6), 0x80 | (code & 63));
      else if (code < 0x10000)
        output.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 63), 0x80 | (code & 63));
      else
        output.push(
          0xf0 | (code >> 18),
          0x80 | ((code >> 12) & 63),
          0x80 | ((code >> 6) & 63),
          0x80 | (code & 63),
        );
    }
    return new Uint8Array(output);
  }

  static decode(value) {
    const bytes = new Uint8Array(value);
    let output = "";
    let i = 0;
    while (i < bytes.length) {
      const first = bytes[i++];
      if (first < 0x80) output += String.fromCharCode(first);
      else if (first < 0xe0) {
        const second = bytes[i++];
        if (second === undefined) break;
        output += String.fromCharCode(((first & 31) << 6) | (second & 63));
      } else if (first < 0xf0) {
        const second = bytes[i++],
          third = bytes[i++];
        if (second === undefined || third === undefined) break;
        output += String.fromCharCode(((first & 15) << 12) | ((second & 63) << 6) | (third & 63));
      } else {
        const second = bytes[i++],
          third = bytes[i++],
          fourth = bytes[i++];
        if (second === undefined || third === undefined || fourth === undefined) break;
        const code =
          ((first & 7) << 18) | ((second & 63) << 12) | ((third & 63) << 6) | (fourth & 63);
        if (code <= 0xffff) output += String.fromCharCode(code);
        else {
          const rest = code - 0x10000;
          output += String.fromCharCode(0xd800 + (rest >> 10), 0xdc00 + (rest & 1023));
        }
      }
    }
    return output || "";
  }

  static toArrayBuffer(value) {
    const result = new ArrayBuffer(value.length);
    new Uint8Array(result).set(value);
    return result;
  }
}
