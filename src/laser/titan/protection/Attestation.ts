// @ts-nocheck
const { Libg } = require("../../../lib/Libg");
const { Libc } = require("../../../lib/Libc");

const attestationFunction = Libg.offset(0xe9f120, 0xd8f050);
const androidTokenSlotOffset = 0xe1948;
const tokenSize = 80;
const base = 1027n;
const mask64 = (1n << 64n) - 1n;
const negativeBase = (mask64 + 1n - base) & mask64;

const androidMacMessage = new Uint8Array([
  218, 27, 47, 225, 115, 133, 126, 37, 219, 15, 21, 222, 105, 208, 165, 15, 78, 95, 227, 61, 116,
  95, 13, 161, 179, 52, 111, 238, 245, 79, 114, 229,
]);

const continuationState1 = new Uint8Array([
  218, 27, 47, 225, 115, 133, 126, 37, 219, 15, 21, 222, 105, 208, 165, 15, 78, 95, 227, 61, 116,
  95, 13, 161, 179, 52, 111, 238, 245, 79, 114, 229,
]);

const continuationState2 = new Uint8Array([
  120, 198, 27, 5, 70, 245, 126, 11, 183, 129, 242, 150, 233, 189, 37, 48, 108, 55, 196, 17, 99, 14,
  195, 170, 96, 62, 107, 53, 207, 0, 55, 132,
]);

const sha256InitialState = new Uint32Array([
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
]);

const sha256Constants = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

function rotateRight(value, count) {
  return ((value >>> count) | (value << (32 - count))) >>> 0;
}

function compressSha256(state, bytes, offset) {
  const schedule = new Uint32Array(64);

  for (let i = 0; i < 16; i++) {
    const position = offset + i * 4;
    schedule[i] =
      ((bytes[position] << 24) |
        (bytes[position + 1] << 16) |
        (bytes[position + 2] << 8) |
        bytes[position + 3]) >>>
      0;
  }

  for (let i = 16; i < 64; i++) {
    const previous15 = schedule[i - 15];
    const previous2 = schedule[i - 2];
    const sigma0 = rotateRight(previous15, 7) ^ rotateRight(previous15, 18) ^ (previous15 >>> 3);
    const sigma1 = rotateRight(previous2, 17) ^ rotateRight(previous2, 19) ^ (previous2 >>> 10);

    schedule[i] = (schedule[i - 16] + sigma0 + schedule[i - 7] + sigma1) >>> 0;
  }

  let a = state[0];
  let b = state[1];
  let c = state[2];
  let d = state[3];
  let e = state[4];
  let f = state[5];
  let g = state[6];
  let h = state[7];

  for (let i = 0; i < 64; i++) {
    const sigma1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
    const choose = (e & f) ^ (~e & g);
    const temporary1 = (h + sigma1 + choose + sha256Constants[i] + schedule[i]) >>> 0;
    const sigma0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
    const majority = (a & b) ^ (a & c) ^ (b & c);
    const temporary2 = (sigma0 + majority) >>> 0;

    h = g;
    g = f;
    f = e;
    e = (d + temporary1) >>> 0;
    d = c;
    c = b;
    b = a;
    a = (temporary1 + temporary2) >>> 0;
  }

  state[0] = (state[0] + a) >>> 0;
  state[1] = (state[1] + b) >>> 0;
  state[2] = (state[2] + c) >>> 0;
  state[3] = (state[3] + d) >>> 0;
  state[4] = (state[4] + e) >>> 0;
  state[5] = (state[5] + f) >>> 0;
  state[6] = (state[6] + g) >>> 0;
  state[7] = (state[7] + h) >>> 0;
}

function sha256WithState(message, initialStateBytes, priorBitLength) {
  const state = new Uint32Array(8);

  for (let i = 0; i < 8; i++) {
    const position = i * 4;
    state[i] =
      (initialStateBytes[position] |
        (initialStateBytes[position + 1] << 8) |
        (initialStateBytes[position + 2] << 16) |
        (initialStateBytes[position + 3] << 24)) >>>
      0;
  }

  const paddedLength = 64 * Math.floor((message.length + 72) / 64);
  const padded = new Uint8Array(paddedLength);
  padded.set(message, 0);
  padded[message.length] = 0x80;

  const totalBitLength = BigInt(priorBitLength) + BigInt(message.length) * 8n;
  for (let i = 0; i < 8; i++) {
    padded[paddedLength - 1 - i] = Number((totalBitLength >> BigInt(i * 8)) & 0xffn);
  }

  for (let offset = 0; offset < paddedLength; offset += 64) {
    compressSha256(state, padded, offset);
  }

  const result = new Uint8Array(32);
  for (let i = 0; i < 8; i++) {
    result[i * 4] = state[i] >>> 24;
    result[i * 4 + 1] = state[i] >>> 16;
    result[i * 4 + 2] = state[i] >>> 8;
    result[i * 4 + 3] = state[i];
  }

  return result;
}

function continueSha256(message, initialStateBytes) {
  return sha256WithState(message, initialStateBytes, 512);
}

