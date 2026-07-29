// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugMenu = void 0;
const { GameMain } = require("../../../laser/client/GameMain");
const { DebugGameButton } = require("./DebugGameButton");
const { DebugCommandButton } = require("./DebugCommandButton");
const { DebugMenuBase } = require("./DebugMenuBase");
const { EDebugCategory } = require("./DebugMenuCategory");
const { MovieClip } = require("../../../laser/titan/client/common/flash/MovieClip");
const { ModProperties } = require("../../config/ModProperties");
const { GUI } = require("../../../laser/client/game/gui/GUI");
const { Localisation } = require("../../localisation/Localisation");
const { ToggleDebugMenuButton } = require("./ToggleDebugMenuButton");
const { StringTable } = require("../../../laser/client/game/text/StringTable");
const { ExceptionWorker } = require("../../debug/ExceptionWorker");
const { Breadcrumbs } = require("../../debug/Breadcrumbs");
const { DownloadManager } = require("../../../laser/client/game/network/DownloadManager");
const { EDebugger } = require("../../debug/EDebugger");
const { LogicDebugButtonMessage } = require("./LogicDebugButtonMessage");
const {
  ALL_BUTTONS,
  RESOURCE_BUTTONS,
  FX_BUTTONS,
  NATIVE_FLOATER_OVERRIDE_BUTTONS,
} = require("./DebugButtonSpecs");
const { Config } = require("../../config/Config");
const { DebugRecents } = require("./DebugRecents");
const { DebugSearch } = require("./DebugSearch");
const { DebugBottomMenu } = require("./DebugBottomMenu");
const RECENT_PREFIX = "RECENT: ";
class DebugMenu extends DebugMenuBase {
  constructor() {
    super("sc/debug.sc", "debug_menu");
    this.setTitle("Debug Menu");
    const version = this.movieClip.getTextFieldByName("version");
    if (version) {
      version.text = "BSD ".concat(ModProperties.version);
      version.color = 4278255375;
      this.movieClip.addChild(new MovieClip(version.instance));
    }
    this.toggleDebugMenuButton = new ToggleDebugMenuButton();
    const close = this.movieClip.getChildByName("close_button");
    if (close) {
      this.toggleDebugMenuButton.setMovieClip(new MovieClip(close.instance), true);
      this.movieClip.addChild(this.toggleDebugMenuButton);
    }
    this.createTopLevelButtons();
    this.createCategoryButtons();
    this.createTsResourceButtons();
    this.createTsUnlockButtons();
    this.rebuildRecentCategory();
    this.searchHelpField = this.movieClip.getTextFieldByName("search_help");
    if (this.searchHelpField) {
      this.searchHelpField.text = "BSD Brawl";
      this.searchHelpField.visibility = DebugSearch.getQuery().length === 0;
    }
    this.wireSearchInput();
    this.sortButtonsAndCategories();
    DebugRecents.onChange(() => {
      this.rebuildRecentCategory();
      this.refreshFilters();
    });
    DebugSearch.onChange(() => {
      if (this.searchHelpField)
        this.searchHelpField.visibility = DebugSearch.getQuery().length === 0;
      this.refreshFilters({ syncCategoryOpenStateToSearch: true });
    });
    this.refreshFilters();
    this.shouldUpdateLayout = true;
    this.update(0);
  }
  onBattleModeChange(value) {
    this.getCategory(EDebugCategory.BATTLE)?.setOpened(value);
  }
  onMapEditorChange(value) {
    this.getCategory(EDebugCategory.MAP_EDITOR)?.setOpened(value);
  }
  createTopLevelButtons() {
    this.bottomMenu = new DebugBottomMenu(this.width);
    this.movieClip.addChild(this.bottomMenu);
    this.bottomMenu.createAndPositionButton("CLEAR SEARCH", DebugMenu.clearSearch);
    this.bottomMenu.createAndPositionButton("CLEAR RECENTS", DebugMenu.clearRecents);
  }
  createCategoryButtons() {
    for (let i = 0; i <= EDebugCategory.NAVIGATION; i++) this.createCategory(EDebugCategory[i], i);
    for (const spec of ALL_BUTTONS) this.createDebugMenuButton(spec);
  }
  wireSearchInput() {
    this.attachSearchInput();
  }
  static clearSearch() {
    DebugSearch.clear();
  }
  static setSearchQuery(query) {
    DebugSearch.setQuery(query);
  }
  static clearRecents() {
    DebugRecents.clear();
  }
  rebuildRecentCategory() {
    const category = this.getCategory(EDebugCategory.RECENT);
    if (!category) return;
    category.buttons.length = 0;
    for (const label of DebugRecents.getAll()) {
      const original = this.buttons.find((button) => button.getOriginalName?.() === label);
      if (!original) continue;
      const recent = new DebugGameButton();
      recent.setMovieClip(StringTable.getMovieClip("sc/debug.sc", "debug_menu_item"), true);
      recent.setTextFieldText(RECENT_PREFIX + label);
      recent.setOriginalName(label);
      recent.setCustomButtonListener(() => original.buttonPressed?.());
      category.buttons.push(recent);
    }
    this.needToUpdateLayout();
  }
  createTsResourceButtons() {
    for (const spec of RESOURCE_BUTTONS)
      this.createDebugMenuButton({
        ...spec,
        category: EDebugCategory.ACCOUNT,
        callback: () => LogicDebugButtonMessage.addResource(spec.resource, spec.amount),
      });
    for (const spec of FX_BUTTONS)
      this.createDebugMenuButton({
        ...spec,
        category: EDebugCategory.ACCOUNT,
        callback: () => LogicDebugButtonMessage.showFloater(spec.amount, spec.type),
      });
    for (const spec of NATIVE_FLOATER_OVERRIDE_BUTTONS)
      this.createDebugMenuButton({
        ...spec,
        category: EDebugCategory.ACCOUNT,
        callback: () =>
          LogicDebugButtonMessage.executeNativeWithFloater(spec.actionIdx, spec.amount, spec.type),
      });
  }
  createTsUnlockButtons() {}
  sortButtonsAndCategories() {
    this.categories.sort((a, b) => a.enumeration - b.enumeration);
    for (const category of this.categories)
      category.buttons.sort((a, b) => a.getOriginalName().localeCompare(b.getOriginalName()));
  }
  static isNotImplemented(label) {
    return this.notImplementedFunctions.includes(label);
  }
  static isButtonAvailable(spec) {
    if (spec.mode === "home" && GameMain.isInBattle?.()) return false;
    if (spec.mode === "battle" && !GameMain.isInBattle?.()) return false;
    return !this.isNotImplemented(spec.label);
  }
  static buttonPressed(spec) {
    if (!this.isButtonAvailable(spec)) return;
    Breadcrumbs.add?.("DebugMenu: " + spec.label);
    DebugRecents.push(spec.label);
    try {
      spec.callback?.();
    } catch (error) {
      ExceptionWorker.handle?.(error);
      EDebugger.addMessage?.(EDebugger.ERROR, error.stack || String(error));
    }
  }
  createDebugMenuButton(spec) {
    if (!DebugMenu.isButtonAvailable(spec)) return null;
    let button;
    if (spec.actionIdx !== undefined)
      button = new DebugCommandButton(
        spec.actionIdx,
        spec.amount ?? spec.intParameter ?? -1,
        spec.type ?? 0,
      );
    else button = new DebugGameButton();
    button.setMovieClip(StringTable.getMovieClip("sc/debug.sc", "debug_menu_item"), true);
    const text = Localisation.getString(spec.label) || spec.label;
    button.setTextFieldText(text);
    button.setOriginalName(spec.label);
    button.mode = spec.mode || "both";
    button.setCustomButtonListener(() => DebugMenu.buttonPressed(spec));
    this.addButton(button, spec.category ?? EDebugCategory.MAIN);
    return button;
  }
}
exports.DebugMenu = DebugMenu;
DebugMenu.notImplementedFunctions = [];
DebugMenu.dangerousFunctions = [];
