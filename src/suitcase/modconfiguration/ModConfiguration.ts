// @ts-nocheck
const ModConfigurationItemModule = require("../flash/popup/button/ModConfigurationItem");
const { GenericPopup } = require("../../laser/titan/client/common/flash/GenericPopup");
const { Config } = require("../config/Config");
const { ScrollArea } = require("../../laser/titan/client/common/flash/ScrollArea");
const { LogicMemory } = require("../logic/LogicMemory");
const { Localisation } = require("../localisation/Localisation");
const { StringTable } = require("../../laser/client/game/text/StringTable");
const MapEditorModifierPopup = require("../../laser/client/game/gui/popup/MapEditorModifierPopup");
const { FileManager } = require("../filesystem/FileManager");
const { ModProperties } = require("../config/ModProperties");
const GameMainModule = require("../../laser/client/GameMain");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { SettingsPopup } = require("../../laser/client/game/gui/popup/SettingsPopup");
const { LogicNativeDialog } = require("../logic/LogicNativeDialog");
const { EDebugger } = require("../debug/EDebugger");
const { FPSCounter } = require("./FPSCounter");
const ThemeSelector = require("../modmenu/ThemeSelector");
const { Validation } = require("../validation/Validation");
const { PlayerInfo } = require("../../laser/client/game/friends/PlayerInfo");
const { HomeScreen } = require("../../laser/client/game/screen/home/HomeScreen");
const { DebugMenuButton } = require("../modmenu/DebugMenuButton");
const IconCallbacks = require("./IconCallbacks");

const { EBehaviour, EModItem, ModConfigurationItem } = ModConfigurationItemModule;
const { CustomModNames, GameMain } = GameMainModule;

const popupButtonsOffset = LogicMemory.offset(416);
const popupButtonCountOffset = LogicMemory.offset(448);
const popupScrollAreaOffset = LogicMemory.offset(520);
const scrollAreaFlagOffset = LogicMemory.offset(224);
const scrollAreaWidthOffset = LogicMemory.offset(192);
const popupContentHeightOffset = LogicMemory.offset(480);

function item(id, infoPrefix, configKey, options = {}) {
  return {
    id: EModItem[id],
    infoPrefix,
    key: Config.config[configKey],
    configKey,
    ...options,
  };
}

