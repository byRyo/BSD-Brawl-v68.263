// @ts-nocheck
const { LogicMemory } = require("../../../../../../suitcase/logic/LogicMemory");
const { HomeScreen } = require("../HomeScreen");
const { PlayerInfo } = require("../../../friends/PlayerInfo");
const { Libg } = require("../../../../../../lib/Libg");
const { MovieClip } = require("../../../../../titan/client/common/flash/MovieClip");
const { GUIContainer } = require("../../../../../titan/client/common/flash/GUIContainer");
const { LobbyInfo } = require("../../../../../../suitcase/modconfiguration/LobbyInfo");
const { Breadcrumbs } = require("../../../../../../suitcase/debug/Breadcrumbs");
const { CustomButton } = require("../../../../../titan/client/common/flash/CustomButton");
const { HomeMode } = require("../../../state/homemode/HomeMode");
const {
  LogicClaimDailyRewardCommand,
} = require("../../../../logic/command/LogicClaimDailyRewardCommand");
const { LogicHeroSeenCommand } = require("../../../../logic/command/LogicHeroSeenCommand");
const { LogicItemSeenCommand } = require("../../../../logic/command/LogicItemSeenCommand");
const { MovieClipHelper } = require("../../../../../titan/client/common/flash/MovieClipHelper");
const { StringObject } = require("../../../../../titan/client/native/StringObject");
const { MessageManager } = require("../../../network/MessageManager");
const {
  CancelMatchmakingMessage_ctor,
} = require("../../../network/messaging/message/CancelMatchmakingMessage");
const { Config } = require("../../../../../../suitcase/config/Config");
const { LogInfo } = require("../../../../../../../index");
const { GameStateManager } = require("../../../state/GameStateManager");
const { LogicDataTables } = require("../../../../logic/data/LogicDataTables");
const { StringTable } = require("../../../text/StringTable");

const reloadNative = new NativeFunction(Libg.offset(9787596, 9220584), "void", ["pointer"]);
const rebuildNative = new NativeFunction(Libg.offset(9506752, 9246336), "void", ["pointer"]);
const tryOpenMapEditorNative = new NativeFunction(Libg.offset(9887008, 9299824), "int", [
  "pointer",
]);
const tryOpenClanPopupNative = new NativeFunction(Libg.offset(9887780, 9300472), "pointer", [
  "int",
]);
const openTeamupPopupNative = new NativeFunction(Libg.offset(9886908, 9299724), "pointer", ["int"]);
const startGameNative = new NativeFunction(Libg.offset(9836624, 9254420), "void", [
  "pointer",
  "pointer",
  "pointer",
  "int",
  "pointer",
  "pointer",
  "int",
  "pointer",
  "int",
]);
const startMatchmakingNative = new NativeFunction(Libg.offset(12584068, 11447204), "void", [
  "pointer",
  "pointer",
  "pointer",
  "pointer",
  "pointer",
  "pointer",
]);
const readyButtonNative = new NativeFunction(Libg.offset(8924704, 8492216), "void", [
  "pointer",
  "bool",
  "pointer",
]);

const navigationOffset = LogicMemory.offset(1312);
const buttonsOffset = LogicMemory.offset(320);
const battleButtonOffset = LogicMemory.offset(808, 840);
const holdDuration = 400;
let modeButtonName = null;
let naviBrawlersButtonName = null;

function getModeButtonName() {
  return (modeButtonName ??= StringObject.create("button_mode"));
}
function getNaviBrawlersButtonName() {
  return (naviBrawlersButtonName ??= StringObject.create("button_navi_brawlers"));
}

class HomePage extends GUIContainer {
  static startGameListeners = [];

  static reload() {
    const sprite = HomeScreen.getSprite();
    const homePage = HomeScreen.getHomePage();
    sprite.removeChild(homePage.instance);
    reloadNative(homePage.instance);
    rebuildNative(homePage.instance);
    sprite.addChildAt(homePage, 1);
    HomeScreen.createLobbyInfo();
    if (!PlayerInfo.isInGameroom) {
      new MovieClip(homePage.instance.add(navigationOffset).readPointer()).visibility = false;
    }
    MessageManager.inMatchMaking = false;
  }

  getButtonByName(name) {
    const instance = MovieClipHelper.findButtonByName(name, this.instance.add(buttonsOffset));
    if (instance.isNull()) return null;
    return new CustomButton(instance);
  }
  getModeButton() {
    return this.getButtonByName(getModeButtonName());
  }
  getNaviBrawlersButton() {
    return this.getButtonByName(getNaviBrawlersButtonName());
  }

