// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugMenuBase = void 0;
const { DropGUIContainer } = require("../../../laser/titan/client/common/flash/DropGUIContainer");
const { ScrollArea } = require("../../../laser/titan/client/common/flash/ScrollArea");
const { Stage } = require("../../../laser/titan/client/common/flash/Stage");
const { StringTable } = require("../../../laser/client/game/text/StringTable");
const { DebugCommandButton } = require("./DebugCommandButton");
const { DebugMenuCategory, EDebugCategory } = require("./DebugMenuCategory");
const { Localisation } = require("../../localisation/Localisation");
const { GUIContainer } = require("../../../laser/titan/client/common/flash/GUIContainer");
const { DebugSearch } = require("./DebugSearch");
const { BattleMode } = require("../../../laser/client/game/state/battlemode/BattleMode");
const { GameStateManager } = require("../../../laser/client/game/state/GameStateManager");
const { GameInputField } = require("../../../laser/titan/client/common/flash/GameInputField");
const { DebugMenuState } = require("./DebugMenuState");
const LAYOUT_GAP = 64;
class DebugMenuBase extends DropGUIContainer {
  constructor(fileName, exportName) {
    super();
    this.lastReadSearchText = "";
    this.lastIsBattleMode = false;
    this.lastIsMapEditor = false;
    const clip = StringTable.getMovieClip(fileName, exportName);
    this.setMovieClip(clip);
    this.movieClip = GUIContainer._getMovieClip(this.instance);
    this.buttons = [];
    const matrixY = Stage.getMatrixY();
    const height = this.height;
    if (height > 0) this.movieClip.scale = matrixY / height;
    this.setPixelSnappedXY(Stage.getMatrixX(), 0);
    const itemArea = this.movieClip.getTextFieldByName("item_area");
    this.scrollArea = new ScrollArea(itemArea, 1);
    this.scrollArea.enablePinching(false);
    this.scrollArea.setAlignment(4);
    this.scrollArea.enableHorizontalDrag(false);
    this.scrollArea.enableVerticalDrag(true);
    this.scrollArea.setClipping(true);
    this.scrollArea.clipHeight =
      height > 0 ? height - this.scrollArea.y : this.scrollArea.clipHeight - 20;
    this.movieClip.addChild(this.scrollArea);
    const tabArea = this.movieClip.getTextFieldByName("tab_area");
    if (tabArea) {
      this.tabScrollArea = new ScrollArea(tabArea, 1);
      this.tabScrollArea.enablePinching(false);
      this.tabScrollArea.setAlignment(8);
      this.tabScrollArea.enableHorizontalDrag(true);
      this.tabScrollArea.enableVerticalDrag(false);
      this.tabScrollArea.setClipping(true);
      this.movieClip.addChild(this.tabScrollArea);
    }
    this.categories = [];
    this.shouldUpdateLayout = true;
    this.attachSearchInput();
    this.lastIsBattleMode = this.pollBattleModeChange();
    this.lastIsMapEditor = this.pollMapEditorChange();
  }
  needToUpdateLayout() {
    this.shouldUpdateLayout = true;
  }
  buttonPressed(button, instance) {
    DebugCommandButton.callback(button, instance);
  }
  createCategory(name, enumeration) {
    const category = new DebugMenuCategory(name, enumeration);
    category.onToggle = this.needToUpdateLayout.bind(this);
    this.categories.push(category);
    this.scrollArea.addChild(category);
    if (this.tabScrollArea) this.tabScrollArea.addChild(category.mini);
    return category;
  }
  onMiniTabPressed(category) {
    category.buttonPressed();
  }
  getCategory(enumeration) {
    return this.categories.find((category) => category.enumeration === enumeration);
  }
  removeCategory(enumeration) {
    const category = this.getCategory(enumeration);
    if (!category) return;
    this.categories.splice(this.categories.indexOf(category), 1);
    category.destruct();
    this.needToUpdateLayout();
  }
  addButton(button, category) {
    const target = typeof category === "number" ? this.getCategory(category) : category;
    if (target) target.buttons.push(button);
    this.buttons.push(button);
    this.scrollArea.addChild(button);
    this.needToUpdateLayout();
    return button;
  }
  setTitle(text) {
    const title = this.movieClip.getTextFieldByName("title");
    if (title) title.text = text;
  }
  refreshFilters(options = {}) {
    const query = DebugSearch.getQuery();
    for (const category of this.categories) {
      let visible = 0;
      for (const button of category.buttons) {
        button.isFilteredOut = !DebugSearch.matches(
          button.getOriginalName?.() || button.getTextFieldText?.() || "",
        );
        if (!button.isFilteredOut) visible++;
      }
      category.isFilteredOut = query.length > 0 && visible === 0;
      if (options.syncCategoryOpenStateToSearch && query.length > 0 && visible > 0)
        category.setOpened(true);
    }
    this.needToUpdateLayout();
  }
  attachSearchInput() {
    this.searchInputField = this.buildSearchInputField();
    if (this.searchInputField) this.activateSearch();
  }
  buildSearchInputField() {
    const field = this.movieClip.getTextFieldByName("search_input");
    return field ? new GameInputField(field) : null;
  }
  pollSearchInput() {
    if (!this.searchInputField) return;
    const text = this.searchInputField.getText?.() ?? this.searchInputField.text ?? "";
    if (text !== this.lastReadSearchText) {
      this.lastReadSearchText = text;
      DebugSearch.setQuery(text);
    }
  }
  activateSearch() {
    this.searchInputField?.setText?.(DebugSearch.getQuery());
  }
  clearSearchInput() {
    this.searchInputField?.setText?.("");
    this.lastReadSearchText = "";
    DebugSearch.clear();
  }
  update(delta) {
    super.update?.(delta);
    this.pollSearchInput();
    const battle = this.pollBattleModeChange();
    if (battle !== this.lastIsBattleMode) {
      this.lastIsBattleMode = battle;
      this.onBattleModeChange(battle);
    }
    const editor = this.pollMapEditorChange();
    if (editor !== this.lastIsMapEditor) {
      this.lastIsMapEditor = editor;
      this.onMapEditorChange(editor);
    }
    if (this.shouldUpdateLayout) this.updateLayout();
    this.updateElements();
  }
  pollBattleModeChange() {
    return !BattleMode.getInstance().isNull();
  }
  onBattleModeChange(_isBattleMode) {}
  pollMapEditorChange() {
    return Boolean(GameStateManager.getMapEditorMode?.());
  }
  onMapEditorChange(_isMapEditor) {}
  updateLayout() {
    let y = 0;
    for (const category of this.categories) {
      category.getMovieClip().visibility = !category.isFilteredOut;
      if (category.isFilteredOut) continue;
      category.setPixelSnappedXY(0, y);
      y += category.height;
      if (category.isCategoryOpened()) {
        for (const button of category.sortButtons()) {
          button.getMovieClip().visibility = !button.isFilteredOut;
          if (button.isFilteredOut) continue;
          button.setPixelSnappedXY(LAYOUT_GAP, y);
          y += button.height;
        }
      }
    }
    this.scrollArea.refreshBounds?.(y);
    this.shouldUpdateLayout = false;
  }
  updateElements() {}
  onDestructed() {}
  destruct() {
    this.onDestructed();
    DebugMenuState.isOpen = false;
    super.destruct?.();
  }
  toggle() {
    DebugMenuState.isOpen ? this.hide() : this.show();
  }
  show() {
    this.setVisible?.(true);
    DebugMenuState.isOpen = true;
  }
  hide() {
    this.setVisible?.(false);
    DebugMenuState.isOpen = false;
  }
}
exports.DebugMenuBase = DebugMenuBase;
