// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { Config } = require("../../../../suitcase/config/Config");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicData } = require("./LogicData");
const { LogicDataTables } = require("./LogicDataTables");
const { LogicGameModeVariationData } = require("./LogicGameModeVariationData");
const { LogicLocationThemeData } = require("./LogicLocationThemeData");

const LogicLocationData_ctor = new NativeFunction(Libg.offset(11442604, 10557016), "void", [
  "pointer",
]);
const disabledColumnAddress = Libg.offset(19134524, 17798356);
const mapColumnAddress = Libg.offset(19134532, 17798364);
const campaignGroundColumnAddress = Libg.offset(19134536, 17798368);
const bannerSwfColumnAddress = Libg.offset(19134540, 17798372);
const bannerExportColumnAddress = Libg.offset(19134544, 17798376);
const communityCreditColumnAddress = Libg.offset(19134548, 17798380);
const trainingGroundsColumnAddress = Libg.offset(19134556, 17798388);
const locationThemeOffset = LogicMemory.offset(88);
const gameModeVariationOffset = LogicMemory.offset(96);

class LogicLocationData extends LogicData {
  get gameModeVariation() {
    return new LogicGameModeVariationData(this.readPointer(gameModeVariationOffset));
  }
  set gameModeVariation(value) {
    this.writePointer(gameModeVariationOffset, value.instance);
  }
  get locationTheme() {
    return new LogicLocationThemeData(this.readPointer(locationThemeOffset));
  }
  set locationTheme(value) {
    this.writePointer(locationThemeOffset, value.instance);
  }

  isDisabled() {
    return this.getBooleanValueAt(disabledColumnAddress.readInt());
  }
  getMap() {
    return this.getStringValueAt(mapColumnAddress.readInt());
  }
  isSupportingCampaignGround() {
    return this.getBooleanValueAt(campaignGroundColumnAddress.readInt());
  }
  getBannerOverrideSWF() {
    return this.getStringValueAt(bannerSwfColumnAddress.readInt());
  }
  getBannerOverrideExportName() {
    return this.getStringValueAt(bannerExportColumnAddress.readInt());
  }
  getCommunityCredit() {
    return this.getStringValueAt(communityCreditColumnAddress.readInt());
  }
  isTrainingGroundsEnabled() {
    return this.getBooleanValueAt(trainingGroundsColumnAddress.readInt());
  }

  static applyDefaultEnvironments() {
    if (!Config.config.DefaultEnvironments) return;
    const table = LogicDataTables.getTable(LogicDataTables.table.Locations);
    const context = {
      firstThemePerGroup: this.collectFirstThemePerSizeGroup(table),
      hardcodedCache: new Map(),
      softCache: new Map(),
    };
    const count = table.getItemCount();
    for (let index = 0; index < count; index++) {
      const location = table.getItemAt(index);
      if (location) this.applyDefaultThemeFor(location, context);
    }
  }

  static themeSizeGroupKey(variation, width, height) {
    return "".concat(variation, "_", width, "_", height);
  }

  static collectFirstThemePerSizeGroup(table) {
    const themes = new Map();
    const count = table.getItemCount();
    for (let index = 0; index < count; index++) {
      const location = table.getItemAt(index);
      if (!location) continue;
      const theme = location.locationTheme;
      if (theme.instance.isNull() || theme.isDisabled()) continue;
      const key = this.themeSizeGroupKey(
        location.gameModeVariation.getVariation(),
        theme.getMapWidth(),
        theme.getMapHeight(),
      );
      if (!themes.has(key)) themes.set(key, theme);
    }
    return themes;
  }

  static applyDefaultThemeFor(location, context) {
    const currentTheme = location.locationTheme;
    if (currentTheme.instance.isNull()) return;
    const theme = this.chooseDefaultThemeFor(location, currentTheme, context);
    if (theme && theme.getGlobalID() !== currentTheme.getGlobalID()) {
      location.locationTheme = theme;
    }
  }