class ModConfigurationPopup extends GenericPopup {
  constructor() {
    super("popup_editor_modifier", false, false, "", "", "");

    this.ITEMS = {
      ModConfigurationPopupSubheadingCustomization: [
        item("CHROMATIC_NAME", "VisualChromaticName", "ChromaticName", {
          shouldReloadGame: true,
          iconCallback: IconCallbacks.VisualChromaticNamePinCallback,
        }),
        item("PIN_ANIMATION", "DisablePinAnimation", "DisablePinAnimation", {
          iconCallback: IconCallbacks.DisablePinAnimationCallback,
        }),
        item("SHARED_BACKGROUND", "UseThemeAllScreens", "SharedBackground", {
          shouldReopenSettingsPopup: true,
          iconCallback: IconCallbacks.SharedBackgroundCallback,
        }),
        {
          id: EModItem.MOD_OLD_RANK,
          disabled: true,
          infoPrefix: "OldRankMod",
          key: Config.config.CustomMods.includes(CustomModNames.oldRankMod),
          shouldReloadGame: true,
          payload: CustomModNames.oldRankMod,
          configKey: "CustomMods",
          behaviour: EBehaviour.CUSTOM_MOD,
        },
        {
          id: EModItem.RANDOM_THEMES_S1,
          infoPrefix: "RandomThemes",
          key: Config.config.RandomThemeMask[0],
          callback: () => ThemeSelector.ThemeSelectorManager.patchRandomThemes(0),
          iconCallback: IconCallbacks.RandomThemesCallback,
        },
        {
          id: EModItem.RANDOM_THEMES_S2,
          infoPrefix: "RandomThemesAfterBattle",
          key: Config.config.RandomThemeMask[2],
          callback: () => ThemeSelector.ThemeSelectorManager.patchRandomThemes(2),
          iconCallback: IconCallbacks.RandomThemesAfterBattleCallback,
        },
        {
          id: EModItem.RANDOM_THEMES_S3,
          infoPrefix: "RandomThemesMusicIndependency",
          key: Config.config.RandomThemeMask[1],
          callback: () => ThemeSelector.ThemeSelectorManager.patchRandomThemes(1),
          iconCallback: IconCallbacks.RandomThemesMusicIndependencyCallback,
        },
        item("FPS_COUNTER", "ShowFPSCounter", "ShowFPSCounter", {
          callback: (state) => FPSCounter.toggle(state),
          iconCallback: IconCallbacks.ShowFPSCounterCallback,
        }),
        item("ENFORCE_OLD_FRIENDS_LIST", "EnforceOldFriendsList", "EnforceOldFriendsList", {
          iconCallback: IconCallbacks.EnforceOldFriendsListCallback,
        }),
        item("HOMESCREEN_TEXT", "HideLobbyInfo", "HideHomeScreenText", {
          iconCallback: IconCallbacks.HideHomeScreenTextCallback,
        }),
        item("SHOW_SKIN_NAMES_IN_PROFILE", "ShowSkinNamesInProfile", "ShowSkinNamesInProfile", {
          iconCallback: IconCallbacks.ShowSkinNamesInProfileCallback,
        }),
        item("LEGACY_BACKGROUNDS", "LegacyBackgrounds", "LegacyBackgrounds", {
          disabled: !ModProperties.isDev(),
          callback: (state) => {
            ThemeSelector.LegacyBackgroundManager.apply(HomeScreen.getThemeMovieClip(), state);
          },
        }),
      ],

      ModConfigurationPopupSubheadingBattle: [
        item("BATTLE_TEXT_CHAT", "BattleTextChat", "BattleTextChat", {
          iconCallback: IconCallbacks.BattleTextChatCallback,
        }),
        item("ENEMY_AMMO_STATUS", "ShowEnemyAmmoStatus", "ShowEnemyAmmoStatus", {
          iconCallback: IconCallbacks.ShowEnemyAmmoStatusCallback,
        }),
        item("SHOW_TROPHIES_ABOVE_HEAD", "ShowTrophiesAboveHead", "ShowTrophiesAboveHead", {
          isBSDPlusOnly: true,
          iconCallback: IconCallbacks.ShowTrophiesAboveHeadCallback,
        }),
        item("BATTLE_CAMERA", "ShowCameraButton", "ShowBattleCameraButton", {
          iconCallback: IconCallbacks.ShowCameraButtonCallback,
        }),
        item("SUPER_AIM", "HideUltiAiming", "HideSuperAim", {
          iconCallback: IconCallbacks.HideUltiAimingCallback,
        }),
        item("SHOW_FAST_PLAY_AGAIN_BUTTON", "ShowFastPlayAgainButton", "ShowFastPlayAgainButton", {
          iconCallback: IconCallbacks.ShowFastPlayAgainButtonCallback,
        }),
        item(
          "SHOW_AUTO_PLAY_AGAIN_RADIO_BUTTON",
          "ShowAutoPlayAgainRadioButton",
          "ShowAutoPlayAgainRadioButton",
          { iconCallback: IconCallbacks.ShowAutoPlayAgainRadioButtonCallback },
        ),
        item("BATTLE_BLACK_BARS", "HideLaserScreenMask", "HideBattleBlackBars", {
          iconCallback: IconCallbacks.HideBattleBlackBarsCallback,
        }),
        item("BATTLE_END_INSTANT_EXIT", "BattleEndInstantExit", "BattleEndInstantExit", {
          iconCallback: IconCallbacks.BattleEndInstantExitCallback,
        }),
        item("BACKGROUND_MATCHMAKING", "BackgroundMatchmaking", "BackgroundMatchmaking", {
          iconCallback: IconCallbacks.BackgroundMatchmakingCallback,
        }),
        item("ANTI_AFK_KICK", "AntiAfkKick", "AntiAfkKick", {
          disabled: true,
          iconCallback: IconCallbacks.AntiAfkKickCallback,
        }),
        item("COLORED_DAMAGE", "ColoredDamage", "ColoredDamage", {
          disabled: true,
          iconCallback: IconCallbacks.ColoredDamageCallback,
        }),
        item("DO_NOT_SHOW_BATTLE_HL", "DoNotShowBattleHighlight", "DoNotShowBattleHighlight", {
          iconCallback: IconCallbacks.DoNotShowBattleHighlightCallback,
        }),
        item(
          "BATTLE_CONNECTION_INDICATOR",
          "ShowConnectionIndicatorInBattle",
          "ShowBattleConnectionIndicator",
          { iconCallback: IconCallbacks.ShowBattleConnectionIndicatorCallback },
        ),
        item(
          "OWN_PLAYER_COORDINATES",
          "ShowOwnPlayerCoordinatesInBattle",
          "ShowOwnPlayerCoordinates",
          { iconCallback: IconCallbacks.ShowOwnPlayerCoordinatesCallback },
        ),
        item("SHOW_CHARACTERS_IN_NAMES", "ShowCharactersInNames", "ShowCharactersInNames", {
          iconCallback: IconCallbacks.ShowCharactersInNamesCallback,
        }),
        item("SHAME_THUMBSDOWN", "ShamePlayersWithThumbsdownPin", "ShamePlayersWithThumbsdownPin", {
          iconCallback: IconCallbacks.ShamePlayersWithThumbsdownPinCallback,
        }),
        item("SHOW_FRIENDS_IN_BATTLE", "ShowFriendsInBattle", "ShowFriendsInBattle", {
          iconCallback: IconCallbacks.ShowFriendsInBattleCallback,
        }),
        item(
          "SHOW_ALLIANCE_MEMBERS_IN_BATTLE",
          "ShowAllianceMembersInBattle",
          "ShowAllianceMembersInBattle",
          { iconCallback: IconCallbacks.ShowAllianceMembersInBattleCallback },
        ),
        item("BATTLE_PROXY", "UseBattleProxy", "UseBattleProxy", {
          isBSDPlusOnly: true,
          iconCallback: IconCallbacks.UseBattleProxyCallback,
        }),
        item("DISABLE_SHAKE", "DisableShake", "DisableShake", {
          iconCallback: IconCallbacks.DisableShakeCallback,
        }),
        item("MOD_BETTER_RANGE", "BetterRangeMod", "BetterRange", {
          disabled: true,
        }),
        item("EXTENDED_TRAJECTORY", "ExtendedTrajectory", "ExtendedTrajectory", {
          disabled: false,
          isBSDPlusOnly: true,
          iconCallback: IconCallbacks.ExtendedTrajectoryCallback,
        }),
        item("HITBOX_RENDERER", "HitboxRenderer", "HitboxRenderer", {
          disabled: Process.platform === "darwin",
          isBSDPlusOnly: true,
          iconCallback: IconCallbacks.HitboxRendererCallback,
        }),
        item("ENEMY_TRACER", "EnemyTracer", "EnemyTracer", {
          disabled: Process.platform === "darwin",
          isBSDPlusOnly: true,
          iconCallback: IconCallbacks.EnemyTracerCallback,
        }),
        item("ATTACK_RANGE_INDICATOR", "AttackRangeIndicator", "AttackRangeIndicator", {
          disabled: false,
          isBSDPlusOnly: true,
          iconCallback: IconCallbacks.AttackRangeIndicatorCallback,
        }),
        item("HL_LEON_CLONE", "HighlightLeonClone", "HighlightLeonClone", {
          disabled: false,
          iconCallback: IconCallbacks.HighlightLeonCloneCallback,
        }),
        item("ENFORCE_BATTLE_CHAT_BUTTON", "EnforceBattleChatButton", "EnforceBattleChatButton", {
          disabled: false,
          iconCallback: IconCallbacks.EnforceBattleChatButtonCallback,
        }),
        item("SHOW_MUTE_BUTTON", "ShowMuteButton", "ShowMuteButton", {
          disabled: true,
        }),
        item("SHOW_DPS", "ShowDPS", "ShowDPS", {
          iconCallback: IconCallbacks.ShowDPSCallback,
        }),
        item("ALLY_RESPAWN_TIMER", "AllyRespawnTimer", "AllyRespawnTimer", {
          iconCallback: IconCallbacks.AllyRespawnTimerCallback,
        }),
        item("TEAMMATE_HP_INDICATOR", "TeammateHPIndicator", "TeammateHPIndicator", {
          disabled: Process.platform === "darwin",
          iconCallback: IconCallbacks.TeammateHPIndicatorCallback,
        }),
      ],

      ModConfigurationPopupSubheadingOptimization: [
        item("LOWRES_GRAPHICS", "LowResGraphics", "UseLowResGraphics", {
          showShowRestartRequiredDialog: true,
          iconCallback: IconCallbacks.LowResGraphicsCallback,
        }),
        item("DISABLE_SKINS", "DisableSkins", "DisableSkins", {
          iconCallback: IconCallbacks.DisableSkinsCallback,
        }),
        item("DEFAULT_ENVIRONMENTS", "DefaultEnvironments", "DefaultEnvironments", {
          shouldReloadGame: true,
          iconCallback: IconCallbacks.DefaultEnvironmentsCallback,
        }),
        item("FRIEND_LIST_OPTIMIZATION", "FriendListOptimization", "FriendListOptimization", {
          iconCallback: IconCallbacks.FriendListOptimizationCallback,
        }),
      ],

      ModConfigurationPopupSubheadingOther: [
        item("BSD_PROXY", "BSDProxy", "BSDProxy", {
          shouldReloadGame: true,
          iconCallback: IconCallbacks.BSDProxyCallback,
        }),
        item("TEAM_CHAT_ANTICENSOR", "TeamChatAnticensor", "TeamChatAnticensor", {
          disabled: true,
        }),
        item(
          "FRIENDLY_ROOM_OPPONENTS",
          "ShowOpponentsInFriendlyRoom",
          "ShowFriendlyRoomOpponents",
          {
            shouldReloadGame: true,
            iconCallback: IconCallbacks.ShowFriendlyRoomOpponentsCallback,
          },
        ),
        item(
          "HIDE_BATTLING_STATUS",
          "HideBattlingStatusFromOthers",
          "HideBattlingStatusFromOthers",
          { iconCallback: IconCallbacks.HideBattlingStatusFromOthersCallback },
        ),
        item("INSTANT_STARRDROP", "InstantStarrDropOpening", "InstantStarrDropOpening", {
          iconCallback: IconCallbacks.InstantStarrDropOpeningCallback,
        }),
        item("LEGACY_NAMES", "LegacyNames", "LegacyNames", {
          disabled: false,
          iconCallback: IconCallbacks.LegacyNamesCallback,
        }),
        item("RANDOM_LOCALIZATION", "RandomLocalization", "RandomLocalization", {
          shouldReloadGame: true,
          iconCallback: IconCallbacks.RandomLocalizationCallback,
        }),
        item("SLOW_MODE", "SlowMode", "SlowMode", {
          callback: (state) => GameMain.applySlowMode(state),
          iconCallback: IconCallbacks.SlowModeCallback,
        }),
        item("DEBUG_MENU_BUTTON", "DebugMenuButton", "ShowDebugMenuButton", {
          isBSDPlusOnly: true,
          callback: (state) => {
            if (state) {
              DebugMenuButton.spawn();
              DebugMenuButton.showFirstEnableWarning();
            } else {
              DebugMenuButton.destroy();
            }
          },
          iconCallback: IconCallbacks.ShowDebugMenuButtonCallback,
        }),
      ],

      ModConfigurationPopupSubheadingDebug: [
        item("SHOW_LASER_LOGS", "ShowLaserLogs", "ShowLaserLogs", {
          callback: (state) => {
            if (!state) {
              EDebugger.clear();
            }
          },
        }),
        item("DEV_MODE_TOGGLE", "DevModeToggle", "DevModeEnabled", {
          disabled: false,
          showShowRestartRequiredDialog: true,
        }),
      ],

      "": [],
    };

    ModConfigurationPopup.instance = this;
    ModConfigurationPopup.buttonInstances = [];

    LogicMemory.fillWithZeroes(this.instance.add(popupButtonsOffset), 101);
    this.instance.add(popupButtonCountOffset).writeInt(30);
    this.instance.writePointer(MapEditorModifierPopup.mapEditorModifierPopupVtableAddr);
    this.setTitleTid(Localisation.getString("ModConfigurationPopupTitle"));

    const closeButton = this.addGameButton("button_close", 1);
    this.instance.add(popupButtonsOffset).writePointer(closeButton.instance);
    closeButton.setCustomButtonListener(
      this.closeButtonPressed.bind(this),
      "mod_configuration_close_button",
    );

    const textField = this.getMovieClip().getTextFieldByName("txt");
    this.scrollArea = new ScrollArea(textField, 1);
    this.instance.add(popupScrollAreaOffset).writePointer(this.scrollArea.instance);
    this.scrollArea.instance.add(scrollAreaFlagOffset).writeU8(1);
    this.scrollArea.enablePinching(false);
    this.scrollArea.enableHorizontalDrag(false);
    this.scrollArea.enableVerticalDrag(true);
    this.scrollArea.setAlignment(4);
    this.createItems();
    this.addChild(this.scrollArea.instance);
  }

