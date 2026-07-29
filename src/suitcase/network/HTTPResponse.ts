// @ts-nocheck
const { EDebugger } = require("../debug/EDebugger");
const { CustomTextEncoder } = require("../crypto/CustomTextEncoder");

class HTTPResponse {
  constructor(rawHeaders, body) {
    this._rawHeaders = rawHeaders;
    this._body = body;
  }

  get statusCode() {
    const statusLine = this._rawHeaders.split("\r\n")[0].split(" ");
    if (statusLine.length < 2) {
      EDebugger.addMessage(EDebugger.ERROR, "Cannot parse status code.");
      return -1;
    }
    return parseInt(statusLine[1]);
  }

  get body() {
    return this._body;
  }

  get bytes() {
    return CustomTextEncoder.encode(this.body);
  }

  get json() {
    try {
      if (!this._body || typeof this._body !== "string") return null;
      const body = this._body.trim();
      const isObject = body.startsWith("{") && body.endsWith("}");
      const isArray = body.startsWith("[") && body.endsWith("]");
      return isObject || isArray ? JSON.parse(this._body) : null;
    } catch (_error) {
      return null;
    }
  }

  get headers() {
    const headers = {};
    const lines = this._rawHeaders.split(/\r?\n/);
    for (let index = 1; index < lines.length; index++) {
      const line = lines[index].trim();
      if (!line) break;
      const separator = line.indexOf(":");
      if (separator !== -1) {
        headers[line.slice(0, separator).trim().toLowerCase()] = line.slice(separator + 1).trim();
      }
    }
    return headers;
  }

  static getNullResponse() {
    return new HTTPResponse("", "");
  }
}

exports.HTTPResponse = HTTPResponse;
