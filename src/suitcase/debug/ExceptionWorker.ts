// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionWorker = void 0;

const { PlayerInfo } = require("../../laser/client/game/friends/PlayerInfo");
const { Libc } = require("../../lib/Libc");
const { ModProperties } = require("../config/ModProperties");
const { FileManager } = require("../filesystem/FileManager");
const { BSDMessageManager } = require("../network/messaging/BSDMessageManager");
const { LogExceptionMessage } = require("../network/messaging/message/LogExceptionMessage");
const { Breadcrumbs } = require("./Breadcrumbs");
const { Logcat } = require("./Logcat");
const { EDebugger } = require("./EDebugger");

const ignoredErrors = [
  "could not connect",
  "No address associated",
  "Connection reset by peer",
  "Connection timed out",
  "Software caused connection abort",
  "access violation accessing 0x0",
];

function findGameModule() {
  try {
    for (const module of Process.enumerateModules()) {
      if (
        module.name.includes("base.art") ||
        module.name === "laser" ||
        module.name.startsWith("laser")
      ) {
        return { base: module.base, name: module.name };
      }
    }
  } catch (_error) {}
  return null;
}

function formatRegisters(context) {
  const registers = [];
  for (let i = 0; i < 29; i++) registers.push(`x${i}=${context[`x${i}`]}`);
  registers.push(`fp=${context.fp}`, `lr=${context.lr}`, `sp=${context.sp}`, `pc=${context.pc}`);
  return registers.join("  ");
}

function formatBacktrace(context, module) {
  try {
    return Thread.backtrace(context, Backtracer.FUZZY)
      .map((address) => {
        if (module) {
          const offset = address.sub(module.base).toUInt32();
          if (offset > 0 && offset < 0x10000000) return `${module.name}+0x${offset.toString(16)}`;
        }
        return address.toString();
      })
      .join("\n");
  } catch (_error) {
    return "(backtrace failed)";
  }
}

class ExceptionWorker {
  static init() {
    this.READY = true;
    this.flushPendingCrashLog();
    this.installJsErrorTrap();
    this.installNativeExceptionHandler();
  }

  static flushPendingCrashLog() {
    if (!FileManager.isFilepath(this.crashLogDir)) return;
    const crashLog = FileManager.readFile(this.crashLogDir, "r");
    if (!crashLog) return;
    const tag = FileManager.readFile(this.tagDir, "r");
    this.logException("CRASH", crashLog, tag);
    Libc.unlink(Memory.allocUtf8String(this.crashLogDir));
  }

  static installJsErrorTrap() {
    const originalPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (error, stack) => {
      const result = originalPrepareStackTrace(error, stack);
      const message = String(result);
      ModProperties.isDev() && Logcat.logDebug(message);
      if (!ignoredErrors.some((ignoredError) => message.includes(ignoredError))) {
        EDebugger.addMessage(EDebugger.ERROR, message);
        this.logException("JSERROR", message, ["", "Breadcrumbs:", Breadcrumbs.dump()].join("\n"));
      }
      return result;
    };
  }

  static installNativeExceptionHandler() {
    const isDarwin = Process.platform === "darwin";
    const module = findGameModule();
    Process.setExceptionHandler((details) => {
      if (this.IS_EXCEPTION_THROWN) return false;
      const pc = details.context.pc;
      const context = details.context;

      if (!isDarwin && module) {
        const offset = pc.sub(module.base).toUInt32();
        if (offset === 7115504) {
          context.pc = context.lr;
          return true;
        }
        if (offset === 14023136) {
          context.x0 = ptr(0);
          context.pc = context.lr;
          return true;
        }
        if (offset === 12064248) {
          context.x0 = ptr(0);
          context.pc = context.lr;
          return true;
        }
      }

      this.IS_EXCEPTION_THROWN = true;
      const lines = [];
      if (module) {
        const offset = pc.sub(module.base).toUInt32();
        lines.push(`Crash: ${details.type} in ${module.name} + 0x${offset.toString(16)}`);
      } else {
        lines.push(`Crash: ${details.type} at pc=${pc}`);
      }
      lines.push(`Registers:\n${formatRegisters(context)}`);
      lines.push(`Backtrace:\n${formatBacktrace(details.context, module)}`);
      if (Breadcrumbs.hasCrumbs()) {
        lines.push(`Breadcrumbs:\n${Breadcrumbs.dump()}`);
        Breadcrumbs.clear();
      }
      const crashLog = lines.join("\n");
      Logcat.logError(crashLog);
      this.saveCrashLog(crashLog);
      return false;
    });
  }

  static logException(type, message, playerTag) {
    this.READY && BSDMessageManager.sendMessage(new LogExceptionMessage(type, message, playerTag));
  }

  static get crashLogDir() {
    return FileManager.saveDirPath + this.CRASHLOG_FILE;
  }

  static get tagDir() {
    return FileManager.saveDirPath + this.PLAYERTAG_FILE;
  }

  static saveCrashLog(crashLog) {
    FileManager.writeToFile(this.tagDir, "w", PlayerInfo.tag ?? "UNKNOWN");
    FileManager.writeToFile(this.crashLogDir, "w", crashLog);
  }
}

ExceptionWorker.CRASHLOG_FILE = "/bsd_crash.log";
ExceptionWorker.PLAYERTAG_FILE = "/bsd_tag.log";
ExceptionWorker.IS_EXCEPTION_THROWN = false;
ExceptionWorker.READY = false;

exports.ExceptionWorker = ExceptionWorker;
