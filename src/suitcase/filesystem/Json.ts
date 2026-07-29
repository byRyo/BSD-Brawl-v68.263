// @ts-nocheck
"use strict";

import { ModProperties } from "../config/ModProperties";
import { EDebugger } from "../debug/EDebugger";

export class Json {
  static formatJSONString(value, indentation = ModProperties.environment === "dev" ? 4 : 0) {
    return JSON.stringify(value, null, indentation);
  }

  static formatLogJSON(type, message) {
    EDebugger.logsObject[Date.now()] = { type: ["ERROR", "WARNING"][type], message };
    return this.formatJSONString(EDebugger.logsObject, 4);
  }
}
