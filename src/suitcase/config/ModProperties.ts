// @ts-nocheck
class ModProperties {
  static isRelease() {
    return ModProperties.environment === "release";
  }

  static isPlus() {
    return ModProperties.environment === "plus";
  }

  static isDev() {
    return ModProperties.environment === "dev";
  }
}

ModProperties.environment = "plus";
ModProperties.version = "68.263-38";
ModProperties.showPatchNotesFor = "68.263-0";
ModProperties.isIntegration = false;

class CustomModNames {}
CustomModNames.oldRankMod = "OldRankMod";

exports.ModProperties = ModProperties;
exports.CustomModNames = CustomModNames;