  static chooseDefaultThemeFor(location, currentTheme, context) {
    const variation = location.gameModeVariation.getVariation();
    const width = currentTheme.getMapWidth();
    const height = currentTheme.getMapHeight();
    const hardcoded = this.resolveHardcodedThemeForSize(
      variation,
      width,
      height,
      context.hardcodedCache,
    );
    if (hardcoded) return hardcoded;
    const soft = this.resolveSoftOverrideForVariation(variation, context.softCache);
    if (soft) return soft;
    return context.firstThemePerGroup.get(this.themeSizeGroupKey(variation, width, height)) ?? null;
  }

  static resolveHardcodedThemeForSize(variation, width, height, cache) {
    const key = this.themeSizeGroupKey(variation, width, height);
    const cached = cache.get(key);
    if (cached !== undefined) return cached;
    const rule = this.DEFAULT_THEME_RULES.find(
      (entry) => entry.variation === variation && entry.width === width && entry.height === height,
    );
    if (!rule) {
      cache.set(key, null);
      return null;
    }
    const theme = this.candidateThemeMatchingSize(
      LogicDataTables.getLocationThemeByName(rule.theme),
      width,
      height,
    );
    cache.set(key, theme);
    return theme;
  }

  static candidateThemeMatchingSize(theme, width, height) {
    if (
      theme.instance.isNull() ||
      theme.isDisabled() ||
      theme.getMapWidth() !== width ||
      theme.getMapHeight() !== height
    )
      return null;
    return theme;
  }

  static resolveSoftOverrideForVariation(variation, cache) {
    const cached = cache.get(variation);
    if (cached !== undefined) return cached;
    const name = this.DEFAULT_THEME_BY_VARIATION_SOFT[variation];
    if (!name) {
      cache.set(variation, null);
      return null;
    }
    const theme = LogicDataTables.getLocationThemeByName(name);
    const result = theme.instance.isNull() || theme.isDisabled() ? null : theme;
    cache.set(variation, result);
    return result;
  }

  static patch() {
    Interceptor.replace(
      LogicLocationData_ctor,
      new NativeCallback(
        (instance) => {
          LogicLocationData_ctor(instance);
          this.applyManualOverrideIfConfigured(instance);
        },
        "void",
        ["pointer"],
      ),
    );
  }

  static applyManualOverrideIfConfigured(instance) {
    const name = LogicData.getName(instance);
    if (!(name in Config.config.LocationThemeOverrides)) return;
    const location = new LogicLocationData(instance);
    const overrideName = Config.config.LocationThemeOverrides[name];
    const theme = LogicDataTables.getLocationThemeByName(overrideName);
    if (location.locationTheme.instance.isNull() || theme.instance.isNull() || theme.isDisabled())
      delete Config.config.LocationThemeOverrides[name];
    else location.locationTheme = theme;
  }
}

LogicLocationData.DEFAULT_THEME_BY_VARIATION_SOFT = {
  0: "Mine",
  2: "Default",
  3: "Default",
  5: "Grassfield",
  6: "DefaultShowdown",
  7: "BBArena",
  8: "Mortuary",
  9: "DefaultShowdown",
  10: "MadEvilManor",
  17: "Arcade",
  20: "Rooftop",
  22: "BBArena",
  23: "BBArena",
  24: "Default",
  25: "Default",
  26: "ScrapyardShowdown",
  31: "SBGrassfield",
  32: "SBGrassfield",
  33: "SBGrassfield",
  35: "SBGrassfield",
  37: "Hub",
  38: "DefaultShowdown",
  45: "AirHockey",
  46: "Mine",
  47: "ScrapyardShowdown",
  48: "IslandShowdown",
  49: "Grassfield",
  50: "Rooftop",
  52: "BBArena",
  53: "AirHockey",
  55: "BBArena",
  56: "Mortuary",
  57: "AirHockey",
  58: "Pyramidquest",
  60: "KatanaKingdom",
  61: "MadEvilManor",
  63: "Hub",
  64: "BandStand",
  65: "Mine",
  66: "BBArena",
  68: "Hub",
  70: "Default",
  72: "DefaultShowdown",
  75: "DefaultShowdown",
  76: "Grassfield",
  77: "Pyramidquest",
  78: "DefaultShowdown",
  79: "AirHockey",
};