  addSubheading(text, margin = 0, fontSize = 30) {
    const heading = StringTable.getMovieClip("sc/ui.sc", "popover_text_left").getTextFieldByName(
      "text",
    );

    heading.color = 0xffffffff;
    heading.fontOutline = true;
    heading.fontSize = fontSize;
    heading.text = text;
    heading.align = 2;
    heading.setXY(
      this.scrollArea.instance.add(scrollAreaWidthOffset).readFloat() / 3,
      this.instance.add(popupContentHeightOffset).readFloat() + margin,
    );
    this.instance
      .add(popupContentHeightOffset)
      .writeFloat(
        heading.height + 15 + margin + this.instance.add(popupContentHeightOffset).readFloat(),
      );
    this.scrollArea.addContent(heading);
  }

  addItem(configuration) {
    if (configuration.disabled) {
      return;
    }

    const button = new ModConfigurationItem(configuration);
    button.setXY(
      (this.scrollArea.instance.add(scrollAreaWidthOffset).readFloat() - button.width) / 2,
      this.instance.add(popupContentHeightOffset).readFloat(),
    );
    this.instance
      .add(popupContentHeightOffset)
      .writeFloat(button.height + 10 + this.instance.add(popupContentHeightOffset).readFloat());
    ModConfigurationPopup.buttonInstances.push(button);
    this.scrollArea.addContent(button);
  }

