// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplayUuid = void 0;
const Libc_1 = require("../../lib/Libc");
const UUID_BYTES = 16;
const UUID_HEX_LENGTH = 32;
class ReplayUuid {
  static toBuffer(value) {
    const hex = value.replace(/[^0-9a-fA-F]/g, "");
    if (hex.length !== UUID_HEX_LENGTH) return null;
    const buffer = Libc_1.Libc.malloc(UUID_BYTES);
    for (let i = 0; i < UUID_BYTES; i++) buffer.add(i).writeU8(parseInt(hex.substr(2 * i, 2), 16));
    return buffer;
  }
  static toHex(buffer) {
    let result = "";
    for (let i = 0; i < UUID_BYTES; i++)
      result += buffer.add(i).readU8().toString(16).padStart(2, "0");
    return result;
  }
  static toFormatted(buffer) {
    const hex = this.toHex(buffer);
    return "".concat(
      hex.slice(0, 8),
      "-",
      hex.slice(8, 12),
      "-",
      hex.slice(12, 16),
      "-",
      hex.slice(16, 20),
      "-",
      hex.slice(20, 32),
    );
  }
}
exports.ReplayUuid = ReplayUuid;
