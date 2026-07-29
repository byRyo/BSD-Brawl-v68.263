
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogInfo = LogInfo;

const NativeHTTPClientManager_1 = require("./src/laser/titan/client/common/http/NativeHTTPClientManager");
const FPSCounter_1 = require("./src/suitcase/modconfiguration/FPSCounter");
const GameMain_1 = require("./src/laser/client/GameMain");
const LogicConfData_1 = require("./src/laser/client/logic/data/LogicConfData");
const PlayerProfile_1 = require("./src/laser/client/game/friends/PlayerProfile");
const TeamManager_1 = require("./src/laser/client/game/screen/home/TeamManager");
const TeamPopup_1 = require("./src/laser/client/game/screen/home/TeamPopup");
const StringTable_1 = require("./src/laser/client/game/text/StringTable");
const LogicLocationData_1 = require("./src/laser/client/logic/data/LogicLocationData");
const LoginOkMessage_1 = require("./src/laser/client/game/network/messaging/message/LoginOkMessage");
const ClientInputManager_1 = require("./src/laser/client/game/state/battlemode/ClientInputManager");
const PlayerInfo_1 = require("./src/laser/client/game/friends/PlayerInfo");
const EDebugger_1 = require("./src/suitcase/debug/EDebugger");
const Breadcrumbs_1 = require("./src/suitcase/debug/Breadcrumbs");
const Logcat_1 = require("./src/suitcase/debug/Logcat");
const LoadingScreen_1 = require("./src/laser/client/game/state/loading/LoadingScreen");
const Localisation_1 = require("./src/suitcase/localisation/Localisation");
const CombatHUD_1 = require("./src/laser/client/game/gui/CombatHUD");
const HeroScreenPopup_1 = require("./src/laser/client/game/gui/popup/HeroScreenPopup");
const FamePopup_1 = require("./src/laser/client/game/gui/popup/FamePopup");
const BattleScreen_1 = require("./src/laser/client/game/screen/battle/BattleScreen");
const MapEditorScreen_1 = require("./src/laser/client/game/screen/MapEditorScreen");
const MessageManager_1 = require("./src/laser/client/game/network/MessageManager");
const SCIDConfig_1 = require("./src/laser/client/game/scid/SCIDConfig");
const LaserBoxManager_1 = require("./src/laser/client/game/network/LaserBoxManager");
const PopupBase_1 = require("./src/laser/titan/client/common/flash/PopupBase");
const LogicDailyData_1 = require("./src/laser/client/logic/data/LogicDailyData");
const SettingsScreen_1 = require("./src/laser/client/game/screen/home/settings/SettingsScreen");
const Config_1 = require("./src/suitcase/config/Config");
const LogicThemeData_1 = require("./src/laser/client/logic/data/LogicThemeData");
const InitState_1 = require("./src/laser/client/game/state/InitState");
const HomeScreen_1 = require("./src/laser/client/game/screen/home/HomeScreen");
const Debugger_1 = require("./src/laser/titan/client/application/Debugger");
const TeamEntry_1 = require("./src/laser/client/game/screen/home/TeamEntry");
const LogicSkillData_1 = require("./src/laser/client/logic/data/LogicSkillData");
const ServerHelloMessage_1 = require("./src/laser/client/game/network/messaging/message/ServerHelloMessage");
const Messaging_1 = require("./src/laser/client/game/network/Messaging");
const PlayerStatusMessage_1 = require("./src/laser/client/game/network/messaging/message/PlayerStatusMessage");
const TeamStream_1 = require("./src/laser/client/game/stream/TeamStream");
const PlayerDisplayData_1 = require("./src/laser/client/game/friends/PlayerDisplayData");
const TeamChatMessage_1 = require("./src/laser/client/game/network/messaging/message/TeamChatMessage");
const Character_1 = require("./src/laser/client/game/gameobject/Character");
const TeamMemberItem_1 = require("./src/laser/client/game/screen/home/TeamMemberItem");
const CameraParameters_1 = require("./src/laser/client/game/renderer3d/CameraParameters");
const CallListener_1 = require("./src/suitcase/debug/CallListener");
const EmoteIcon_1 = require("./src/laser/client/game/gui/EmoteIcon");
const ChatStreamEntry_1 = require("./src/laser/client/game/stream/ChatStreamEntry");
const LoginMessage_1 = require("./src/laser/client/game/network/messaging/message/LoginMessage");
const Wendelstein_1 = require("./src/laser/titan/client/src/wendelstein/Wendelstein");
const GameApp_1 = require("./src/laser/titan/client/application/GameApp");
const BattleEndReplayScreen_1 = require("./src/laser/client/game/gui/popup/BattleEndReplayScreen");
const DamageTracker_1 = require("./src/suitcase/feature/DamageTracker");
const LogicPlayer_1 = require("./src/laser/client/logic/battle/LogicPlayer");
const ReplayUuidLogger_1 = require("./src/suitcase/feature/ReplayUuidLogger");
const ReplayStringIdLogger_1 = require("./src/suitcase/feature/ReplayStringIdLogger");
const GUI_1 = require("./src/laser/client/game/gui/GUI");
const SkinHelper_1 = require("./src/laser/client/game/utils/SkinHelper");
const SkinSelectorPopup_1 = require("./src/laser/client/game/gui/popup/SkinSelectorPopup");
const HashTagCodeGenerator_1 = require("./src/laser/client/game/utils/HashTagCodeGenerator");
const LogicDebugButtonMessage_1 = require("./src/suitcase/modmenu/debugmenu/LogicDebugButtonMessage");
const TeamMemberEntry_1 = require("./src/laser/client/game/screen/battle/TeamMemberEntry");
const LatencyTestResultMessage_1 = require("./src/laser/client/game/network/messaging/message/LatencyTestResultMessage");
const AnalyticEvent_1 = require("./src/laser/titan/client/application/AnalyticEvent");
const SoundManager_1 = require("./src/laser/titan/client/common/sound/SoundManager");
const RewardOpeningPopup_1 = require("./src/laser/client/game/gui/popup/RewardOpeningPopup");
const LogicClientGlobals_1 = require("./src/laser/client/logic/data/LogicClientGlobals");
const LogicEffectData_1 = require("./src/laser/client/logic/data/LogicEffectData");
const LogicClientHome_1 = require("./src/laser/client/logic/home/LogicClientHome");
const FriendItem_1 = require("./src/laser/client/game/gui/FriendItem");
const AllianceEventStreamEntry_1 = require("./src/laser/client/game/stream/AllianceEventStreamEntry");
const Attestation_1 = require("./src/laser/titan/protection/Attestation");
const EccDigest_1 = require("./src/laser/titan/protection/EccDigest");
const LogicDataTableResource_1 = require("./src/laser/client/logic/data/LogicDataTableResource");
const LoginFailedMessage_1 = require("./src/laser/client/game/network/messaging/message/LoginFailedMessage");
const LogicLocationThemeData_1 = require("./src/laser/client/logic/data/LogicLocationThemeData");
const LogicSkinConfData_1 = require("./src/laser/client/logic/data/LogicSkinConfData");
const SnowFall_1 = require("./src/laser/client/game/screen/home/SnowFall");
const Shop_1 = require("./src/laser/client/game/screen/home/Shop");
const EventDetailsPopup_1 = require("./src/laser/client/game/gui/popup/EventDetailsPopup");
const BattleEndPopup_1 = require("./src/laser/client/game/gui/popup/BattleEndPopup");
const MapPreview_1 = require("./src/suitcase/feature/MapPreview");
const StartLoadingMessage_1 = require("./src/laser/client/game/network/messaging/message/StartLoadingMessage");
const DecoratedTextField_1 = require("./src/laser/titan/client/common/flash/DecoratedTextField");
const ServerConnection_1 = require("./src/laser/client/game/network/ServerConnection");
const TextField_1 = require("./src/laser/titan/client/common/flash/TextField");
const LogicCharacterData_1 = require("./src/laser/client/logic/data/LogicCharacterData");
const StreamItem_1 = require("./src/laser/client/game/stream/StreamItem");
const HomePage_1 = require("./src/laser/client/game/screen/home/homepage/HomePage");
const UdpConnectionInfoMessage_1 = require("./src/laser/client/game/network/messaging/message/UdpConnectionInfoMessage");
const LogicEmoteData_1 = require("./src/laser/client/logic/data/LogicEmoteData");
const IntegrityControl_1 = require("./src/suitcase/validation/IntegrityControl");
const GameSettings_1 = require("./src/laser/client/game/screen/home/settings/GameSettings");
const ExceptionWorker_1 = require("./src/suitcase/debug/ExceptionWorker");
const GLOverlay_1 = require("./src/suitcase/feature/GLOverlay");
const HitboxRenderer_1 = require("./src/suitcase/feature/HitboxRenderer");
const EnemyTracer_1 = require("./src/suitcase/feature/EnemyTracer");
const TileGridOverlay_1 = require("./src/suitcase/feature/TileGridOverlay");
const SmoothHudGraph_1 = require("./src/suitcase/feature/SmoothHudGraph");
const AttackRangeIndicator_1 = require("./src/suitcase/feature/AttackRangeIndicator");
const CommandLogger_1 = require("./src/suitcase/debug/CommandLogger");
const BSDPlusManager_1 = require("./src/suitcase/validation/BSDPlusManager");
const SentryFilter_1 = require("./src/suitcase/feature/SentryFilter");
const EnvOverride_1 = require("./src/suitcase/feature/EnvOverride");
const ProfileSkinNames_1 = require("./src/suitcase/feature/ProfileSkinNames");
const AllyRespawnTimer_1 = require("./src/suitcase/feature/AllyRespawnTimer");
const TeammateHpIndicator_1 = require("./src/suitcase/feature/TeammateHpIndicator");
const BattleIntro_1 = require("./src/laser/client/game/gui/BattleIntro");
const UiInspector_1 = require("./src/suitcase/feature/UiInspector");
const SharedReplay_1 = require("./src/suitcase/feature/SharedReplay");
const BattleLogShareButton_1 = require("./src/suitcase/feature/BattleLogShareButton");
const MoviePlayerPopup_1 = require("./src/laser/client/game/gui/popup/MoviePlayerPopup");
const LogicDataTables_1 = require("./src/laser/client/logic/data/LogicDataTables");

