// @ts-nocheck
"use strict";

export class TSChaCha20 {
  static key = new Uint8Array([
    243, 244, 240, 100, 74, 112, 87, 24, 18, 250, 159, 178, 114, 23, 241, 218, 118, 62, 239, 206,
    180, 70, 50, 84, 229, 125, 158, 209, 213, 35, 116, 240,
  ]);
  static nonce = new Uint8Array([80, 175, 71, 64, 161, 167, 129, 39, 94, 56, 118, 21]);

  constructor(key, nonce, counter = 0) {
    this._rounds = 20;
    this._sigma = [1634760805, 857760878, 2036477234, 1797285236];
    this._param = [];
    this._keystream = new Uint8Array(64);
    this._byteCounter = 0;
    if (key.length !== 32) throw new Error("Key should be 32 byte array!");
    if (nonce.length !== 12) throw new Error("Nonce should be 12 byte array!");
    this._param = [
      this._sigma[0],
      this._sigma[1],
      this._sigma[2],
      this._sigma[3],
      this._get32(key, 0),
      this._get32(key, 4),
      this._get32(key, 8),
      this._get32(key, 12),
      this._get32(key, 16),
      this._get32(key, 20),
      this._get32(key, 24),
      this._get32(key, 28),
      counter,
      this._get32(nonce, 0),
      this._get32(nonce, 4),
      this._get32(nonce, 8),
    ];
  }

  encrypt(data) {
    return this._update(data);
  }
  decrypt(data) {
    return this._update(data);
  }

  _update(data) {
    if (data.length === 0)
      throw new Error("Data should be type of bytes (Uint8Array) and not empty!");
    const output = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      if (this._byteCounter === 0 || this._byteCounter === 64) {
        this._chacha();
        this._param[12]++;
        this._byteCounter = 0;
      }
      output[i] = data[i] ^ this._keystream[this._byteCounter++];
    }
    return output;
  }

  _chacha() {
    const x = new Array(16).fill(0);
    for (let i = 0; i < 16; i++) x[i] = this._param[i];
    for (let i = 0; i < this._rounds; i += 2) {
      this._quarterround(x, 0, 4, 8, 12);
      this._quarterround(x, 1, 5, 9, 13);
      this._quarterround(x, 2, 6, 10, 14);
      this._quarterround(x, 3, 7, 11, 15);
      this._quarterround(x, 0, 5, 10, 15);
      this._quarterround(x, 1, 6, 11, 12);
      this._quarterround(x, 2, 7, 8, 13);
      this._quarterround(x, 3, 4, 9, 14);
    }
    for (let i = 0; i < 16; i++) {
      const value = (x[i] + this._param[i]) >>> 0;
      this._keystream[i * 4] = value;
      this._keystream[i * 4 + 1] = value >>> 8;
      this._keystream[i * 4 + 2] = value >>> 16;
      this._keystream[i * 4 + 3] = value >>> 24;
    }
  }

  _quarterround(x, a, b, c, d) {
    x[a] = (x[a] + x[b]) >>> 0;
    x[d] = this._rotl(x[d] ^ x[a], 16);
    x[c] = (x[c] + x[d]) >>> 0;
    x[b] = this._rotl(x[b] ^ x[c], 12);
    x[a] = (x[a] + x[b]) >>> 0;
    x[d] = this._rotl(x[d] ^ x[a], 8);
    x[c] = (x[c] + x[d]) >>> 0;
    x[b] = this._rotl(x[b] ^ x[c], 7);
  }

  _get32(data, index) {
    return (
      (data[index] | (data[index + 1] << 8) | (data[index + 2] << 16) | (data[index + 3] << 24)) >>>
      0
    );
  }
  _rotl(value, shift) {
    return ((value << shift) | (value >>> (32 - shift))) >>> 0;
  }
}
