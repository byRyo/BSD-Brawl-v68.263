// @ts-nocheck
const { CustomTextEncoder } = require("../crypto/CustomTextEncoder");
const { EDebugger } = require("../debug/EDebugger");
const { BSDApi } = require("./BSDApi");
const { HTTPResponse } = require("./HTTPResponse");

const SLEEP_DURATION = 2500;
const READ_TIMEOUT = 4000;
const CONNECT_TIMEOUT = 4000;

class BSDHttpClient {
  constructor(host, port) {
    this.host = BSDApi.host;
    this.port = BSDApi.port;
    this.response = "";
    if (host) this.host = host;
    if (port) this.port = port;
  }

  static get shouldSleep() {
    if (this._shouldSleep && Date.now() - this.sleepStartTime >= SLEEP_DURATION) {
      this._shouldSleep = false;
    }
    return this._shouldSleep;
  }

  static startSleep() {
    this._shouldSleep = true;
    this.sleepStartTime = Date.now();
  }

  static stopSleep() {
    this._shouldSleep = false;
  }

  async get(route) {
    const host = this.host;
    const port = this.port;
    const request = [
      "GET ".concat(route, " HTTP/1.1"),
      "Host: ".concat(host),
      "Connection: close",
      "",
      "",
    ].join("\r\n");
    try {
      const connection = await this.connectWithTimeout(host, port);
      if (!connection) throw new Error("Connection is null!");
      const encoded = CustomTextEncoder.encode(request);
      const buffer = CustomTextEncoder.toArrayBuffer(encoded);
      await connection.output.write(buffer);
      const input = connection.input;
      this.response = "";
      while (true) {
        const chunk = await this.readWithTimeout(input, 4096, READ_TIMEOUT);
        if (!chunk || chunk.byteLength === 0) break;
        this.response += CustomTextEncoder.decode(chunk);
      }
      await connection.close();
      return this.parseResponse(this.response);
    } catch (error) {
      EDebugger.addMessage(EDebugger.ERROR, "Socket error (GET): " + error);
      return HTTPResponse.getNullResponse();
    }
  }

  async post(route, body, onComplete) {
    const host = this.host;
    const port = this.port;
    const encodedBody = CustomTextEncoder.encode(body);
    const headers = [
      "POST ".concat(route, " HTTP/1.1"),
      "Host: ".concat(host),
      "Content-Type: application/json",
      "Content-Length: ".concat(encodedBody.length),
      "Connection: close",
      "",
      "",
    ].join("\r\n");
    try {
      const connection = await this.connectWithTimeout(host, port);
      if (!connection) throw new Error("Connection is null!");
      const encodedHeaders = CustomTextEncoder.encode(headers);
      const request = new Uint8Array(encodedHeaders.length + encodedBody.length);
      request.set(encodedHeaders, 0);
      request.set(encodedBody, encodedHeaders.length);
      await connection.output.write(request.buffer);
      const input = connection.input;
      this.response = "";
      while (true) {
        const chunk = await this.readWithTimeout(input, 4096, READ_TIMEOUT);
        if (!chunk || chunk.byteLength === 0) break;
        this.response += CustomTextEncoder.decode(chunk);
      }
      await connection.close();
      if (onComplete) onComplete();
      return this.parseResponse(this.response);
    } catch (error) {
      EDebugger.addMessage(EDebugger.ERROR, "Couldn't connect to", host, route);
      EDebugger.addMessage(EDebugger.ERROR, "Socket error:" + error);
      if (onComplete) onComplete();
      return HTTPResponse.getNullResponse();
    }
  }

  parseResponse(response) {
    if (!response) return HTTPResponse.getNullResponse();
    const [rawHeaders, body] = response.split("\r\n\r\n", 2);
    if (rawHeaders && body) return new HTTPResponse(rawHeaders, body);
    EDebugger.addMessage(EDebugger.ERROR, "Incorrect response!");
    return HTTPResponse.getNullResponse();
  }

  getResponse() {
    if (this.response) return this.response;
    EDebugger.addMessage(EDebugger.ERROR, "Response is empty!");
  }

  async readWithTimeout(input, size, timeout) {
    try {
      return await Promise.race([
        input.read(size),
        new Promise((resolve) => setTimeout(() => resolve(null), timeout)),
      ]);
    } catch (_error) {
      return null;
    }
  }

  async connectWithTimeout(host, port) {
    return await Promise.race([
      Socket.connect({ host, port }),
      new Promise((resolve) => setTimeout(() => resolve(null), CONNECT_TIMEOUT)),
    ]);
  }
}

BSDHttpClient._shouldSleep = false;
BSDHttpClient.sleepStartTime = 0;

exports.BSDHttpClient = BSDHttpClient;
