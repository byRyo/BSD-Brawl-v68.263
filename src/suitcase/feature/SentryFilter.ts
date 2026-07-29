// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryFilter = void 0;
class SentryFilter {
  static patch() {
    const module = Process.findModuleByName(this.LIBSENTRY_NAME);
    if (!module) return;
    this.replaceWithNoop(module, "sentry_init", () => -1, "int", ["pointer"]);
    this.replaceWithNoop(module, "sentry_envelope_serialize", () => NULL, "pointer", [
      "pointer",
      "pointer",
    ]);
    this.replaceWithNoop(module, "sentry_envelope_write_to_file", () => -1, "int", [
      "pointer",
      "pointer",
    ]);
    this.replaceWithNoop(module, "sentry_envelope_write_to_file_n", () => -1, "int", [
      "pointer",
      "pointer",
      "uint64",
    ]);
    this.replaceWithNoop(module, "sentry_handle_exception", () => -1, "int", ["pointer"]);
    this.replaceWithNoop(module, "sentry_capture_minidump", () => NULL, "pointer", ["pointer"]);
    this.replaceWithNoop(module, "sentry_capture_minidump_n", () => NULL, "pointer", [
      "pointer",
      "uint64",
    ]);
    this.replaceWithNoop(module, "sentry_flush", () => 0, "int", ["uint64"]);
  }
  static replaceWithNoop(module, name, callback, returnType, argumentTypes) {
    const address = module.findExportByName(name);
    if (address)
      Interceptor.replace(address, new NativeCallback(callback, returnType, argumentTypes));
  }
}
exports.SentryFilter = SentryFilter;
SentryFilter.LIBSENTRY_NAME = "libsentry.so";