function ia() {
  na();
  Pa();
}

function na() {
  sa();
  Ma();
}

function ca() {
  setInterval(() => {
    FPSCounter_1.FPSCounter.bySecondTrigger = true;
  }, 1000);
  EnvOverride_1.EnvOverride.patch();
  SentryFilter_1.SentryFilter.patch();
  BSDPlusManager_1.BSDPlusManager.patch();
  AllyRespawnTimer_1.AllyRespawnTimer.patch();
  TeammateHpIndicator_1.TeammateHpIndicator.patch();
  ReplayUuidLogger_1.ReplayUuidLogger.patch();
  ReplayStringIdLogger_1.ReplayStringIdLogger.patch();
  SharedReplay_1.SharedReplay.patch();
  BattleLogShareButton_1.BattleLogShareButton.patch();
  GUI_1.GUI.patch();
  GameMain_1.GameMain.patch();
}

function sa() {
  oa();
  pa();
  ca();
  la();
  ga();
  ha();
  qa();
  Da();
  da();
  ya();
  fa();
}

function oa() {
  PlayerInfo_1.PlayerInfo.patch();
  ProfileSkinNames_1.ProfileSkinNames.patch();
  PlayerProfile_1.PlayerProfile.patch();
  PlayerDisplayData_1.PlayerDisplayData.patch();
  FriendItem_1.FriendItem.patch();
}

