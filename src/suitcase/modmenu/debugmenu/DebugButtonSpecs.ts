// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESOURCE_BUTTONS =
  exports.FX_BUTTONS =
  exports.NATIVE_FLOATER_OVERRIDE_BUTTONS =
  exports.ALL_BUTTONS =
    void 0;
const { EDebugCategory } = require("./DebugMenuCategory");
const { EDebugAction, LogicDebugButtonMessage } = require("./LogicDebugButtonMessage");
const { DebugCallbacks } = require("./DebugCallbacks");
const { GUI } = require("../../../laser/client/game/gui/GUI");
const { ThemeSelectorPopup } = require("../ThemeSelector");
const { BrawlerMenuPopup } = require("../gatcha/BrawlerMenu");
const { HomeMode } = require("../../../laser/client/game/state/homemode/HomeMode");
exports.RESOURCE_BUTTONS = [
  { label: "ADD_STAR_POINTS", resource: "LegendaryTrophies", amount: 100 },
  { label: "ADD_POWER_POINTS", resource: "PowerPoints", amount: 1000 },
  { label: "ADD_CREDITS", resource: "RecruitTokens", amount: 100 },
  { label: "ADD_BLING_RESOURCE", resource: "Bling", amount: 1000 },
  { label: "ADD_COLLAB_CURRENCY", resource: "CollabEventCurrency", amount: 100 },
];
exports.FX_BUTTONS = [{ label: "ADD_GOLD_TICKETS", amount: 5, type: 33 }];
exports.NATIVE_FLOATER_OVERRIDE_BUTTONS = [
  { label: "ADD_LEGENDARY_TROPHIES", actionIdx: EDebugAction.ADD_SCORE, amount: 100, type: 28 },
];
exports.ALL_BUTTONS = [
  {
    label: "THEME_SELECTOR",
    category: EDebugCategory.MAIN,
    mode: "home",
    callback: () => GUI.showPopup(new ThemeSelectorPopup(), true, false, true),
  },
  {
    label: "BRAWLER_GACHA",
    category: EDebugCategory.GACHA_IAP,
    mode: "home",
    callback: () =>
      GUI.showPopup(new BrawlerMenuPopup(false, HomeMode.gatchaType.Character), true, false, true),
  },
  {
    label: "UNLOCK_ALL_BRAWLERS",
    category: EDebugCategory.ACCOUNT,
    mode: "home",
    callback: LogicDebugButtonMessage.unlockAllBrawlers.bind(LogicDebugButtonMessage),
  },
  {
    label: "UPGRADE_ALL_BRAWLERS",
    category: EDebugCategory.ACCOUNT,
    mode: "home",
    callback: LogicDebugButtonMessage.upgradeAllBrawlers.bind(LogicDebugButtonMessage),
  },
  {
    label: "UNLOCK_ALL",
    category: EDebugCategory.ACCOUNT,
    mode: "home",
    callback: LogicDebugButtonMessage.unlockAll.bind(LogicDebugButtonMessage),
  },
  ...Object.getOwnPropertyNames(DebugCallbacks)
    .filter(
      (name) =>
        typeof DebugCallbacks[name] === "function" &&
        !["length", "name", "prototype"].includes(name),
    )
    .map((name) => ({
      label: name.replace(/([A-Z])/g, "_$1").toUpperCase(),
      category: EDebugCategory.UTILS,
      callback: DebugCallbacks[name].bind(DebugCallbacks),
    })),
];
