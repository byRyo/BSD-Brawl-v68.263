// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugCallbacks = void 0;
const { StringTable } = require("../../../laser/client/game/text/StringTable");
const { HomeScreen } = require("../../../laser/client/game/screen/home/HomeScreen");
const { HomeMode } = require("../../../laser/client/game/state/homemode/HomeMode");
const { SoundManager } = require("../../../laser/titan/client/common/sound/SoundManager");
const { BattleScreen } = require("../../../laser/client/game/screen/battle/BattleScreen");
const { BattleMode } = require("../../../laser/client/game/state/battlemode/BattleMode");
const { DebugMenuButton } = require("../DebugMenuButton");
const { EDebugger } = require("../../debug/EDebugger");
const { LogicClientHome } = require("../../../laser/client/logic/home/LogicClientHome");
const { LogicMemory } = require("../../logic/LogicMemory");
const { Application } = require("../../../laser/titan/client/application/Application");
const { GUI } = require("../../../laser/client/game/gui/GUI");
const { LogicDataTables } = require("../../../laser/client/logic/data/LogicDataTables");
const { LogicCardData } = require("../../../laser/client/logic/data/LogicCardData");
const { LogicDailyData } = require("../../../laser/client/logic/data/LogicDailyData");
const { GameStateManager } = require("../../../laser/client/game/state/GameStateManager");
const { LogicAvatarHelper } = require("../../../laser/client/logic/avatar/LogicAvatarHelper");
const { LogicClientAvatar } = require("../../../laser/client/logic/avatar/LogicClientAvatar");
const { MessageManager } = require("../../../laser/client/game/network/MessageManager");
const { GameSCIDManager } = require("../../../laser/client/game/scid/GameSCIDManager");
const { StringObject } = require("../../../laser/titan/client/native/StringObject");
const { EnvOverride } = require("../../feature/EnvOverride");
const { GameMain } = require("../../../laser/client/GameMain");
const {
  LocalNotificationManager,
} = require("../../../laser/client/game/notification/LocalNotificationManager");
const { Character } = require("../../../laser/client/game/gameobject/Character");
const { MaintenancePopupPreview } = require("../../feature/MaintenancePopupPreview");
const { ServerConnection } = require("../../../laser/client/game/network/ServerConnection");
const { GameDownloadManager } = require("../../../laser/client/game/network/GameDownloadManager");
const { HomePage } = require("../../../laser/client/game/screen/home/homepage/HomePage");
const { MapEditorScreen } = require("../../../laser/client/game/screen/MapEditorScreen");
const { LatencyTestsPopup } = require("../../../laser/client/game/gui/popup/LatencyTestsPopup");
const { FPSCounter } = require("../../modconfiguration/FPSCounter");
const { CombatHUD } = require("../../../laser/client/game/gui/CombatHUD");
const { LogicBattleModeServer } = require("../../../laser/client/logic/mode/LogicBattleModeServer");
const { LogicBattleModeClient } = require("../../../laser/client/logic/mode/LogicBattleModeClient");
const {
  NotificationSettingsPopup,
} = require("../../../laser/client/game/gui/popup/NotificationSettingsPopup");
const {
  DeviceLinkWindow,
} = require("../../../laser/client/game/screen/home/settings/DeviceLinkWindow");
const {
  SettingsPrivacyScreen,
} = require("../../../laser/client/game/screen/home/settings/SettingsPrivacyScreen");
const hideProfileOffset = LogicMemory.offset(328, 328);
const mapValidationOffset = LogicMemory.offset(332, 332);
const mapPlacementOffset = LogicMemory.offset(336, 336);
class DebugCallbacks {
  static cycleLanguage() {
    const count = StringTable.getLanguageCount();
    if (count < 2) return "";
    if (this.languageCycleIndex < 0)
      this.languageCycleIndex = StringTable.getCurrentLanguageIndex();
    this.languageCycleIndex = (this.languageCycleIndex + 1) % count;
    StringTable.setLanguage(this.languageCycleIndex);
    return StringTable.getCurrentLanguageName?.() || "";
  }
  static rebuildHomeScreenText() {
    HomeScreen.getInstance?.()?.refresh?.();
  }
  static cycleLanguageWithFloater() {
    const value = this.cycleLanguage();
    this.rebuildHomeScreenText();
    return value;
  }
  static giveRandomReward() {
    return HomeScreen.doOfflineGatcha(HomeMode.gatchaType.Box);
  }
  static skipTutorial() {
    HomeMode.getPlayerAvatar?.()?.setTutorialStep?.(99);
  }
  static startTutorial() {
    HomeScreen.startTutorial?.();
  }
  static stopMusic() {
    SoundManager.stopMusic();
  }
  static stopAllSfx() {
    SoundManager.stopAllSfx?.();
  }
  static toggleHud() {
    CombatHUD.setVisible?.(!this.isHudShown());
  }
  static isHudShown() {
    return CombatHUD.isVisible?.() ?? true;
  }
  static toggleHeroHud() {
    BattleScreen.toggleHeroHud?.();
  }
  static isHeroHudShown() {
    return BattleScreen.isHeroHudShown?.() ?? true;
  }
  static toggleSkipGachaAnimation() {
    HomeScreen.skipGatchaAnimation = !HomeScreen.skipGatchaAnimation;
  }
  static scidLogOut() {
    GameSCIDManager.logOut?.();
  }
  static scidLogOutFromAllDevices() {
    GameSCIDManager.logOutFromAllDevices?.();
  }
  static scidReloadConfig() {
    GameSCIDManager.reloadConfig?.();
  }
  static scidDebugClearAllData() {
    GameSCIDManager.debugClearAllData?.();
  }
  static scidSwitchEnv() {
    GameSCIDManager.switchEnvironment?.();
  }
  static showAntiAddictionDialog() {
    Application.showAntiAddictionDialog?.();
  }
  static forceActiveNotifications() {
    LocalNotificationManager.forceActiveNotifications?.();
  }
  static forceAllNotifications() {
    LocalNotificationManager.forceAllNotifications?.();
  }
  static resetForcedNotifications() {
    LocalNotificationManager.resetForcedNotifications?.();
  }
  static openYoozooUpdateUrl() {
    Application.openURL("https://brawl.yoozoo.com/");
  }
  static openNotificationSettings() {
    GUI.showPopup(new NotificationSettingsPopup(), true, false, true);
  }
  static openDeviceLinkScreen() {
    GUI.showPopup(new DeviceLinkWindow(), true, false, true);
  }
  static toggleHideProfile() {
    Memory.patchCode(hideProfileOffset, 1, (code) => code.writeU8(code.readU8() ? 0 : 1));
  }
  static isHideProfileEnabled() {
    return hideProfileOffset.readU8() !== 0;
  }
  static showMaintenanceDefault() {
    MaintenancePopupPreview.show?.();
  }
  static showMaintenanceShort30s() {
    MaintenancePopupPreview.show?.(30);
  }
  static showMaintenance2Tab() {
    MaintenancePopupPreview.show?.(0, 2);
  }
  static showMaintenance3Tab() {
    MaintenancePopupPreview.show?.(0, 3);
  }
  static showMaintenanceNewsEsports() {
    MaintenancePopupPreview.show?.(0, 3, true);
  }
  static enableTestContentUpdate() {
    GameDownloadManager.enableTestContentUpdate?.();
  }
  static testDeferredDownload() {
    GameDownloadManager.testDeferredDownload?.();
  }
  static triggerAppReview() {
    Application.requestReview?.();
  }
  static openMapEditorPopup() {
    MapEditorScreen.openPopup?.();
  }
  static mapEditorToggleGrid() {
    MapEditorScreen.toggleGrid?.();
  }
  static mapEditorFillAll() {
    MapEditorScreen.fillAll?.();
  }
  static mapEditorEraseAll() {
    MapEditorScreen.eraseAll?.();
  }
  static mapEditorToggleSaveValidationBypass() {
    mapValidationOffset.writeU8(this.isMapEditorSaveValidationBypassed() ? 0 : 1);
  }
  static isMapEditorSaveValidationBypassed() {
    return mapValidationOffset.readU8() !== 0;
  }
  static mapEditorTogglePlacementBypass() {
    mapPlacementOffset.writeU8(this.isMapEditorPlacementBypassed() ? 0 : 1);
  }
  static isMapEditorPlacementBypassed() {
    return mapPlacementOffset.readU8() !== 0;
  }
  static mapEditorToggleFullPalette() {
    MapEditorScreen.fullPalette = !MapEditorScreen.fullPalette;
  }
  static isMapEditorFullPaletteUnlocked() {
    return Boolean(MapEditorScreen.fullPalette);
  }
  static mapEditorGoHome() {
    MapEditorScreen.goHome?.();
  }
  static latencyTestStart() {
    GUI.showPopup(new LatencyTestsPopup(), true, false, true);
  }
  static requestSeasonRewards() {
    MessageManager.requestSeasonRewards?.();
  }
  static startTutorialFromConversion() {
    HomeScreen.startTutorialFromConversion?.();
  }
  static toggleFollowSpectate() {
    LogicBattleModeClient.followSpectate = !LogicBattleModeClient.followSpectate;
  }
  static isFollowSpectate() {
    return Boolean(LogicBattleModeClient.followSpectate);
  }
  static toggleSlowMode() {
    LogicBattleModeServer.slowMode = !LogicBattleModeServer.slowMode;
  }
  static isSlowModeEnabled() {
    return Boolean(LogicBattleModeServer.slowMode);
  }
  static debugResetCurrentAccount() {
    HomeMode.getPlayerAvatar?.()?.debugReset?.();
  }
  static logOutAllDevices() {
    ServerConnection.logOutAllDevices?.();
  }
  static toggleFpsCounter() {
    FPSCounter.toggle?.();
  }
  static isFpsCounterShown() {
    return FPSCounter.isVisible?.() ?? false;
  }
  static toggleShowTidKeys() {
    StringTable.showTidKeys = !StringTable.showTidKeys;
  }
  static isShowTidKeys() {
    return Boolean(StringTable.showTidKeys);
  }
  static copyAccountId() {
    Application.copyString?.(GameStateManager.getPlayerAvatar?.()?.getAccountId?.().toString());
  }
  static softReloadGame() {
    GameMain.reload?.();
  }
  static toggleBossMusic() {
    SoundManager.bossMusic = !SoundManager.bossMusic;
  }
  static openClanPopup() {
    HomePage.openClanPopup?.();
  }
  static openTeamupPopup() {
    HomePage.openTeamupPopup?.();
  }
  static openDeleteAccount() {
    SettingsPrivacyScreen.openDeleteAccount?.();
  }
  static cycleMusicVolume() {
    SoundManager.setMusicVolume?.(((SoundManager.getMusicVolume?.() || 0) + 0.25) % 1.25);
  }
  static toggleMusicPaused() {
    SoundManager.setMusicPaused?.(!SoundManager.isMusicPaused?.());
  }
  static toggleChatBubbles() {
    CombatHUD.chatBubblesVisible = !CombatHUD.chatBubblesVisible;
  }
  static areChatBubblesVisible() {
    return CombatHUD.chatBubblesVisible !== false;
  }
  static debugForceEndGameWin() {
    BattleMode.debugForceEndGame?.(true);
  }
  static debugForceEndGameLoss() {
    BattleMode.debugForceEndGame?.(false);
  }
  static cycleBotDifficulty() {
    this.botDifficultyCycle = (this.botDifficultyCycle + 1) % 10;
    BattleMode.botDifficulty = this.botDifficultyCycle;
    return this.botDifficultyCycle;
  }
  static toggleScrollableDebugLog() {
    EDebugger.scrollable = !EDebugger.scrollable;
  }
  static clearKeyPool() {
    LogicDailyData.clearKeyPool?.();
  }
  static fillKeyPool() {
    LogicDailyData.fillKeyPool?.();
  }
  static writeKeyPool() {
    LogicDailyData.writeKeyPool?.();
  }
  static unlockAndMaxAllLvl9() {
    LogicAvatarHelper.unlockAndMaxAllLvl9?.();
  }
  static unlockOpenedGadgets() {
    this.unlockAllCardsOfMetaType(LogicCardData.metaType.Gadget);
  }
  static unlockOpenedStarPowers() {
    this.unlockAllCardsOfMetaType(LogicCardData.metaType.StarPower);
  }
  static revokeIapGemsToNegative() {
    GameStateManager.getPlayerAvatar?.()?.setDiamonds?.(-100);
  }
  static markAllAsNew() {
    LogicClientHome.getPlayerData?.()?.markAllAsNew?.();
  }
  static setAvatarPassive() {
    this.applyAvatarPassivePreview(false);
  }
  static setAvatarPassiveRecruit() {
    this.applyAvatarPassivePreview(true);
  }
  static unlockAllCardsOfMetaType(type) {
    GameStateManager.getPlayerAvatar?.()?.unlockAllCardsOfMetaType?.(type);
  }
  static applyAvatarPassivePreview(recruit) {
    LogicClientAvatar.applyPassivePreview?.("Gunslinger_unique", 29, recruit);
  }
}
exports.DebugCallbacks = DebugCallbacks;
DebugCallbacks.languageCycleIndex = -1;
DebugCallbacks.botDifficultyCycle = 0;
