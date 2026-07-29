// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModMenuPopup = void 0;
const { ModMenuPopupLegacy } = require("./ModMenuLegacy");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { StringTable } = require("../../laser/client/game/text/StringTable");
const { ScrollArea } = require("../../laser/titan/client/common/flash/ScrollArea");
class ModMenuPopup extends ModMenuPopupLegacy {
  constructor() {
    super();
    this.currentTab = 0;
    this.tabs = ModMenuPopup.TABS;
  }
  addBackButton() {
    const button = this.addGameButton("button_back", true);
    button.setCustomButtonListener(this.onBackButtonPressed.bind(this));
    return button;
  }
  addCloseButton() {
    const button = this.addGameButton("button_close", true);
    button.setCustomButtonListener(this.closeButtonPressed.bind(this));
    return button;
  }
  addArrows() {
    const previous = this.addGameButton("button_previous", true),
      next = this.addGameButton("button_next", true);
    previous.setCustomButtonListener(this.previousTab.bind(this));
    next.setCustomButtonListener(this.nextTab.bind(this));
    this.previousButton = previous;
    this.nextButton = next;
  }
  previousTab() {
    this.changeTab(-1);
  }
  nextTab() {
    this.changeTab(1);
  }
  changeTab(direction) {
    this.currentTab = (this.currentTab + direction + this.tabs.length) % this.tabs.length;
    this.loadContent();
  }
  createSubheadingTextfield() {
    this.subheadingTextfield = StringTable.getMovieClip(
      "sc/ui.sc",
      "popover_text_left",
    ).getTextFieldByName("text");
    this.getMovieClip().addChild(this.subheadingTextfield);
    return this.subheadingTextfield;
  }
  createTabs() {
    this.tabButtons = this.tabs.map((tab, index) => {
      const button = new GameButton();
      button.id = index;
      button.setCustomButtonListener(() => this.selectTab(index), "mod_menu_tab_" + tab);
      return button;
    });
    return this.tabButtons;
  }
  createScrollArea() {
    this.scrollArea = new ScrollArea();
    this.getMovieClip().addChild(this.scrollArea);
    return this.scrollArea;
  }
  loadContent() {
    this.refreshItems();
  }
  getItemsForTab() {
    return ModMenuPopupLegacy.ITEMS;
  }
  selectTab(index) {
    this.currentTab = index;
    this.loadContent();
  }
  updateElements(time) {
    super.updateElements?.(time);
  }
  onBackButtonPressed() {
    this.fadeOut();
  }
}
ModMenuPopup.TABS = ["LOBBY", "PLAYER", "MISC", "DEBUG"];
exports.ModMenuPopup = ModMenuPopup;