  createItems() {
    for (const subheading of Object.keys(this.ITEMS)) {
      if (
        subheading === "ModConfigurationPopupSubheadingDebug" &&
        !Config.useDebugLoggingVersions.includes(ModProperties.environment) &&
        !Validation.developersList.includes(PlayerInfo.tag)
      ) {
        continue;
      }

      const margin = ModConfigurationPopup.HEADERS_MARGINS[subheading] ?? 0;
      this.addSubheading(Localisation.getString(subheading), margin);
      this.ITEMS[subheading].forEach((configuration) => {
        this.addItem(configuration);
      });
    }
  }

  closeButtonPressed(argument0, argument1) {
    super.closeButtonPressed(argument0, argument1);
    FileManager.updateConfigFile();

    const {
      shouldReloadGame,
      showShowRestartRequiredDialog,
      shouldReopenSettingsPopup,
      shouldGoToHomeScreen,
    } = ModConfigurationPopup;

    if (shouldReloadGame) {
      GameMain.reloadGame();
    } else if (showShowRestartRequiredDialog) {
      LogicNativeDialog.showRestartRequiredDialog();
    } else if (shouldReopenSettingsPopup || shouldGoToHomeScreen) {
      GUI.closeAllPopups();

      if (shouldReopenSettingsPopup) {
        SettingsPopup.show();
      }
    }

    ModConfigurationPopup.shouldReloadGame = false;
    ModConfigurationPopup.shouldGoToHomeScreen = false;
    ModConfigurationPopup.shouldReopenSettingsPopup = false;
    ModConfigurationPopup.showShowRestartRequiredDialog = false;

    ModConfigurationPopup.pendingCallbacks.forEach((pendingCallback) => {
      const configuration = pendingCallback.item;

      if (configuration.callback) {
        configuration.callback(!pendingCallback.state);
        ModConfigurationPopup.pendingCallbacks = ModConfigurationPopup.pendingCallbacks.filter(
          (entry) => entry.item.id !== configuration.id,
        );
      }
    });
  }

  getItemById(id) {
    return ModConfigurationPopup.buttonInstances.find((button) => button.configuration.id === id);
  }
}

ModConfigurationPopup.HEADERS_MARGINS = {
  ModConfigurationPopupSubheadingCustomization: 10,
  "": -30,
};
ModConfigurationPopup.buttonInstances = [];
ModConfigurationPopup.shouldReloadGame = false;
ModConfigurationPopup.shouldGoToHomeScreen = false;
ModConfigurationPopup.shouldReopenSettingsPopup = false;
ModConfigurationPopup.showShowRestartRequiredDialog = false;
ModConfigurationPopup.pendingCallbacks = [];

exports.ModConfigurationPopup = ModConfigurationPopup;
