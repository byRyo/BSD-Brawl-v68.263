// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeSelectorPopup =
  exports.ThemePreviewPopup =
  exports.ThemeSelectorManager =
  exports.LegacyBackgroundManager =
  exports.StrangerthingsFixer =
    void 0;

const { ListContainerPopup } = require("../flash/popup/ListContainerPopup");
const { Localisation } = require("../localisation/Localisation");
const { NO_MUSIC_THEME_ID } = require("../../laser/client/logic/data/LogicThemeData");
const { LogicDataTables } = require("../../laser/client/logic/data/LogicDataTables");
const { Config } = require("../config/Config");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { LogicRandom } = require("../logic/LogicRandom");
const { FileManager } = require("../filesystem/FileManager");
const { HomeScreen } = require("../../laser/client/game/screen/home/HomeScreen");
const { StringTable } = require("../../laser/client/game/text/StringTable");
const { ThemeItem } = require("../flash/popup/button/ThemeItem");
const {
  ClipboardThemeItem,
  CLIPBOARD_THEME_ITEM_ID,
} = require("../flash/popup/button/ClipboardThemeItem");
const { NoMusicItem } = require("../flash/popup/button/NoMusicItem");
const { CustomBackground } = require("../feature/CustomBackground");
const { SoundManager } = require("../../laser/titan/client/common/sound/SoundManager");
const { HomePage } = require("../../laser/client/game/screen/home/homepage/HomePage");
const { Stage } = require("../../laser/titan/client/common/flash/Stage");
const { EDebugger } = require("../debug/EDebugger");

class ThemeSelectorPopup extends ListContainerPopup {
  constructor(isBackgroundSelected = false, backgroundID = 0, customBackground = false) {
    const themesTable = LogicDataTables.getTable(LogicDataTables.table.Themes);
    let backgroundFileName = "";
    let backgroundExportName = "";

    if (isBackgroundSelected) {
      const theme = themesTable.getItemAt(backgroundID);
      if (theme) {
        backgroundFileName = theme.getFileName();
        backgroundExportName = theme.getExportName();
      }
    }

    super({
      Title: Localisation.getString(
        isBackgroundSelected ? "ThemesPopupSelectMusicTitle" : "ThemesPopupSelectBackgroundTitle",
      ),
      PopupBackgroundFileName: backgroundFileName,
      PopupBackgroundExportName: backgroundExportName,
    });

    let backgroundClip = this.backgroundClip;
    if (backgroundClip && backgroundClip.exportName?.startsWith("bgr_")) {
      backgroundClip = StrangerthingsFixer.fix(backgroundClip);
      if (Config.config.LegacyBackgrounds) {
        LegacyBackgroundManager.apply(backgroundClip, true);
      }
    }

    this.isBackgroundSelected = isBackgroundSelected;
    this.backgroundID = backgroundID;
    this.customBackground = customBackground;
    this.musicId = 0;
    this.themeItemsCount = 0;
    this.bgFileName = "";
    this.bgExportName = "";
    this.themesTable = themesTable;

    if (this.isBackgroundSelected) {
      this.currentTheme = this.themesTable.getItemAt(backgroundID);
      this.bgFileName = this.currentTheme.getFileName();
      this.bgExportName = this.currentTheme.getExportName();
    }

    this.musicId = Config.config.ThemeMusicID !== -1 ? Config.config.ThemeMusicID : this.musicId;
    this.adjustPopupHeaderButtons("theme_selector");
    this.refreshItems();
  }

