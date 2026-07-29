// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { MovieClip } = require("../../../titan/client/common/flash/MovieClip");
const { StringObject } = require("../../../titan/client/native/StringObject");
const { Localisation } = require("../../../../suitcase/localisation/Localisation");
const { FileManager } = require("../../../../suitcase/filesystem/FileManager");
const {
  LocalisationOverrides,
} = require("../../../../suitcase/localisation/LocalisationOverrides");
const { EDebugger } = require("../../../../suitcase/debug/EDebugger");
const { FPSCounter } = require("../../../../suitcase/modconfiguration/FPSCounter");
const { Config } = require("../../../../suitcase/config/Config");
const { ModProperties } = require("../../../../suitcase/config/ModProperties");
const { ThemeSelectorManager } = require("../../../../suitcase/modmenu/ThemeSelector");
const { LocalisationStatic } = require("../../../../suitcase/localisation/LocalisationStatic");
const { AllianceEventStreamEntry } = require("../stream/AllianceEventStreamEntry");
const { LoadingScreen } = require("../state/loading/LoadingScreen");

const getMovieClipNative = new NativeFunction(Libg.offset(10309648, 9676580), "pointer", [
  "pointer",
  "pointer",
  "pointer",
]);
const StringTable_getString = new NativeFunction(Libg.offset(10308220, 9675260), "pointer", [
  "pointer",
]);
const stringByCStringAddress = Libg.offset(10308092, 9675140);
const getCurrentLanguageCodeNative = new NativeFunction(
  Libg.offset(10308992, 9676032),
  "pointer",
  [],
);
const setLanguageAddress = Libg.offset(10308564, 9675644);
const setLanguageNative = new NativeFunction(setLanguageAddress, "void", ["int", "bool"]);
const currentLanguageIndexAddress = Libg.offset(19129868, 17793860);
const languageTableAddress = Libg.offset(19856184, 18159096);
const languageObjectStringsOffset = LogicMemory.offset(84);
const languageVectorOffset = 8;
const languageObjectStringCountOffset = 56;
const languageObjectStringStride = 16;

class StringTable {
  static getMovieClip(fileName, exportName) {
    const instance = getMovieClipNative(
      Memory.allocUtf8String(fileName),
      Memory.allocUtf8String(exportName),
      NULL,
    );
    return new MovieClip(instance);
  }

  static getMovieClip_safe(fileName, exportName) {
    const instance = getMovieClipNative(
      Memory.allocUtf8String(fileName),
      Memory.allocUtf8String(exportName),
      NULL,
    );
    return instance.isNull() ? null : new MovieClip(instance);
  }

  static getString(tid) {
    return StringObject.with(tid, (tidPointer) =>
      StringObject.read(StringTable_getString(tidPointer)),
    );
  }

  static getCurrentLanguageCode() {
    return StringObject.read(getCurrentLanguageCodeNative());
  }

  static getCurrentLanguageIndex() {
    return currentLanguageIndexAddress.readS32();
  }

  static getLanguageCount() {
    const table = languageTableAddress.readPointer();
    if (table.isNull()) return 0;
    const languages = table.readPointer();
    if (languages.isNull()) return 0;
    return languages.add(languageVectorOffset).readU32();
  }

  static toggleShowTidKeys() {
    Config.config.ShowTidKeys = !Config.config.ShowTidKeys;
    return Config.config.ShowTidKeys;
  }

  static isShowTidKeys() {
    return Boolean(Config.config.ShowTidKeys);
  }

  static setLanguageIndex(index, persist = true) {
    setLanguageNative(index, persist ? 1 : 0);
  }

