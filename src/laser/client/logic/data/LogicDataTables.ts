// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicDataTable } = require("./LogicDataTable");
const { GlobalID } = require("../../game/utils/GlobalID");
const { LogicThemeData } = require("./LogicThemeData");
const { LogicData } = require("./LogicData");
const { LogicCharacterData } = require("./LogicCharacterData");
const { LogicMusicData } = require("./LogicMusicData");
const { LogicSkinData } = require("./LogicSkinData");
const { LogicSkinConfData } = require("./LogicSkinConfData");
const { LogicResourceData } = require("./LogicResourceData");
const { LogicEmoteData } = require("./LogicEmoteData");
const { LogicCardData } = require("./LogicCardData");
const { LogicRandomRewardContainerData } = require("./LogicRandomRewardContainerData");
const { LogicRandomRewardData } = require("./LogicRandomRewardData");
const { LogicSprayData } = require("./LogicSprayData");
const { LogicColorGradientData } = require("./LogicColorGradientData");
const { ThemeSelectorManager } = require("../../../../suitcase/modmenu/ThemeSelector");
const { SkinSelector } = require("../../../../suitcase/feature/SkinSelector");
const { StringTable } = require("../../game/text/StringTable");
const { LogicEffectData } = require("./LogicEffectData");
const { LogicPlayerTitleData } = require("./LogicPlayerTitleData");
const { LogicLocationThemeData } = require("./LogicLocationThemeData");
const { LogicGameModeVariationData } = require("./LogicGameModeVariationData");
const { LogicLocationData } = require("./LogicLocationData");
const { LogicFameTierData } = require("./LogicFameTierData");
const { Config } = require("../../../../suitcase/config/Config");
const { GameMain } = require("../../GameMain");

const getCardForMetaTypeNative = new NativeFunction(Libg.offset(11327292, 10460372), "pointer", [
  "pointer",
  "int",
]);
const getFameTierByFameNative = new NativeFunction(Libg.offset(11362672, 10490504), "pointer", [
  "int",
]);
const dataLoadedAddress = Libg.offset(8497692, 10476136);
const isTablesLoadedOffset = Libg.offset(19853056, 18158424);
const tableArrayAddress = Libg.offset(19853064, 18351984);
const lvlUpMaterialAddress = Libg.offset(19853096, 18353224);
const fameAddress = Libg.offset(19853232, 18353360);
const TRAINING_LOCATION_NAME = "Training";
const MAX_TABLE_ID = 150;

class LogicDataTables {
  static getTableItemByName(tableId, name) {
    return this.getTable(tableId).getItemByName(name);
  }

  static getTable(tableId) {
    const platformTableId = Process.platform === "darwin" ? tableId : tableId + 38;
    return new LogicDataTable(tableArrayAddress.add(8 * platformTableId).readPointer());
  }

  static getLvlUpMaterialData() {
    return new LogicResourceData(lvlUpMaterialAddress.readPointer());
  }

  static getFameData() {
    return new LogicResourceData(fameAddress.readPointer());
  }

  static getFameTierByFame(fame) {
    const instance = getFameTierByFameNative(fame);
    return instance.isNull() ? null : new LogicFameTierData(instance);
  }

  static getCardForMetaType(character, metaType) {
    const instance = getCardForMetaTypeNative(character.instance, metaType);
    return instance.isNull() ? null : new LogicCardData(instance);
  }

  static getTrainingLocationData() {
    const location = this.getLocationByName(TRAINING_LOCATION_NAME);
    return !location || location.instance.isNull() ? null : location;
  }

  static getDataByPtr(instance) {
    if (instance.isNull()) return null;
    const data = new LogicData(instance);
    return this.getDataById(data.getGlobalID());
  }

  static getDataById(classId, instanceId) {
    const globalId =
      instanceId !== undefined ? GlobalID.createGlobalID(classId, instanceId) : classId;
    const tableId = GlobalID.getClassID(globalId);
    const instance = this.lookupDataPointer(tableId, GlobalID.getInstanceID(globalId));
    if (!instance || instance.isNull()) return null;
    return this.wrapDataForTable(tableId, instance);
  }

  static wrapDataForTable(tableId, instance) {
    const wrappers = {
      [this.table.Music]: LogicMusicData,
      [this.table.Characters]: LogicCharacterData,
      [this.table.Themes]: LogicThemeData,
      [this.table.Skins]: LogicSkinData,
      [this.table.SkinConfs]: LogicSkinConfData,
      [this.table.Emotes]: LogicEmoteData,
      [this.table.Cards]: LogicCardData,
      [this.table.RandomRewardContainers]: LogicRandomRewardContainerData,
      [this.table.RandomRewards]: LogicRandomRewardData,
      [this.table.Sprays]: LogicSprayData,
      [this.table.ColorGradients]: LogicColorGradientData,
      [this.table.Effects]: LogicEffectData,
      [this.table.PlayerTitles]: LogicPlayerTitleData,
      [this.table.LocationThemes]: LogicLocationThemeData,
      [this.table.GameModeVariations]: LogicGameModeVariationData,
      [this.table.Locations]: LogicLocationData,
    };
    const Wrapper = wrappers[tableId] || LogicData;
    return new Wrapper(instance);
  }

  static lookupDataPointer(tableId, instanceId) {
    if (tableId < 1 || tableId > MAX_TABLE_ID || instanceId < 0) return null;
    const table = this.getTable(tableId);
    if (table.instance.isNull()) return null;
    return table.getItemPointerAt(instanceId);
  }