const rule = (variation, width, height, theme) => ({ variation, width, height, theme });
LogicLocationData.DEFAULT_THEME_RULES = [
  rule(0, 21, 33, "Mine"),
  rule(2, 21, 33, "Default"),
  rule(3, 21, 33, "Default"),
  rule(5, 21, 33, "Grassfield"),
  rule(6, 21, 33, "IslandShowdown"),
  rule(6, 60, 60, "DefaultShowdown"),
  rule(7, 21, 33, "BBArena"),
  rule(8, 60, 60, "Mortuary"),
  rule(9, 21, 33, "IslandShowdown"),
  rule(9, 60, 60, "DefaultShowdown"),
  rule(10, 21, 33, "MadEvilManor"),
  rule(17, 21, 33, "Arcade"),
  rule(20, 21, 33, "Rooftop"),
  rule(22, 21, 33, "BBArena"),
  rule(23, 21, 33, "BBArena"),
  rule(24, 21, 33, "Default"),
  rule(25, 21, 33, "Default"),
  rule(25, 27, 39, "Default"),
  rule(26, 60, 60, "ScrapyardShowdown"),
  rule(31, 21, 33, "SBGrassfield"),
  rule(31, 60, 60, "DefaultShowdown"),
  rule(32, 21, 33, "SBGrassfield"),
  rule(32, 60, 60, "DefaultShowdown"),
  rule(33, 21, 33, "SBGrassfield"),
  rule(33, 60, 60, "DefaultShowdown"),
  rule(35, 21, 33, "SBGrassfield"),
  rule(35, 60, 60, "DefaultShowdown"),
  rule(37, 21, 33, "Hub"),
  rule(45, 21, 33, "AirHockey"),
  rule(46, 21, 33, "Mine"),
  rule(47, 60, 60, "ScrapyardShowdown"),
  rule(48, 21, 33, "IslandShowdown"),
  rule(48, 60, 60, "DefaultShowdown"),
  rule(49, 21, 33, "Grassfield"),
  rule(50, 21, 33, "Rooftop"),
  rule(52, 21, 33, "BBArena"),
  rule(53, 21, 33, "AirHockey"),
  rule(55, 21, 33, "BBArena"),
  rule(56, 21, 33, "Mortuary"),
  rule(57, 21, 33, "AirHockey"),
  rule(58, 21, 33, "Pyramidquest"),
  rule(59, 60, 60, "DefaultShowdown"),
  rule(60, 21, 33, "KatanaKingdom"),
  rule(60, 60, 60, "DefaultShowdown"),
  rule(61, 21, 33, "MadEvilManor"),
  rule(61, 60, 60, "DefaultShowdown"),
  rule(62, 60, 60, "DefaultShowdown"),
  rule(63, 21, 33, "Hub"),
  rule(64, 21, 33, "BandStand"),
  rule(64, 60, 60, "DefaultShowdown"),
  rule(65, 21, 33, "Mine"),
  rule(65, 60, 60, "DefaultShowdown"),
  rule(66, 21, 33, "BBArena"),
  rule(66, 60, 60, "DefaultShowdown"),
  rule(67, 60, 60, "DefaultShowdown"),
  rule(68, 21, 33, "Hub"),
  rule(69, 60, 60, "DefaultShowdown"),
  rule(70, 21, 33, "Default"),
  rule(71, 60, 60, "DefaultShowdown"),
  rule(72, 60, 60, "DefaultShowdown"),
  rule(73, 60, 60, "DefaultShowdown"),
  rule(74, 60, 60, "DefaultShowdown"),
  rule(75, 60, 60, "DefaultShowdown"),
  rule(76, 21, 33, "Grassfield"),
  rule(77, 21, 33, "Pyramidquest"),
  rule(77, 60, 60, "DefaultShowdown"),
  rule(78, 60, 60, "DefaultShowdown"),
  rule(79, 21, 33, "AirHockey"),
];

exports.LogicLocationData = LogicLocationData;
exports.locationThemeOffset = locationThemeOffset;
exports.gameModeVariationOffset = gameModeVariationOffset;
