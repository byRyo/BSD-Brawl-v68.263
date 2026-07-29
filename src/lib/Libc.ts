// @ts-nocheck
"use strict";

export class Libc {
  static getExportByName(moduleName, exportName) {
    return Process.platform !== "darwin"
      ? Module.getExportByName(moduleName, exportName)
      : Module.getExportByName("libSystem.B.dylib", exportName);
  }

  static getaddrinfo(node, service, hints, result) {
    return new NativeFunction(Module.findExportByName(null, "getaddrinfo"), "int", [
      "pointer",
      "pointer",
      "pointer",
      "pointer",
    ])(node, service, hints, result);
  }

  static access = new NativeFunction(Libc.getExportByName("libc.so", "access"), "int", [
    "pointer",
    "int",
  ]);
  static malloc = new NativeFunction(Libc.getExportByName("libc.so", "malloc"), "pointer", [
    "size_t",
  ]);
  static read = new NativeFunction(Libc.getExportByName("libc.so", "read"), "long", [
    "int",
    "pointer",
    "size_t",
  ]);
  static open = new NativeFunction(Libc.getExportByName("libc.so", "open"), "int", [
    "pointer",
    "int",
  ]);
  static lseek = new NativeFunction(Libc.getExportByName("libc.so", "lseek"), "long", [
    "int",
    "long",
    "int",
  ]);
  static close = new NativeFunction(Libc.getExportByName("libc.so", "close"), "int", ["int"]);
  static calloc = new NativeFunction(Libc.getExportByName("libc.so", "calloc"), "pointer", [
    "size_t",
    "size_t",
  ]);
  static free = new NativeFunction(Libc.getExportByName("libc.so", "free"), "void", ["pointer"]);
  static getpid = new NativeFunction(Libc.getExportByName("libc.so", "getpid"), "int", []);
  static kill = new NativeFunction(Libc.getExportByName("libc.so", "kill"), "void", ["int", "int"]);
  static mkdir = new NativeFunction(Libc.getExportByName("libc.so", "mkdir"), "int", [
    "pointer",
    "uint",
  ]);
  static system = new NativeFunction(Libc.getExportByName("libc.so", "system"), "int", ["pointer"]);
  static unlink = new NativeFunction(Libc.getExportByName("libc.so", "unlink"), "int", ["pointer"]);
  static usleep = new NativeFunction(Libc.getExportByName("libc.so", "usleep"), "int", ["uint"]);
  static time = new NativeFunction(Libc.getExportByName("libc.so", "time"), "long", ["pointer"]);
  static android_log_write =
    Process.platform === "linux"
      ? new NativeFunction(Libc.getExportByName(null, "__android_log_write"), "int", [
          "int",
          "pointer",
          "pointer",
        ])
      : null;
  static systemPropertyGet =
    Process.platform === "linux"
      ? new NativeFunction(Libc.getExportByName(null, "__system_property_get"), "int", [
          "pointer",
          "pointer",
        ])
      : null;
}