  static getSkinByName(name) {
    return this.getTableItemByName(this.table.Skins, name);
  }

  static getCharacterByName(name) {
    return this.getTableItemByName(this.table.Characters, name);
  }

  static getLocationByName(name) {
    return this.getTableItemByName(this.table.Locations, name);
  }

  static getEffectByName(name) {
    return this.getTableItemByName(this.table.Effects, name);
  }

  static getLocationThemeByName(name) {
    return this.getTableItemByName(this.table.LocationThemes, name);
  }

  static getThemesAvailableForGameModeVariation(variation) {
    const table = this.getTable(this.table.Locations);
    const count = table.getItemCount();
    const themes = [];
    for (let index = 0; index < count; index++) {
      const location = table.getItemAt(index);
      if (!location) continue;
      const gameModeVariation = location.gameModeVariation;
      if (gameModeVariation.isPlayedOnVeryLargeMap === variation.isPlayedOnVeryLargeMap) {
        const theme = location.locationTheme;
        if (
          gameModeVariation.isPlayedOnVeryLargeMap &&
          gameModeVariation.getVariation() !== variation.getVariation()
        )
          continue;
        if (!themes.some((entry) => entry.getGlobalID() === theme.getGlobalID())) {
          themes.push(theme);
        }
      }
    }
    return themes;
  }

  static patch() {
    Interceptor.attach(dataLoadedAddress, {
      onLeave(retval) {
        if (retval.equals(ptr(1)) && !LogicDataTables.dataInitDone) {
          LogicDataTables.dataInitDone = true;
          try {
            StringTable.onLanguageSet();
          } catch {}
          try {
            ThemeSelectorManager.init();
          } catch {}
          try {
            SkinSelector.init();
          } catch {}
          try {
            LogicLocationData.applyDefaultEnvironments();
          } catch {}
          try {
            GameMain.applySlowMode(Config.config.SlowMode);
          } catch {}
        }
      },
    });
  }
}

LogicDataTables.dataInitDone = false;
LogicDataTables.table = {
  Locales: 1,
  BillingPackages: 2,
  Globals: 3,
  Sounds: 4,
  Resources: 5,
  Projectiles: 6,
  Effects: 7,
  AllianceBadges: 8,
  ClientGlobals: 9,
  ParticleEmitters: 10,
  HealthBars: 11,
  Music: 12,
  Credits: 13,
  Region: 14,
  Locations: 15,
  Characters: 16,
  AreaEffects: 17,
  Items: 18,
  Maps: 19,
  Skills: 20,
  Campaign: 21,
  Bosses: 22,
  Cards: 23,
  Animations: 24,
  AllianceRoles: 25,
  Tutorial: 26,
  Tiles: 27,
  PlayerThumbnails: 28,
  Skins: 29,
  Faces: 30,
  Hints: 36,
  Pins: 35,
  Milestones: 39,
  Messages: 40,
  Themes: 41,
  Links: 42,
  NameColors: 43,
  SkinConfs: 44,
  ShopItems: 45,
  ColorGradients: 46,
  LocationThemes: 47,
  GameModeVariations: 48,
  Challenges: 49,
  Accessories: 50,
  LocalNotifications: 51,
  Emotes: 52,
  EmoteBundles: 53,
  PlayerMapEnvironments: 54,
  MapTemplates: 55,
  SeasonalSkinSections: 56,
  SkinCampaigns: 57,
  RankedRanks: 58,
  RankedLocations: 59,
  Carryables: 60,
  GearLevels: 61,
  GearBoosts: 62,
  AllianceLeagueModes: 63,
  AllianceLeagueRanks: 64,
  BPPurchasePopup: 65,
  LocationFeatures: 66,
  LoginCalendarItems: 67,
  Sprays: 68,
  ShopPanelLayouts: 69,
  ShopStyleSets: 70,
  GearRarities: 71,
  FameTiers: 72,
  MasteryLevels: 73,
  MasteryHeroConfs: 74,
  MasteryPoints: 75,
  PlayerTitles: 76,
  CatalogCollections: 77,
  BattleFeats: 78,
  RandomRewards: 79,
  RandomRewardContainers: 80,
  ClubPiggyWins: 81,
  ClubPiggyLevels: 82,
  EnumeratedIdLists: 83,
  AdPlacements: 84,
  PlayerFrames: 85,
  SkinRarities: 86,
  StatusEffects: 87,
  RankedStarRewards: 88,
  Collabs: 89,
  ClassArchetypes: 90,
  NightMarketBundles: 91,
  NightMarketItems: 92,
  EventSlots: 93,
  SkinAnimSequences: 94,
  IntroFlows: 95,
  TrophySeasonRewardLevels: 96,
  ClubPiggyTypes: 97,
  ChronosAssetIds: 98,
  MasteryRewardTypes: 99,
  AvailabilityWindow: 100,
  VisualOfferGroupings: 101,
  CollabGameModes: 102,
  CompetitivePassTiers: 103,
  Pricepoints: 104,
  ProgressionSkinDetails: 105,
  StringReplacement: 106,
  MutationComponents: 108,
  ContestTypes: 109,
  SkinAlbums: 110,
  EventModifiers: 111,
};

exports.LogicDataTables = LogicDataTables;
exports.isTablesLoadedOffset = isTablesLoadedOffset;