function sha256(message) {
  const initialStateBytes = new Uint8Array(32);

  for (let i = 0; i < 8; i++) {
    initialStateBytes[i * 4] = sha256InitialState[i];
    initialStateBytes[i * 4 + 1] = sha256InitialState[i] >>> 8;
    initialStateBytes[i * 4 + 2] = sha256InitialState[i] >>> 16;
    initialStateBytes[i * 4 + 3] = sha256InitialState[i] >>> 24;
  }

  return sha256WithState(message, initialStateBytes, 0);
}

function hmacSha256(key, message) {
  if (key.length > 64) {
    key = sha256(key);
  }

  if (key.length < 64) {
    const paddedKey = new Uint8Array(64);
    paddedKey.set(key, 0);
    key = paddedKey;
  }

  const inner = new Uint8Array(64 + message.length);
  const outer = new Uint8Array(96);

  for (let i = 0; i < 64; i++) {
    inner[i] = key[i] ^ 0x36;
    outer[i] = key[i] ^ 0x5c;
  }

  inner.set(message, 64);
  outer.set(sha256(inner), 64);
  return sha256(outer);
}

function bytesToUint64Array(bytes) {
  if (bytes.length % 8 !== 0) {
    throw new Error("Length must be divisible by 8");
  }

  const result = new BigUint64Array(bytes.length / 8);
  for (let offset = 0; offset < bytes.length; offset += 8) {
    let hex = "";

    for (let i = 7; i >= 0; i--) {
      hex += bytes[offset + i].toString(16).padStart(2, "0");
    }

    result[offset / 8] = BigInt(`0x${hex}`);
  }

  return result;
}

function uint64ArrayToBytes(values) {
  const result = new Uint8Array(values.length * 8);

  for (let i = 0; i < values.length; i++) {
    const hex = values[i].toString(16).padStart(16, "0");

    for (let j = 0; j < 8; j++) {
      result[i * 8 + 7 - j] = parseInt(hex.substr(j * 2, 2), 16);
    }
  }

  return result;
}

function randomBytes(length) {
  const result = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    result[i] = Math.floor(Math.random() * 256);
  }

  return result;
}

function generateTokenWithEntropy(challenge, timestamp, entropy) {
  const challenge0 = readUint64(challenge, 0);
  const challenge1 = readUint64(challenge, 8);
  const challenge2 = readUint64(challenge, 16);
  const challenge3 = readUint64(challenge, 24);
  const nonce = readUint64(entropy, 0);
  const derived1 = multiplyAdd(challenge0, base, challenge1);
  const derived2 = multiplyAdd(challenge1, base, challenge2);
  const derived3 = multiplyAdd(challenge2, base, challenge3);
  const digest = deriveDigest(challenge0, derived1, derived2, derived3);
  const digest0 = readUint64(digest, 0);
  const digest1 = readUint64(digest, 8);
  const digest2 = readUint64(digest, 16);
  const digest3 = readUint64(digest, 24);
  const words = new BigUint64Array(10);

  words[0] = nonce;
  words[1] = multiplyAdd(words[0], negativeBase, timestamp);
  words[2] = multiplyAdd(words[1], negativeBase, challenge0);
  words[3] = multiplyAdd(words[2], negativeBase, derived1);
  words[4] = multiplyAdd(words[3], negativeBase, derived2);
  words[5] = multiplyAdd(words[4], negativeBase, derived3);
  words[6] = multiplyAdd(words[5], negativeBase, digest0);
  words[7] = multiplyAdd(words[6], negativeBase, digest1);
  words[8] = multiplyAdd(words[7], negativeBase, digest2);
  words[9] = multiplyAdd(words[8], negativeBase, digest3);

  const result = new Uint8Array(tokenSize);
  for (let i = 0; i < words.length; i++) {
    writeUint64(words[i], result, i * 8);
  }

  return result;
}

function generateToken(challenge) {
  const challengeWords = bytesToUint64Array(challenge);
  const transformed = new BigUint64Array(4);

  for (let i = 3; i > 0; i--) {
    transformed[i] = challengeWords[i] - base * challengeWords[i - 1];
  }

  transformed[0] = bytesToUint64Array(challenge.slice(0, 8))[0];
  const digest = hmacSha256(uint64ArrayToBytes(transformed), androidMacMessage);
  const source = [
    BigInt(Math.floor(Date.now() / 1000)),
    ...transformed,
    ...bytesToUint64Array(digest),
  ];
  const result = new BigUint64Array(10);
  result[0] = bytesToUint64Array(randomBytes(8))[0];

  for (let i = 0; i < 9; i++) {
    result[i + 1] = source[i] + base * result[i];
  }

  return uint64ArrayToBytes(result);
}

function writeUint64(value, destination, offset) {
  value &= mask64;

  for (let i = 0; i < 8; i++) {
    destination[offset + i] = Number(value & 0xffn);
    value >>= 8n;
  }
}

function readUint64(bytes, offset) {
  let result = 0n;

  for (let i = 7; i >= 0; i--) {
    result = (result << 8n) | BigInt(bytes[offset + i]);
  }

  return result;
}

