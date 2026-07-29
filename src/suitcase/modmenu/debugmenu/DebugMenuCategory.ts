// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EDebugCategory = exports.DebugMenuCategory = void 0;
var EDebugCategory;
(function (EDebugCategory) {
  EDebugCategory[(EDebugCategory.MAIN = 0)] = "MAIN";
  EDebugCategory[(EDebugCategory.RECENT = 1)] = "RECENT";
  EDebugCategory[(EDebugCategory.PREVIEW = 2)] = "PREVIEW";
  EDebugCategory[(EDebugCategory.ACCOUNT = 3)] = "ACCOUNT";
  EDebugCategory[(EDebugCategory.UTILS = 4)] = "UTILS";
  EDebugCategory[(EDebugCategory.SC_ID = 5)] = "SC_ID";
  EDebugCategory[(EDebugCategory.SOCIAL = 6)] = "SOCIAL";
  EDebugCategory[(EDebugCategory.GACHA_IAP = 7)] = "GACHA_IAP";
  EDebugCategory[(EDebugCategory.BATTLE = 8)] = "BATTLE";
  EDebugCategory[(EDebugCategory.TIME = 9)] = "TIME";
  EDebugCategory[(EDebugCategory.BRAWL_PASS = 10)] = "BRAWL_PASS";
  EDebugCategory[(EDebugCategory.CHALLENGE = 11)] = "CHALLENGE";
  EDebugCategory[(EDebugCategory.REPLAY_SPECTATE = 12)] = "REPLAY_SPECTATE";
  EDebugCategory[(EDebugCategory.MAP_EDITOR = 13)] = "MAP_EDITOR";
  EDebugCategory[(EDebugCategory.AUDIO = 14)] = "AUDIO";
  EDebugCategory[(EDebugCategory.NOTIFICATIONS = 15)] = "NOTIFICATIONS";
  EDebugCategory[(EDebugCategory.PRC_CHINA = 16)] = "PRC_CHINA";
  EDebugCategory[(EDebugCategory.GFX = 17)] = "GFX";
  EDebugCategory[(EDebugCategory.GUI = 18)] = "GUI";
  EDebugCategory[(EDebugCategory.TESTS = 19)] = "TESTS";
  EDebugCategory[(EDebugCategory.RANKED = 20)] = "RANKED";
  EDebugCategory[(EDebugCategory.NAVIGATION = 21)] = "NAVIGATION";
})((EDebugCategory = exports.EDebugCategory || (exports.EDebugCategory = {})));
const { StringTable } = require("../../../laser/client/game/text/StringTable");
const { DebugGameButton } = require("./DebugGameButton");
const { LogicMemory } = require("../../logic/LogicMemory");
const openedOffset = LogicMemory.offset(582);
class DebugMenuCategory extends DebugGameButton {
  constructor(name, enumeration) {
    super();
    this.isFilteredOut = false;
    this.setMovieClip(StringTable.getMovieClip("sc/debug.sc", "debug_menu_category"), true);
    this.mini = new DebugGameButton();
    this.mini.setMovieClip(
      StringTable.getMovieClip("sc/debug.sc", "debug_menu_category_mini"),
      true,
    );
    this.mini.setText("text", name.substring(0, 3));
    this.name = name;
    this.enumeration = enumeration;
    this.buttons = [];
    this.instance.add(openedOffset).writeU8(0);
    this.setCustomButtonListener(this.buttonPressed.bind(this));
    this.mini.setCustomButtonListener(this.buttonPressed.bind(this));
  }
  isCategoryOpened() {
    return Boolean(this.instance.add(openedOffset).readU8());
  }
  setOpened(opened) {
    this.instance.add(openedOffset).writeU8(opened ? 1 : 0);
  }
  buttonPressed() {
    this.setOpened(!this.isCategoryOpened());
    this.onToggle?.();
  }
  sortButtons() {
    return this.buttons.slice();
  }
}
exports.DebugMenuCategory = DebugMenuCategory;