  refreshItems() {
    this.container.clearEntries();
    const itemCount = this.themesTable.getItemCount();
    const hasCustomTheme = !this.isBackgroundSelected && Config.config.CustomThemeName !== "";
    const selectedId = this.isBackgroundSelected ? this.musicId : ThemeSelectorManager.themeID;
    const selectedTheme =
      hasCustomTheme || selectedId < 0 ? null : this.themesTable.getItemAt(selectedId);

    if (!this.isBackgroundSelected) {
      const clipboardItem = new ClipboardThemeItem(
        Localisation.getString("CustomBgFromClipboard"),
        hasCustomTheme,
      );
      clipboardItem.setCustomButtonListener(this.buttonPressed.bind(this));
      this.container.addEntry(clipboardItem);
    }

    if (this.isBackgroundSelected) {
      const noMusicItem = new NoMusicItem(
        NO_MUSIC_THEME_ID,
        Localisation.getString("ThemeNoMusic"),
        Config.config.ThemeMusicID === NO_MUSIC_THEME_ID,
      );
      noMusicItem.setCustomButtonListener(this.buttonPressed.bind(this));
      this.container.addEntry(noMusicItem);
    }

    for (let i = 0; i < itemCount; i++) {
      const theme = this.themesTable.getItemAt(i);
      if (!theme || theme.isDisabled()) continue;

      const item = new ThemeItem(theme, selectedTheme);
      item.setCustomButtonListener(this.buttonPressed.bind(this));
      this.container.addEntry(item);
    }

    this.refresh();

    if (this.isBackgroundSelected) {
      const selectedEntry = this.container.getEntry(
        (entry) => entry instanceof ThemeItem && entry.themeId === this.backgroundID,
      );
      if (!selectedEntry) return false;

      selectedEntry.setHighlight(true, -1, true, 0);
      this.container.scrollTo(selectedEntry.y, 0);
    }
  }

  buttonPressed(_button, movieClip) {
    const id = new GameButton(movieClip).id;

    if (id === CLIPBOARD_THEME_ITEM_ID) {
      if (CustomBackground.stageFromClipboard()) {
        GUI.showPopup(
          new ThemeSelectorPopup(true, ThemeSelectorManager.themeID, true),
          true,
          true,
          false,
        );
        return;
      }

      GUI.showFloaterTextAtDefaultPosition(Localisation.getString("CustomBgNoImage"));
      return;
    }

    if (this.isBackgroundSelected) {
      this.musicId = id;
      if (this.customBackground) {
        this.applyCustomBackgroundWithMusic(id);
        return;
      }

      GUI.showPopup(new ThemePreviewPopup(this.backgroundID, this.musicId), true, true, false);
      return;
    }

    GUI.showPopup(new ThemeSelectorPopup(true, id), true, true, false);
  }

  applyCustomBackgroundWithMusic(musicId) {
    const theme = musicId >= 0 ? this.themesTable.getItemAt(musicId) : null;
    CustomBackground.applyPending();
    Config.config.ThemeMusicID = musicId;
    Config.config.RandomThemeMask[0] =
      Config.config.RandomThemeMask[1] =
      Config.config.RandomThemeMask[2] =
        false;
    FileManager.updateConfigFile();

    if (theme) {
      SoundManager.playMusic(theme.getThemeMusic());
    } else {
      SoundManager.stopMusic();
    }
    GUI.closeAllPopups();
  }
}
exports.ThemeSelectorPopup = ThemeSelectorPopup;

class ThemePreviewPopup extends ListContainerPopup {
  constructor(backgroundID, musicId) {
    const selectedTheme = LogicDataTables.getDataById(LogicDataTables.table.Themes, backgroundID);
    super({
      Title: "",
      PopupBackgroundFileName: selectedTheme.getFileName(),
      PopupBackgroundExportName: selectedTheme.getExportName(),
    });

    let backgroundClip = this.backgroundClip;
    if (backgroundClip && backgroundClip.exportName?.startsWith("bgr_")) {
      backgroundClip = StrangerthingsFixer.fix(backgroundClip);
      if (Config.config.LegacyBackgrounds) {
        LegacyBackgroundManager.apply(backgroundClip, true);
      }
    }

    this.selectedTheme = selectedTheme;
    this.backgroundID = backgroundID;
    this.musicId = musicId;
    this.adjustPopupHeaderButtons("theme_preview");
    this.refreshItems();
  }

  refreshItems() {
    const clip = StringTable.getMovieClip("sc/ui.sc", "player_name_color_entry");
    this.confirmationButton = new GameButton();
    this.confirmationButton.setMovieClip(clip, true);
    this.confirmationButton.setCustomButtonListener(
      this.buttonPressed.bind(this),
      "theme_preview_confirm",
    );

    const label = clip.getTextFieldByName("label_txt");
    label.fontOutline = true;
    label.setTextScaleIfNecessary(Localisation.getString("ChangeThemePromptConfirmButton"));
    clip.gotoAndStopFrameIndex(1);

    const matrixY = Stage.getMatrixY();
    this.confirmationButton.setXY(0, matrixY - matrixY / 8);
    this.getMovieClip().addChild(this.confirmationButton);
  }

