// @ts-nocheck
"use strict";

export class DeviceSpecifications {
  static platform = Process.platform === "linux" ? "android" : "ios";
  static arch = Process.arch;
}
