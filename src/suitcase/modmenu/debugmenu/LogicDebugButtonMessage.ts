// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESOURCE_NAMES = exports.EDebugAction = exports.LogicDebugButtonMessage = void 0;
const { Libg } = require("../../../lib/Libg");
const { Libc } = require("../../../lib/Libc");
const { LogicCommand } = require("./LogicCommand");
const { LogicHomeMode } = require("../../../laser/client/logic/mode/LogicHomeMode");
const { GameStateManager } = require("../../../laser/client/game/state/GameStateManager");
const { LogicMemory } = require("../../logic/LogicMemory");
const { LogicClientHome } = require("../../../laser/client/logic/home/LogicClientHome");
const { HomeScreen } = require("../../../laser/client/game/screen/home/HomeScreen");
const { StringObject } = require("../../../laser/titan/client/native/StringObject");
const { LogicDataTables } = require("../../../laser/client/logic/data/LogicDataTables");
const { HomeMode } = require("../../../laser/client/game/state/homemode/HomeMode");
const { GUI } = require("../../../laser/client/game/gui/GUI");
const {
  LogicClientAvatar,
  LogicClientAvatar_setCommodityCountOffset,
} = require("../../../laser/client/logic/avatar/LogicClientAvatar");

exports.RESOURCE_NAMES = {
  Gold: "Gold",
  Dust: "Dust",
  Upgradium: "Upgradium",
  Bolts: "Bolts",
  HeroLvlUpMaterial: "HeroLvlUpMaterial",
  FirstWins: "FirstWins",
  LegendaryTrophies: "LegendaryTrophies",
  Diamonds: "Diamonds",
  GearScrap: "GearScrap",
  ClubCoins: "ClubCoins",
  RecruitTokens: "RecruitTokens",
  ChromaticTokens: "ChromaticTokens",
  PowerPoints: "PowerPoints",
  Bling: "Bling",
  Fame: "Fame",
  CollabEventCurrency: "CollabEventCurrency",
  StarrDrop: "StarrDrop",
  BrawlPassBasic: "BrawlPassBasic",
  CompetitivePass: "CompetitivePass",
};
var EDebugAction;
(function (E) {
  E[(E.ADD_RESOURCES = 1)] = "ADD_RESOURCES";
  E[(E.ADD_GEMS = 14)] = "ADD_GEMS";
  E[(E.REMOVE_ALL_GEMS = 18)] = "REMOVE_ALL_GEMS";
  E[(E.REMOVE_ALL_COINS = 19)] = "REMOVE_ALL_COINS";
  E[(E.ADD_SCORE = 25)] = "ADD_SCORE";
  E[(E.ADD_POWER = 54)] = "ADD_POWER";
  E[(E.ADD_BRAWL_PASS_POINTS = 81)] = "ADD_BRAWL_PASS_POINTS";
  E[(E.BP_DEBUG_RESET_PROGRESS = 171)] = "BP_DEBUG_RESET_PROGRESS";
  E[(E.COMP_PASS_DEBUG_RESET = 287)] = "COMP_PASS_DEBUG_RESET";
  E[(E.ADD_CHAMPIONSHIP_WIN = 84)] = "ADD_CHAMPIONSHIP_WIN";
  E[(E.ADD_CHAMPIONSHIP_LOSS = 95)] = "ADD_CHAMPIONSHIP_LOSS";
  E[(E.REMOVE_CC_ESPORTS = 103)] = "REMOVE_CC_ESPORTS";
  E[(E.ADD_BLINGS = 182)] = "ADD_BLINGS";
  E[(E.REMOVE_HERO_SKINS = 184)] = "REMOVE_HERO_SKINS";
  E[(E.ADD_WINSTREAK = 210)] = "ADD_WINSTREAK";
  E[(E.REMOVE_WINSTREAK = 211)] = "REMOVE_WINSTREAK";
})((EDebugAction = exports.EDebugAction || (exports.EDebugAction = {})));

const resourceFloaterTypes = {
  HeroLvlUpMaterial: 1,
  Diamonds: 2,
  LegendaryTrophies: 14,
  RecruitTokens: 20,
  PowerPoints: 22,
  Bling: 23,
  CollabEventCurrency: 26,
};
const defaultResourceAmount = 1000;
const commandActionOffset = LogicMemory.offset(28);
const commandParameterOffset = LogicMemory.offset(32);
const commandCharacterOffset = LogicMemory.offset(56);
const selectedCharacterCountOffset = LogicMemory.offset(368);
const selectedCharacterArrayOffset = LogicMemory.offset(380);
const constructCommand = new NativeFunction(Libg.offset(10884024, 10102464), "void", ["pointer"]);
const nativeSetCommodityCount = new NativeFunction(
  LogicClientAvatar_setCommodityCountOffset,
  "pointer",
  ["pointer", "uint", "pointer", "uint", "uint"],
);
const nativeUnlockAll = new NativeFunction(Libg.offset(10913308, 10128064), "void", [
  "pointer",
  "pointer",
  "int",
  "int",
  "int",
  "uchar",
  "int",
  "pointer",
]);
const nativeAddCommand = new NativeFunction(HomeMode.HomeMode_addCommandOffset, "int", [
  "pointer",
  "pointer",
]);
const destructiveActions = new Set([
  EDebugAction.BP_DEBUG_RESET_PROGRESS,
  EDebugAction.COMP_PASS_DEBUG_RESET,
]);
let cosmeticCoinsButton = null;
let executingDebugCommand = false;
let destroyDebugCommand = false;

class DebugCommand extends LogicCommand {
  constructor(action, parameter) {
    const instance = Libc.malloc(148);
    constructCommand(instance);
    super(instance);
    instance.add(commandActionOffset).writeInt(action);
    instance.add(commandParameterOffset).writeInt(parameter);
  }
}