  buttonPressed() {
    this.applyTheme(this.selectedTheme);
  }

  applyTheme(theme) {
    Config.config.ThemeBackgroundID = this.backgroundID;
    Config.config.ThemeMusicID = this.musicId;
    Config.config.RandomThemeMask[0] =
      Config.config.RandomThemeMask[1] =
      Config.config.RandomThemeMask[2] =
        false;
    FileManager.updateConfigFile();
    ThemeSelectorManager.themeID = this.backgroundID;
    HomeScreen.updateTheme(theme);
    GUI.closeAllPopups();
  }
}
exports.ThemePreviewPopup = ThemePreviewPopup;

class ThemeSelectorManager {
  static init() {
    const table = LogicDataTables.getTable(LogicDataTables.table.Themes);
    const itemCount = table.getItemCount();
    for (let i = 0; i < itemCount; i++) {
      const theme = table.getItemAt(i);
      if (!theme || theme.isDisabled()) this.EXCEPTIONS.push(i);
    }
  }

  static hideCustomBackground() {
    CustomBackground.hide();
  }

  static isThemeValid(theme) {
    if (theme.isDisabled()) return false;
    return !!StringTable.getMovieClip_safe(theme.getFileName(), theme.getExportName());
  }

  static cycleTheme(direction) {
    const table = LogicDataTables.getTable(LogicDataTables.table.Themes);
    const itemCount = table.getItemCount();
    if (itemCount < 1) return;

    let themeId = this.themeID;
    for (let i = 0; i < itemCount; i++) {
      themeId = (themeId + direction + itemCount) % itemCount;
      const theme = table.getItemAt(themeId);
      if (theme && !theme.isDisabled()) {
        this.themeID = themeId;
        Config.config.ThemeBackgroundID = themeId;
        Config.config.ThemeMusicID = themeId;
        Config.config.RandomThemeMask[0] =
          Config.config.RandomThemeMask[1] =
          Config.config.RandomThemeMask[2] =
            false;
        FileManager.updateConfigFile();
        HomeScreen.updateTheme(theme);
        return;
      }
    }
  }

  static setRandomTheme() {
    const itemCount = LogicDataTables.getTable(LogicDataTables.table.Themes).getItemCount();

    if (Config.config.RandomThemeMask[1]) {
      Config.config.ThemeBackgroundID = LogicRandom.getRandomInRangeExcept(
        0,
        itemCount - 1,
        this.EXCEPTIONS,
      );
      Config.config.ThemeMusicID = LogicRandom.getRandomInRangeExcept(
        0,
        itemCount - 1,
        this.EXCEPTIONS,
      );
    } else {
      const themeId = LogicRandom.getRandomInRangeExcept(0, itemCount - 1, this.EXCEPTIONS);
      Config.config.ThemeBackgroundID = themeId;
      Config.config.ThemeMusicID = themeId;
    }

    this.themeID = Config.config.ThemeBackgroundID;
    FileManager.updateConfigFile();
  }

  static patchRandomThemes(index) {
    Config.config.RandomThemeMask[index] = !Config.config.RandomThemeMask[index];
    FileManager.updateConfigFile();
    HomePage.reload();
  }
}
exports.ThemeSelectorManager = ThemeSelectorManager;

ThemeSelectorManager.themeID = 0;
ThemeSelectorManager.isCustomBgInUse = false;
ThemeSelectorManager.EXCEPTIONS = [];

class LegacyBackgroundManager {
  static disableRange(from, to) {
    return (index) => index >= from && index <= to;
  }

  static indexFrom(from) {
    return (index) => index >= from;
  }

  static indexTo(to) {
    return (index) => index <= to;
  }

  static disableOnly(index) {
    return (value) => value === index;
  }

  static nameIncludes(name) {
    return (_value, _index, values) => values.includes(name);
  }

