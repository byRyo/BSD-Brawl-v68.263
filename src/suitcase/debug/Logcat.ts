// @ts-nocheck
"use strict";

import { Libc } from "../../lib/Libc";
import { Config } from "../config/Config";

export class Logcat {
  static logPriority = {
    UNKNOWN: 0,
    DEFAULT: 1,
    VERBOSE: 2,
    DEBUG: 3,
    INFO: 4,
    WARN: 5,
    ERROR: 6,
    FATAL: 7,
    SILENT: 8,
  };

  constructor() {
    if (Config.config.useDebugLogging) {
      const original = Error.prepareStackTrace;
      Error.prepareStackTrace = (error, stack) => {
        Config.config.useDebugLogging && this.logError(original(error, stack));
      };
    }
  }

  static _log(priority, tag, message) {
    const tagPointer = Memory.allocUtf8String(tag);
    const messagePointer = Memory.allocUtf8String(message.toString());
    if (Libc.android_log_write) {
      Libc.android_log_write(priority, tagPointer, messagePointer);
      return;
    }
    const name =
      Object.entries(this.logPriority).find(([, value]) => value === priority)?.[0] ?? priority;
    console.log(`[${name}] ${tag}:`, message);
  }

  static log(priority, tag = "BSD", message) {
    this._log(priority, tag, message);
  }
  static logDebug(message) {
    this._log(this.logPriority.DEBUG, "BSD", message);
  }
  static logError(message) {
    this._log(this.logPriority.ERROR, "BSD", message);
  }
  static logInfo(message) {
    this._log(this.logPriority.INFO, "BSD", message);
  }
}