  static tryOpenMapEditorPopup() {
    const homePage = HomeScreen.getHomePage();
    if (!homePage.instance.isNull()) tryOpenMapEditorNative(homePage.instance);
  }
  static tryOpenClanPopup(value = false) {
    tryOpenClanPopupNative(value);
  }
  static openTeamupPopup() {
    openTeamupPopupNative(0);
  }
  static startGame(arg0, arg1, arg2) {
    const homePage = HomeScreen.getHomePage();
    if (!homePage.instance.isNull()) {
      startGameNative(homePage.instance, NULL, arg0, arg1, arg2, NULL, 0, NULL, 1);
    }
  }
  static addStartGameListener(listener) {
    this.startGameListeners.push(listener);
  }

  static setBattleButtonText(text) {
    const button = HomeScreen.getHomePage().instance.add(battleButtonOffset).readPointer();
    const setText = new NativeFunction(button.readPointer().add(432).readPointer(), "void", [
      "pointer",
      "pointer",
      "int",
    ]);
    setText(button, StringObject.create(text), 1);
  }

  static patch() {
    Interceptor.attach(reloadNative, {
      onEnter(args) {
        this.self = args[0];
        Breadcrumbs.push("HomePage::ctor");
        CustomButton.clearAllHoldListeners();
      },
      onLeave() {
        const homePage = new HomePage(this.self);
        HomeScreen.lobbyInfo = new LobbyInfo(homePage);
        HomeScreen.lobbyInfo.update();

        const root = MovieClip.castInstanceToClass(
          homePage.instance
            .add(296)
            .readPointer()
            .add(7 * Process.pointerSize)
            .readPointer(),
        );
        try {
          const child = root.getChildById(2).getChildAt(0);
          if (child) {
            const clip = MovieClip.castInstanceToClass(child).getChildById(0);
            const prestige = clip.getChildByName("prestige");
            const avatar = GameStateManager.getPlayerAvatar();
            const fameData = LogicDataTables.getFameData();
            const fame = avatar.getCommodityCount(0, fameData);
            if (fame === 0) return;
            const tier = LogicDataTables.getFameTierByFame(fame);
            if (tier) {
              const icon = StringTable.getMovieClip("sc/ui.sc", tier.iconStarsExportName);
              icon.x = prestige.x + 91;
              icon.y = prestige.y;
              icon.scale = 0.1;
              clip.addChild(icon);
            }
          }
        } catch (error) {
          LogInfo(error.stack);
        }
        HomePage.registerModeButtonHold(homePage);
        HomePage.registerNaviBrawlersButtonHold(homePage);
      },
    });

    Interceptor.attach(startGameNative, {
      onEnter(args) {
        const value = args[3].toInt32();
        for (const listener of HomePage.startGameListeners) listener(value);
      },
    });

    Interceptor.replace(
      readyButtonNative,
      new NativeCallback(
        (self, value, data) => {
          const homePage = HomeScreen.getHomePage();
          MessageManager.readyButton = homePage.instance.add(battleButtonOffset).readPointer();
          if (!Config.config.BackgroundMatchmaking) readyButtonNative(self, value, data);
        },
        "void",
        ["pointer", "bool", "pointer"],
      ),
    );

    Interceptor.replace(
      startMatchmakingNative,
      new NativeCallback(
        (arg0, arg1, arg2, arg3, arg4, arg5) => {
          if (Config.config.BackgroundMatchmaking) {
            if (MessageManager.inMatchMaking) {
              CancelMatchmakingMessage_ctor(arg0);
              MessageManager.stopMatchMaking();
              return;
            }
            MessageManager.inMatchMaking = true;
          }
          startMatchmakingNative(arg0, arg1, arg2, arg3, arg4, arg5);
        },
        "void",
        ["pointer", "pointer", "pointer", "pointer", "pointer", "pointer"],
      ),
    );
  }

  static registerModeButtonHold(homePage) {
    const button = homePage.getModeButton();
    if (button !== null) {
      button.setCustomButtonHoldListener(() => {
        for (const { slotIndex } of HomeMode.getUnclaimedXpEventSlots()) {
          const command = LogicClaimDailyRewardCommand.create(
            slotIndex,
            LogicClaimDailyRewardCommand.ClaimType.ClaimXp,
          );
          HomeMode.addCommand(command);
        }
      }, holdDuration);
    }
  }

  static registerNaviBrawlersButtonHold(homePage) {
    const button = homePage.getNaviBrawlersButton();
    if (button !== null) {
      button.setCustomButtonHoldListener(() => {
        if (!HomeMode.getInstance()) return;
        for (const character of HomeMode.getUnseenCharacters()) {
          HomeMode.addCommand(
            LogicHeroSeenCommand.create(
              character.instance,
              LogicHeroSeenCommand.SeenState.FullyViewed,
            ),
          );
        }
        const items = HomeMode.getNewCardItems();
        if (items) {
          for (const item of items) HomeMode.addCommand(LogicItemSeenCommand.create(item));
        }
      }, holdDuration);
    }
  }
}

exports.HomePage = HomePage;