  static and(...predicates) {
    return (value, index, values) =>
      predicates.every((predicate) => predicate(value, index, values));
  }

  static or(...predicates) {
    return (value, index, values) =>
      predicates.some((predicate) => predicate(value, index, values));
  }

  static not(predicate) {
    return (value, index, values) => !predicate(value, index, values);
  }

  static shouldSkipLayer(name) {
    return name.startsWith("bg_colo") || name.startsWith("bg_pattern");
  }

  static defaultLegacyRule(clip) {
    const childCount = clip.getChildCount();
    return childCount !== 1 && childCount !== 432 && childCount !== 108;
  }

  static apply(background, enabled) {
    try {
      const exportName = background.exportName;
      if (!exportName) return;

      background = StrangerthingsFixer.fix(background);
      const rules = this.rules[exportName];
      const childCount = background.getChildCount();

      for (let i = 1; i < childCount; i++) {
        const child = background.getChildById(i);
        if (child.type !== "MovieClip") continue;

        const name = background.getNameOfChild(child);
        if (this.shouldSkipLayer(name)) continue;

        const shouldDisable =
          rules?.some((rule) => rule(i, name, rules)) ?? this.defaultLegacyRule(child);
        child.visibility = !enabled || !shouldDisable;
      }
    } catch (error) {
      EDebugger.addMessage(EDebugger.ERROR, "LegacyBackgroundManager: ".concat(error));
    }
  }
}
exports.LegacyBackgroundManager = LegacyBackgroundManager;

