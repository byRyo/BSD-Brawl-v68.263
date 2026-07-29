// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicDataTables } = require("./LogicDataTables");
const { StringObject } = require("../../../titan/client/native/StringObject");
const { Config } = require("../../../../suitcase/config/Config");
const { LogicData } = require("./LogicData");
const { LogicMusicData } = require("./LogicMusicData");

const NO_MUSIC_THEME_ID = -2;
const getThemeMusicNative = new NativeFunction(Libg.offset(11661700, 10731344), "pointer", [
  "pointer",
]);
const getExportNameNative = new NativeFunction(Libg.offset(11661780, 10380080), "pointer", [
  "pointer",
]);
const getParticleFileNative = new NativeFunction(Libg.offset(11661716, 10731360), "pointer", [
  "pointer",
]);
const getParticleExportNative = new NativeFunction(Libg.offset(11661732, 10731376), "pointer", [
  "pointer",
]);
const getParticleStyleNative = new NativeFunction(Libg.offset(11661748, 10731392), "pointer", [
  "pointer",
]);
const updateParticlesNative = new NativeFunction(Libg.offset(11661764, 10731408), "void", [
  "pointer",
]);
const disabledColumnAddress = Libg.offset(19139044, 17802876);
const fileNameColumnAddress = Libg.offset(19139048, 17802880);
const loadingJingleColumnAddress = Libg.offset(19139076, 17802884);
const loadingScreenColumnAddress = Libg.offset(19139080, 17802912);
const customButtonColumnAddress = Libg.offset(19139084, 17802916);

class LogicThemeData extends LogicData {
  isDisabled() {
    return this.getBooleanValueAt(disabledColumnAddress.readInt());
  }
  getExportName() {
    return StringObject.read(getExportNameNative(this.instance));
  }
  getFileName() {
    return this.getStringValueAt(fileNameColumnAddress.readInt());
  }
  getLoadingJingle() {
    return this.getStringValueAt(loadingJingleColumnAddress.readInt());
  }
  getLoadingScreen() {
    return this.getStringValueAt(loadingScreenColumnAddress.readInt());
  }
  getCustomButtonName() {
    return this.getStringValueAt(customButtonColumnAddress.readInt());
  }
  getThemeMusic() {
    return new LogicMusicData(getThemeMusicNative(this.instance));
  }

  static patch() {
    Interceptor.replace(
      getThemeMusicNative,
      new NativeCallback(
        function (instance) {
          if (
            Process.platform === "darwin" &&
            3681376 !== this.returnAddress.sub(Libg.libgBeginOffset).toInt32()
          )
            return getThemeMusicNative(instance);
          if (Config.config.ThemeMusicID === NO_MUSIC_THEME_ID) return NULL;
          if (Config.config.ThemeMusicID !== -1) {
            const theme = LogicDataTables.getDataById(
              LogicDataTables.table.Themes,
              Config.config.ThemeMusicID,
            );
            return getThemeMusicNative(theme ? theme.instance : instance);
          }
          return getThemeMusicNative(instance);
        },
        "pointer",
        ["pointer"],
      ),
    );

    Interceptor.replace(
      getParticleFileNative,
      new NativeCallback(() => StringObject.create("sc/ui.sc"), "pointer", ["pointer"]),
    );
    Interceptor.replace(
      getParticleExportNative,
      new NativeCallback(
        () =>
          StringObject.create(
            Config.config.ParticleExportName === -1 ? "" : Config.config.ParticleExportName,
          ),
        "pointer",
        ["pointer"],
      ),
    );
    Interceptor.replace(updateParticlesNative, new NativeCallback(() => {}, "void", ["pointer"]));
    Interceptor.replace(
      getParticleStyleNative,
      new NativeCallback(
        () =>
          StringObject.create(
            Config.config.ParticleStyle === -1 ? "Snow" : Config.config.ParticleStyle,
          ),
        "pointer",
        ["pointer"],
      ),
    );
    Interceptor.replace(
      getExportNameNative,
      new NativeCallback(
        (instance) => {
          let exportName = "";
          switch (new LogicThemeData(instance).getName()) {
            case "Moon Festival 2020":
              exportName = "bgr_moon_festival";
              break;
            case "China Anniversary":
              exportName = "bgr_china_anniversary";
              break;
            case "Moon Festival 2021":
            case "Moon Festival 2022":
              exportName = "bgr_mf";
              break;
            case "Moon Festival 2023":
              exportName = "bgr_mf2023";
              break;
            case "Classic Brawl":
              exportName = "bgr";
              break;
            default:
              return getExportNameNative(instance);
          }
          if (exportName === "") return getExportNameNative(instance);
          return StringObject.create(exportName);
        },
        "pointer",
        ["pointer"],
      ),
    );
  }
}

exports.LogicThemeData = LogicThemeData;
exports.NO_MUSIC_THEME_ID = NO_MUSIC_THEME_ID;