function la() {
  Character_1.Character.patch();
}

function ga() {
  MessageManager_1.MessageManager.patch();
  ServerConnection_1.ServerConnection.patch();
  SCIDConfig_1.SCIDConfig.patch();
  LaserBoxManager_1.LaserBoxManager.patch();
  ua();
}

function ua() {
  Messaging_1.Messaging.patch();
  LoginMessage_1.LoginMessage.patch();
  LoginOkMessage_1.LoginOkMessage.patch();
  ServerHelloMessage_1.ServerHelloMessage.patch();
  PlayerStatusMessage_1.PlayerStatusMessage.patch();
  TeamChatMessage_1.TeamChatMessage.patch();
  LatencyTestResultMessage_1.LatencyTestResultMessage.patch();
  LoginFailedMessage_1.LoginFailedMessage.patch();
  StartLoadingMessage_1.StartLoadingMessage.patch();
  UdpConnectionInfoMessage_1.UdpConnectionInfoMessage.patch();
}

function pa() {
  CombatHUD_1.CombatHUD.patch();
  EmoteIcon_1.EmoteIcon.patch();
  BattleIntro_1.BattleIntro.patch();
  UiInspector_1.UiInspector.patch();
  ma();
}

function ma() {
  PopupBase_1.PopupBase.patch();
  EventDetailsPopup_1.EventDetailsPopup.patch();
  HeroScreenPopup_1.HeroScreenPopup.patch();
  SkinSelectorPopup_1.SkinSelectorPopup.patch();
  RewardOpeningPopup_1.RewardOpeningPopup.patch();
  BattleEndPopup_1.BattleEndPopup.patch();
  MapPreview_1.MapPreview.patch();
  FamePopup_1.FamePopup.patch();
  MoviePlayerPopup_1.MoviePlayerPopup.patch();
}

function ha() {
  CameraParameters_1.CameraParameters.patch();
  GLOverlay_1.GLOverlay.patch();
  HitboxRenderer_1.HitboxRenderer.patch();
  EnemyTracer_1.EnemyTracer.patch();
  AttackRangeIndicator_1.AttackRangeIndicator.patch();
  TileGridOverlay_1.TileGridOverlay.patch();
  SmoothHudGraph_1.SmoothHudGraph.patch();
}

function qa() {
  Sa();
  La();
  MapEditorScreen_1.MapEditorScreen.patch();
}