  static get replacedStrings() {
    if (!this._replacedStrings) {
      this._replacedStrings = {
        serverConnectionCredit: StringObject.create(
          LocalisationStatic.default.TextServerConnectionCredit.replace(
            "{jointModServerConnectionCredit}",
            this.jointStrings.serverConnectionCredit,
          ),
        ),
        aboutScreenText: StringObject.create(
          LocalisationStatic.default.TextModContributors.replace(
            "{ScriptPatchVersionName}",
            ModProperties.version,
          )
            .replace("{Platform}", "Platform")
            .replace("{ModVersion}", ModProperties.environment)
            .replace("{jointModAboutScreen}", this.jointStrings.aboutScreenText) + "<names>",
        ),
        heroMaxTier: StringObject.create("35"),
        emptyString: StringObject.create(""),
      };
    }
    return this._replacedStrings;
  }

  static get rankNames() {
    if (!this._rankNames) {
      this._rankNames = Object.fromEntries(
        Object.entries({
          ar: "الترتيب",
          cn: "荣誉",
          cnt: "RANK",
          de: "RANG",
          en: "RANK",
          es: "RANGO",
          fi: "ARVO",
          fr: "RANG",
          he: "דירוג",
          id: "KELAS",
          it: "GRADO",
          jp: "ランク",
          kr: "RANK",
          ms: "PANGKAT",
          nl: "RANG",
          pl: "RANGA",
          pt: "CLASSE",
          ru: "РАНГ",
          th: "อันดับ",
          tr: "R�TBE",
          vi: "HẠNG",
        }).map(([language, name]) => [language, StringObject.create(name)]),
      );
    }
    return this._rankNames;
  }

  static onLanguageSet() {
    Localisation.languageCode = this.getCurrentLanguageCode();
    try {
      const localization = JSON.parse(
        FileManager.readAAsset("bsd/internal/localization.json", "r").toString(),
      );
      const code = Localisation.languageCode.toLowerCase();
      Localisation.localizationObject = Object.keys(localization).includes(code)
        ? Object.assign(localization[code] ?? {}, LocalisationOverrides.overrides[code])
        : Object.assign(localization.en, LocalisationOverrides.overrides.en);
    } catch (_) {}

    Localisation.isLanguageIndexSet = true;
    if (EDebugger.isCreated()) {
      EDebugger.destroy();
      EDebugger.create();
    } else {
      EDebugger.create();
    }
    FPSCounter.toggle(false);
    if (Config.config.ShowFPSCounter) FPSCounter.toggle(true);
    if (Config.config.RandomThemeMask[0]) ThemeSelectorManager.setRandomTheme();
  }

  static addStringByCStringRedirector(redirector) {
    this.stringByCStringRedirectors.push(redirector);
    this.hookStringByCString();
  }

  static hookStringByCString() {
    if (this.stringByCStringHooked) return;
    this.stringByCStringHooked = true;
    Interceptor.attach(stringByCStringAddress, {
      onEnter(args) {
        this.replacement = NULL;
        for (const redirector of StringTable.stringByCStringRedirectors) {
          try {
            const replacement = redirector(args[0], this.returnAddress);
            if (replacement && !replacement.isNull()) {
              this.replacement = replacement;
              break;
            }
          } catch (_) {}
        }
      },
      onLeave(retval) {
        const replacement = this.replacement;
        if (replacement && !replacement.isNull()) retval.replace(replacement);
      },
    });
  }