class LogicDebugButtonMessage {
  static patch() {
    Interceptor.replace(
      LogicClientAvatar_setCommodityCountOffset,
      new NativeCallback(
        (avatar, type, data, count, source) => {
          if (!executingDebugCommand && type !== 2 && type !== defaultResourceAmount)
            return nativeSetCommodityCount(avatar, type, data, count, source);
          return ptr(0);
        },
        "pointer",
        ["pointer", "uint", "pointer", "uint", "uint"],
      ),
    );
    Interceptor.replace(
      HomeMode.HomeMode_addCommandOffset,
      new NativeCallback(
        (homeMode, command) => {
          if (destroyDebugCommand && !command.isNull()) {
            LogicDebugButtonMessage.destroyCommand(command);
            return 0;
          }
          return nativeAddCommand(homeMode, command);
        },
        "int",
        ["pointer", "pointer"],
      ),
    );
  }
  static destroyCommand(instance) {
    const vtable = instance.readPointer();
    new NativeFunction(vtable.readPointer(), "void", ["pointer"])(instance);
    new NativeFunction(vtable.add(16).readPointer(), "void", ["pointer"])(instance);
  }
  static send(action, parameter = -1) {
    const homeMode = LogicHomeMode.getInstance();
    if (homeMode.isNull()) return;
    const command = new DebugCommand(action, parameter);
    const selected = this.getSelectedCharacter();
    if (!selected.isNull()) command.instance.add(commandCharacterOffset).writePointer(selected);
    executingDebugCommand = true;
    destroyDebugCommand = destructiveActions.has(action);
    try {
      command.execute(homeMode);
    } finally {
      executingDebugCommand = false;
      destroyDebugCommand = false;
    }
    if (action !== EDebugAction.ADD_RESOURCES) {
      if (action === EDebugAction.ADD_GEMS) {
        const resource = this.getResourcePointer("Diamonds");
        if (!resource.isNull()) this.showDataGainedFloater("Diamonds", resource, parameter);
        return;
      }
      if (action === EDebugAction.ADD_SCORE || action === EDebugAction.ADD_BRAWL_PASS_POINTS)
        this.showFloater(parameter, 3);
      else this.showFloater(parameter, 5);
      return;
    }
    this.addResource("HeroLvlUpMaterial", defaultResourceAmount);
  }
  static unlockAllBrawlers() {
    this.setLevelOnAllBrawlers(1);
  }
  static upgradeAllBrawlers() {
    this.setLevelOnAllBrawlers(11);
  }
  static unlockAll() {
    const homeMode = LogicHomeMode.getInstance();
    if (!homeMode.isNull()) {
      executingDebugCommand = true;
      try {
        nativeUnlockAll(NULL, homeMode, 1, 1, 1, 1, 0, NULL);
      } finally {
        executingDebugCommand = false;
      }
    }
  }
  static setLevelOnAllBrawlers(level) {
    const avatar = GameStateManager.getPlayerAvatar();
    if (avatar.instance.isNull()) return;
    const table = LogicDataTables.getTable(LogicDataTables.table.Characters);
    for (let i = 0; i < table.getItemCount(); i++) {
      const character = table.getItemAt(i);
      if (character !== null) avatar.setCommodityCount(5, character.instance, level - 1, 0);
    }
  }
  static executeNativeWithFloater(action, amount, floaterType) {
    const homeMode = LogicHomeMode.getInstance();
    if (homeMode.isNull()) return;
    const command = new DebugCommand(action, amount);
    const selected = this.getSelectedCharacter();
    if (!selected.isNull()) command.instance.add(commandCharacterOffset).writePointer(selected);
    executingDebugCommand = true;
    try {
      command.execute(homeMode);
    } finally {
      executingDebugCommand = false;
    }
    this.showFloater(amount, floaterType);
  }
  static addResource(name, amount, icon) {
    const avatar = GameStateManager.getPlayerAvatar();
    if (avatar.instance.isNull()) return;
    const resource = this.getResourcePointer(name);
    if (!resource.isNull()) {
      avatar.changeCommodityCount(0, resource, amount, 3);
      this.showDataGainedFloater(name, resource, amount, icon);
    }
  }
  static showDataGainedFloater(name, resource, amount, overrideType) {
    const type = overrideType !== undefined ? overrideType : resourceFloaterTypes[name];
    if (type !== undefined) this.showFloater(amount, type, resource);
  }
  static getResourcePointer(name) {
    this.resourceDataCache ||= new Map();
    const cached = this.resourceDataCache.get(name);
    if (cached) return cached;
    const data = LogicDataTables.getTableItemByName(LogicDataTables.table.Resources, name);
    const instance = data?.instance ?? NULL;
    if (!instance.isNull()) this.resourceDataCache.set(name, instance);
    return instance;
  }
  static showFloater(amount, type, data = NULL) {
    cosmeticCoinsButton ||= StringObject.create("button_cosmetic_coins");
    const button = HomeScreen.getHomePage().getButtonByName(cosmeticCoinsButton);
    if (button !== null)
      GUI.addDataGained(button.instance, type, amount, 0, data, 0, cosmeticCoinsButton, 0);
  }
  static getSelectedCharacter() {
    const playerData = LogicClientHome.getPlayerData();
    if (
      !playerData ||
      playerData.isNull() ||
      playerData.add(selectedCharacterCountOffset).readInt() < 1
    )
      return NULL;
    const array = playerData.add(selectedCharacterArrayOffset).readPointer();
    return array.isNull() ? NULL : array.readPointer();
  }
}
exports.LogicDebugButtonMessage = LogicDebugButtonMessage;
LogicDebugButtonMessage.resourceDataCache = null;