LegacyBackgroundManager.rules = {
  bgr_dark: [LegacyBackgroundManager.indexFrom(435)],
  bgr_ghosttrain: [LegacyBackgroundManager.indexFrom(435)],
  bgr_enchanted: [LegacyBackgroundManager.indexFrom(433)],
  bgr_darkmas: [LegacyBackgroundManager.disableOnly(9), LegacyBackgroundManager.disableOnly(10)],
  bgr_ramadan2023: [
    LegacyBackgroundManager.disableOnly(8),
    LegacyBackgroundManager.disableOnly(9),
    LegacyBackgroundManager.disableOnly(14),
    LegacyBackgroundManager.disableOnly(15),
  ],
  bgr_hub: [
    LegacyBackgroundManager.disableOnly(8),
    LegacyBackgroundManager.disableOnly(18),
    LegacyBackgroundManager.disableOnly(19),
  ],
  bgr_phoenix: [LegacyBackgroundManager.disableRange(6, 7)],
  bgr_cursedpirates: [
    LegacyBackgroundManager.disableRange(10, 29),
    LegacyBackgroundManager.disableRange(39, 41),
  ],
  bgr_sb: [LegacyBackgroundManager.indexFrom(433)],
  bgr_samurai: [
    LegacyBackgroundManager.disableRange(434, 449),
    LegacyBackgroundManager.indexFrom(452),
  ],
  bgr_zombie: [LegacyBackgroundManager.indexFrom(434)],
  bgr_toons2: [
    LegacyBackgroundManager.disableRange(6, 10),
    LegacyBackgroundManager.disableOnly(13),
  ],
  bgr_toystory: [
    LegacyBackgroundManager.disableRange(435, 440),
    LegacyBackgroundManager.indexFrom(442),
  ],
  bgr_arcade: [
    LegacyBackgroundManager.disableRange(6, 16),
    LegacyBackgroundManager.disableRange(18, 20),
    LegacyBackgroundManager.indexFrom(22),
  ],
  bgr_ollie: [
    LegacyBackgroundManager.disableRange(433, 436),
    LegacyBackgroundManager.disableRange(443, 444),
    LegacyBackgroundManager.indexFrom(445),
  ],
  bgr_goodrandoms: [
    LegacyBackgroundManager.disableRange(433, 440),
    LegacyBackgroundManager.disableRange(445, 446),
    LegacyBackgroundManager.disableRange(448, 453),
  ],
  bgr_circus: [
    LegacyBackgroundManager.disableRange(5, 11),
    LegacyBackgroundManager.disableOnly(15),
    LegacyBackgroundManager.disableRange(16, 21),
    LegacyBackgroundManager.disableRange(22, 43),
    LegacyBackgroundManager.disableOnly(54),
  ],
  bgr_lny24: [LegacyBackgroundManager.disableRange(23, 24)],
  bgr_cartoon: [
    LegacyBackgroundManager.disableRange(433, 446),
    LegacyBackgroundManager.disableOnly(450),
  ],
  bgr_superbrawl: [
    LegacyBackgroundManager.disableRange(433, 792),
    LegacyBackgroundManager.disableOnly(795),
  ],
  bgr_lumi: [
    LegacyBackgroundManager.disableRange(436, 444),
    LegacyBackgroundManager.indexFrom(447),
  ],
  bgr_superheroes: [
    LegacyBackgroundManager.disableOnly(7),
    LegacyBackgroundManager.disableOnly(10),
  ],
  bgr_jae: [LegacyBackgroundManager.indexFrom(8)],
  bgr_feudaljapan_1: [LegacyBackgroundManager.indexFrom(7)],
  bgr_feudaljapan_2: [LegacyBackgroundManager.indexFrom(7)],
  bgr_feudaljapan_3: [LegacyBackgroundManager.indexFrom(7)],
  bgr_feudaljapan_4: [LegacyBackgroundManager.indexFrom(7)],
  bgr_kaze: [LegacyBackgroundManager.indexFrom(9)],
  bgr_kaiju: [LegacyBackgroundManager.indexFrom(8)],
  bgr_graffiti: [LegacyBackgroundManager.disableOnly(9)],
  bgr_alli: [LegacyBackgroundManager.indexFrom(8)],
  bgr_darkgreek: [LegacyBackgroundManager.indexFrom(8)],
  bgr_trunk: [LegacyBackgroundManager.indexFrom(8)],
  bgr_fantasy: [LegacyBackgroundManager.indexFrom(8)],
  bgr_demon: [
    LegacyBackgroundManager.disableRange(433, 438),
    LegacyBackgroundManager.disableOnly(444),
  ],
  bgr_brawloween25: [LegacyBackgroundManager.indexFrom(8)],
  bgr_ziggy: [LegacyBackgroundManager.indexFrom(8)],
  bgr_mina: [LegacyBackgroundManager.indexFrom(8)],
  bgr_mechas2025: [LegacyBackgroundManager.indexFrom(8)],
  bgr_gigi: [LegacyBackgroundManager.disableOnly(9), LegacyBackgroundManager.disableOnly(15)],
  bgr_gym: [LegacyBackgroundManager.disableOnly(7)],
  bgr_steampunk: [LegacyBackgroundManager.disableOnly(7)],
  bgr_glowbert: [LegacyBackgroundManager.indexFrom(8)],
  bgr_lny25: [LegacyBackgroundManager.indexFrom(8)],
  bgr_brawlentines25: [LegacyBackgroundManager.indexFrom(8)],
  bgr_najia: [LegacyBackgroundManager.indexFrom(7)],
  bgr_dragonsandfairies: [LegacyBackgroundManager.indexFrom(9)],
  bgr_strangerthings: [LegacyBackgroundManager.indexFrom(8)],
  bgr_newyork: [LegacyBackgroundManager.indexFrom(8)],
  bgr_rio: [LegacyBackgroundManager.indexFrom(8)],
  bgr_tokyo: [LegacyBackgroundManager.indexFrom(8)],
  bgr_berlin: [LegacyBackgroundManager.indexFrom(8)],
  bgr_carretabrawl: [LegacyBackgroundManager.indexFrom(8)],
  bgr_mf25: [LegacyBackgroundManager.indexFrom(8)],
  bgr_pierce: [LegacyBackgroundManager.indexFrom(8)],
  "": [LegacyBackgroundManager.disableOnly(4)],
  bgr_finnx: [],
  bgr_mecha: [],
  bgr_mecha_edgar: [],
};

class StrangerthingsFixer {
  static fix(background) {
    if (!background.exportName || background.exportName !== "bgr_strangerthings") {
      return background;
    }

    background.gotoAndStopFrameIndex(0);
    const firstChild = background.getChildById(0);
    if (firstChild) background = firstChild;
    return background;
  }
}
exports.StrangerthingsFixer = StrangerthingsFixer;