  static patch() {
    if (this.patched) return;
    this.patched = true;

    Interceptor.attach(setLanguageAddress, {
      onLeave() {
        StringTable.onLanguageSet();
      },
    });

    const reservedTids = [
      "TID_CONTENT_UPDATE",
      "TID_CREDITS_BUTTON",
      "TID_CONNECTING_TO_SERVER",
      "TID_ABOUT",
      "TID_STREAM_EVENT_114",
      "TID_MENDER",
    ];
    StringTable.aprilFoolsMapping = {};

    Interceptor.attach(StringTable_getString, {
      onEnter(args) {
        try {
          this.TID = StringObject.read(args[0]);
          if (!Config.config.RandomLocalization || !this.TID || reservedTids.includes(this.TID))
            return;

          if (!StringTable.aprilFoolsMapping[this.TID]) {
            const languageTable = languageTableAddress.readPointer();
            const languageIndex = currentLanguageIndexAddress.readS32();
            if (languageIndex >= 0) {
              const languageVector = languageTable.add(languageVectorOffset).readPointer();
              const languageObject = languageVector
                .add(languageIndex * Process.pointerSize)
                .readPointer()
                .readPointer();
              const count = languageObject.add(languageObjectStringCountOffset).readU32();
              const strings = languageObject.add(languageObjectStringsOffset).readPointer();
              if (count > 100) {
                const entries = strings.readPointer().add(8).readPointer();
                const randomIndex = Math.floor(Math.random() * count);
                StringTable.aprilFoolsMapping[this.TID] = entries.add(
                  randomIndex * languageObjectStringStride,
                );
              }
            }
          }
          if (StringTable.aprilFoolsMapping[this.TID]) {
            args[0] = StringTable.aprilFoolsMapping[this.TID];
          }
        } catch (_) {}
      },

      onLeave(retval) {
        if (Config.config.ShowTidKeys && this.TID && this.TID.startsWith("TID_")) {
          retval.replace(StringObject.create(this.TID));
          return;
        }

        try {
          if (
            this.TID &&
            !reservedTids.includes(this.TID) &&
            StringTable.aprilFoolsMapping[this.TID]
          ) {
            const value = StringObject.read(retval);
            if (value && value.length !== 0) {
              if (!StringTable.aprilFoolsCleaned[this.TID] && value.includes("<")) {
                const cleaned = value.replace(/<(?!\/?c[0-9a-fA-F]*>)[^>]+>/g, () =>
                  String(Math.floor(999 * Math.random())),
                );
                StringTable.aprilFoolsCleaned[this.TID] = StringObject.create(cleaned);
              }
              if (StringTable.aprilFoolsCleaned[this.TID]) {
                retval.replace(StringTable.aprilFoolsCleaned[this.TID]);
              }
            } else {
              delete StringTable.aprilFoolsMapping[this.TID];
              delete StringTable.aprilFoolsCleaned[this.TID];
            }
          }
        } catch (_) {}

        switch (this.TID) {
          case "TID_CONTENT_UPDATE":
            if (LoadingScreen.isActive) {
              retval.replace(StringObject.create(Localisation.getString("UpdatingModAssets")));
            }
            break;
          case "TID_CREDITS_BUTTON":
            retval.replace(StringObject.create(Localisation.getString("AboutMod")));
            break;
          case "TID_CONNECTING_TO_SERVER":
            retval.replace(StringTable.replacedStrings.serverConnectionCredit);
            break;
          case "TID_ABOUT":
            retval.replace(StringTable.replacedStrings.aboutScreenText);
            break;
          case "TID_STREAM_EVENT_114":
            retval.replace(
              StringObject.create(
                "".concat(StringObject.read(retval), AllianceEventStreamEntry.textChatMuterName),
              ),
            );
            break;
          case "TID_MENDER":
            if (Config.config.LegacyNames) {
              retval.replace(StringObject.create(Localisation.getString("LegacyNames_Glowbert")));
            }
            break;
          case "TID_TRICKSHOT_DUDE":
            if (Config.config.LegacyNames) {
              retval.replace(StringObject.create(Localisation.getString("LegacyNames_Rico")));
            }
            break;
          case "TID_RUFFS":
            if (Config.config.LegacyNames) {
              retval.replace(StringObject.create(Localisation.getString("LegacyNames_Ruffs")));
            }
            break;
        }
      },
    });
  }
}

StringTable.jointStrings = { serverConnectionCredit: "", aboutScreenText: "" };
StringTable._replacedStrings = null;
StringTable.aprilFoolsMapping = {};
StringTable.aprilFoolsCleaned = {};
StringTable._rankNames = null;
StringTable.stringByCStringRedirectors = [];
StringTable.stringByCStringHooked = false;
StringTable.patched = false;

exports.StringTable_getString = StringTable_getString;
exports.StringTable = StringTable;