function da() {
  AllianceEventStreamEntry_1.AllianceEventStreamEntry.patch();
  ChatStreamEntry_1.ChatStreamEntry.patch();
  TeamStream_1.TeamStream.patch();
  StreamItem_1.StreamItem.patch();
}

function fa() {
  SkinHelper_1.SkinHelper.patch();
  HashTagCodeGenerator_1.HashTagCodeGenerator.patch();
  if (Process.platform !== "darwin") {
    LogicDebugButtonMessage_1.LogicDebugButtonMessage.patch();
  }
}

function Sa() {
  TeamManager_1.TeamManager.patch();
  TeamPopup_1.TeamPopup.patch();
  SettingsScreen_1.SettingsScreen.patch();
  HomeScreen_1.HomeScreen.patch();
  Shop_1.Shop.patch();
  TeamEntry_1.TeamEntry.patch();
  TeamMemberItem_1.TeamMemberItem.patch();
  SnowFall_1.SnowFall.patch();
  HomePage_1.HomePage.patch();
  GameSettings_1.GameSettings.patch();
}

function La() {
  BattleScreen_1.BattleScreen.patch();
  ClientInputManager_1.ClientInputManager.patch();
  BattleEndReplayScreen_1.BattleEndReplayScreen.patch();
  TeamMemberEntry_1.TeamMemberEntry.patch();
  DamageTracker_1.DamageTracker.patch();
}

function Da() {
  InitState_1.InitState.patch();
}

function ya() {
  TextField_1.TextField.patch();
  DecoratedTextField_1.DecoratedTextField.patch();
  StringTable_1.StringTable.patch();
  EDebugger_1.EDebugger.configure(12, 20);
}

function Ma() {
  Ca();
  Ea();
}

function Ea() {
  LogicPlayer_1.LogicPlayer.patch();
}

function Ca() {
  LogicCharacterData_1.LogicCharacterData.patch();
  LogicClientGlobals_1.LogicClientGlobals.patch();
  LogicClientHome_1.LogicClientHome.patch();
  LogicConfData_1.LogicConfData.patch();
  LogicDailyData_1.LogicDailyData.patch();
  LogicDataTables_1.LogicDataTables.patch();
  LogicEffectData_1.LogicEffectData.patch();
  LogicEmoteData_1.LogicEmoteData.patch();
  LogicLocationData_1.LogicLocationData.patch();
  LogicLocationThemeData_1.LogicLocationThemeData.patch();
  LogicSkillData_1.LogicSkillData.patch();
  LogicSkinConfData_1.LogicSkinConfData.patch();
  LogicThemeData_1.LogicThemeData.patch();
}

function Pa() {
  Ta();
}

function Ta() {
  ba();
  ka();
}

function ba() {
  Ia();
  Debugger_1.Debugger.patch();
  AnalyticEvent_1.AnalyticEvent.patch();
  GameApp_1.Display.Mode.patch();
  GameApp_1.GameApp.patch();
  SoundManager_1.SoundManager.patch();
}

function Ia() {
  NativeHTTPClientManager_1.NativeHTTPClientManager.patch();
}

function ka() {
  Wendelstein_1.wendelstein.IEmitterComponent.patch();
}

function va() {
  IntegrityControl_1.IntegrityControl.test();
}

function LogInfo(...messages) {
  EDebugger_1.EDebugger.addMessage(EDebugger_1.EDebugger.INFO, ...messages);
}

async function Ra() {
  Logcat_1.Logcat.logInfo("--- NEW SESSION ---");
  try {
    new Logcat_1.Logcat();
    Config_1.Config.init();
    ExceptionWorker_1.ExceptionWorker.init();
    Attestation_1.Attestation.patch();
    EccDigest_1.EccDigest.patch();
    LoadingScreen_1.LoadingScreen.patch();
    Localisation_1.Localisation.init();
    LogicDataTableResource_1.LogicDataTableResource.patch();
    CallListener_1.CallListener.patch();
    if (Config_1.Config.useDebugLogging) {
      CommandLogger_1.CommandLogger.patch();
    }
    ia();
    va();
    Breadcrumbs_1.Breadcrumbs.initCrashDebug();
    Logcat_1.Logcat.logInfo("Successfully initialized");
  } catch (error) {
    Logcat_1.Logcat.logError("Error occurred while initializing");
    EDebugger_1.EDebugger.addMessage(
      EDebugger_1.EDebugger.ERROR,
      "Error occurred while initializing",
    );
    ExceptionWorker_1.ExceptionWorker.logException("INITERROR", error.stack);
    if (Config_1.Config.useDebugLogging) {
      Logcat_1.Logcat.logError(error.stack);
    }
  }
}

globalThis.LogInfo = LogInfo;

Ra().catch((error) => {
  Logcat_1.Logcat.logError("Init failed" + error.stack);
});