function multiplyAdd(left, multiplier, right) {
  return (left * multiplier + right) & mask64;
}

function doubleContinuationSha256(message) {
  return continueSha256(continueSha256(message, continuationState1), continuationState2);
}

function deriveDigest(value0, value1, flagsValue, value3) {
  const header = new Uint8Array(24);
  writeUint64(value0, header, 0);
  writeUint64(value1, header, 8);
  writeUint64(flagsValue, header, 16);

  doubleContinuationSha256(header);

  const optionalDigests = [];
  const flags = Number(flagsValue & 14n);

  for (const marker of [2n, 4n]) {
    if ((flagsValue & marker) !== 0n) {
      const block = new Uint8Array(9);
      writeUint64(marker, block, 0);
      block[8] = flags;
      optionalDigests.push(sha256(block));
    }
  }

  let bit8Digest = null;
  if ((flagsValue & 8n) !== 0n) {
    const block = new Uint8Array(9);
    writeUint64(8n, block, 0);
    block[8] = flags;
    bit8Digest = sha256(block);
  }

  let optionalChain = null;
  if (optionalDigests.length > 0) {
    const joined = new Uint8Array(optionalDigests.length * 32);

    for (let i = 0; i < optionalDigests.length; i++) {
      joined.set(optionalDigests[i], i * 32);
    }

    optionalChain = doubleContinuationSha256(joined);
  }

  const bit8Chain = bit8Digest === null ? null : doubleContinuationSha256(bit8Digest);
  const combinedLength =
    (optionalChain === null ? 0 : optionalChain.length) +
    (bit8Chain === null ? 0 : bit8Chain.length);
  const combined = new Uint8Array(combinedLength);
  let offset = 0;

  if (optionalChain !== null) {
    combined.set(optionalChain, offset);
    offset += optionalChain.length;
  }

  if (bit8Chain !== null) {
    combined.set(bit8Chain, offset);
  }

  const derived = doubleContinuationSha256(combined);
  const key = new Uint8Array(32);
  writeUint64(value0, key, 0);
  writeUint64(value1, key, 8);
  writeUint64(flagsValue, key, 16);
  writeUint64(value3, key, 24);

  return hmacSha256(key, derived);
}

class Attestation {
  static patch() {
    if (Process.platform === "darwin") {
      Attestation.patchIos();
    } else {
      Attestation.patchAndroid();
    }

    this.isPatched = true;
  }

  static patchAndroid() {
    let challenge = null;

    Interceptor.attach(attestationFunction, {
      onEnter(args) {
        challenge = new Uint8Array(args[0].readPointer().readByteArray(32));
      },
    });

    Attestation.token = new NativeCallback(
      (output) => {
        if (challenge === null) {
          return;
        }

        output.writeByteArray(generateToken(challenge).buffer);
      },
      "void",
      ["pointer"],
    );

    Process.getModuleByName("libBSD.so")
      .base.add(androidTokenSlotOffset)
      .writePointer(Attestation.token);
  }

  static patchIos() {
    const operatorNewAddress = Module.findExportByName(null, "_Znwm");
    if (!operatorNewAddress) {
      return;
    }

    const operatorNew = new NativeFunction(operatorNewAddress, "pointer", ["size_t"]);
    const arc4randomBufAddress = Module.findExportByName(null, "arc4random_buf");
    const arc4randomBuf = arc4randomBufAddress
      ? new NativeFunction(arc4randomBufAddress, "void", ["pointer", "size_t"])
      : null;

    Interceptor.replace(
      attestationFunction,
      new NativeCallback(
        function (result) {
          let outputVector;

          try {
            outputVector = this.context.x8;
            if (!outputVector.isNull()) {
              outputVector.writePointer(NULL);
              outputVector.add(8).writePointer(NULL);
              outputVector.add(16).writePointer(NULL);
            }
          } catch (_) {
            return result;
          }

          try {
            if (result.isNull()) {
              return result;
            }

            const begin = result.readPointer();
            const end = result.add(8).readPointer();
            if (begin.isNull() || end.isNull() || end.sub(begin).toInt32() !== 32) {
              return result;
            }

            const challenge = new Uint8Array(begin.readByteArray(32));
            const timestamp = BigInt(Math.floor(Date.now() / 1000));
            let entropy;

            if (arc4randomBuf) {
              const buffer = Libc.malloc(8);
              arc4randomBuf(buffer, 8);
              entropy = new Uint8Array(buffer.readByteArray(8));
            } else {
              entropy = randomBytes(8);
            }

            const token = generateTokenWithEntropy(challenge, timestamp, entropy);
            const output = operatorNew(tokenSize);
            if (output.isNull()) {
              return result;
            }

            output.writeByteArray(token.buffer);
            outputVector.writePointer(output);
            outputVector.add(16).writePointer(output.add(tokenSize));
            outputVector.add(8).writePointer(output.add(tokenSize));
          } catch (_) {}

          return result;
        },
        "pointer",
        ["pointer"],
      ),
    );
  }
}

Attestation.isPatched = false;

exports.Attestation = Attestation;
