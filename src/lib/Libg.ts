// @ts-nocheck
"use strict";

export class Libg {
  static libgBeginOffset = NULL;

  static init() {
    this.libgBeginOffset =
      Process.platform === "darwin"
        ? Process.getModuleByName("laser").base
        : this.findEngineModuleBase();
  }

  static findEngineModuleBase() {
    for (const module of Process.enumerateModules()) {
      if (module.name.indexOf("libg.so") > -1 && module.size > 10485760) return module.base;
    }
    throw new Error("engine module 'libg.so' not found");
  }

  static offset(android = 0, ios = 0) {
    if (this.libgBeginOffset.isNull()) this.init();
    if (Process.platform === "linux") return this.libgBeginOffset.add(android);
    if (Process.platform === "darwin") return this.libgBeginOffset.add(ios);
    return NULL;
  }
}
