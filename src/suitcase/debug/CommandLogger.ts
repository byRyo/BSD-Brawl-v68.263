// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandLogger = void 0;

const { Libg } = require("../../lib/Libg");
const { Logcat } = require("./Logcat");
const { LogicCommand } = require("../modmenu/debugmenu/LogicCommand");
const { HomeMode_addCommandOffset } = require("../../laser/client/game/state/homemode/HomeMode");

const commandNames = {
  201: "ChangeAvatarName",
  202: "DiamondsAdded",
  203: "GiveDeliveryItems",
  204: "DayChanged",
  205: "Server",
  206: "AddNotification",
  207: "ChangeResources",
  208: "TransactionsRevoked",
  209: "KeyPoolChanged",
  211: "OffersChanged",
  212: "PlayerDataChanged",
  213: "InviteBlockingChanged",
  214: "GemNameChangeStateChanged",
  215: "SetSupportedCreator",
  216: "CooldownExpired",
  218: "BrawlPassSeasonChanged",
  219: "BrawlPassUnlocked",
  220: "HeroWinQuestsChanged",
  221: "TeamChatMuteStateChanged",
  222: "RankedSeasonChanged",
  223: "CooldownAdded",
  224: "SetESportsHubNotification",
  226: "LoginCalendarChanged",
  227: "BrawlerRecruitRoadChanged",
  228: "RandomRewardManagerChanged",
  229: "JoinAlliance",
  230: "ReputationChanged",
  231: "ReportState",
  232: "UpdateNotification",
  233: "TrophySeasonDataChanged",
  234: "TemporaryHeroTeardown",
  235: "ResetCollabPoints",
  236: "CompetitivePassSeasonChanged",
  237: "SetEsportsButtonState",
  238: "ResetStreakLost",
  239: "SetPlayerMute",
  240: "UpdateEventItems",
  503: "ClaimDailyReward",
  505: "SetPlayerThumbnail",
  506: "SelectSkin",
  508: "ChangeControlMode",
  509: "PurchaseDoubleCoins",
  511: "HelpOpened",
  512: "ToggleInGameHints",
  514: "DeleteNotification",
  515: "ClearShopTickers",
  517: "ClaimRankUpReward",
  519: "PurchaseOffer",
  520: "LevelUp",
  521: "PurchaseHeroLvlUpMaterial",
  522: "HeroSeen",
  525: "SelectCharacter",
  526: "UnlockFreeSkins",
  527: "SetPlayerNameColor",
  528: "ViewInboxNotification",
  529: "SelectStarPower",
  530: "SetPlayerAge",
  531: "CancelPurchaseOffer",
  532: "ItemSeen",
  533: "QuestsSeen",
  535: "ClaimTailReward",
  536: "PurchaseBrawlPassProgress",
  538: "SelectEmote",
  539: "BrawlPassAutoCollectWarningSeen",
  540: "PurchaseChallengeLives",
  541: "ClearESportsHubNotification",
  543: "SelectGearBoost",
  544: "SetLookingForTeamState",
  545: "NextRandomSkin",
  547: "RandomSkinMode",
  548: "SetSkinUISeen",
  549: "AllianceLeagueOnboardingSeen",
  550: "ClaimLoginCalendarReward",
  551: "ClaimWCPPDrop",
  552: "ChangeAvatarPrivacyPreferences",
  553: "UpdateAdvisedPrivacyPreferences",
  554: "RerollQuest",
  555: "SelectSpray",
  556: "SetLoginCalendarState",
  557: "PurchaseGadgetOrStarPower",
  558: "PurchaseGear",
  559: "RecruitRoadSelectBrawler",
  560: "PurchaseBrawler",
  561: "RecruitRoadSwitchBrawler",
  562: "RecruitRoadClaimBrawler",
  563: "RecruitRoadProcessExtraRecruitTokens",
  564: "RecruitRoadSelectNewBrawler",
  565: "RecruitRoadAbandonNewBrawler",
  566: "PurchaseFame",
  567: "SetInfoPopupSeenFlags",
  568: "SetBattleIntroData",
  570: "SelectFavouriteHero",
  571: "ClaimRandomReward",
  572: "VideoAdStart",
  573: "VideoAdFinish",
  574: "VideoAdTracking",
  575: "VideoAdNotFinished",
  576: "RankedSeasonSeen",
  577: "SetPlayerFrame",
  578: "ClaimFameReward",
  579: "UseSpecialEventTokens",
  580: "SetCoverOffer",
  581: "VideoAdAction",
  582: "ClaimCollabPoints",
  583: "SetDataSeenState",
  584: "CollabSideSeen",
  586: "ClaimContestRewards",
  587: "JoinClubEventSeen",
  588: "ContestClaimTickets",
  589: "JoinMoreActiveClubAction",
  590: "AlliancePiggyBankTicketsSeen",
  591: "ClaimCompetitivePassReward",
  592: "SetUnknownAge",
  593: "PurchaseCompetitivePassProgress",
  594: "ClaimCompetitivePassTail",
  595: "KeepDailyStreak",
  596: "ResetDailyStreak",
  597: "SelectAvatarPassive",
  598: "UnselectAvatarPassive",
  599: "SelectBonusSkill",
  961: "SetEventFeatureSeenState",
};

class CommandLogger {
  static getName(commandType) {
    return commandNames[commandType] ?? `Unknown_${commandType}`;
  }

  static patch() {
    Interceptor.attach(HomeMode_addCommandOffset, {
      onEnter(args) {
        const command = args[1];
        if (!command.isNull()) {
          try {
            const commandType = LogicCommand.getCommandType(command);
            const commandName = commandNames[commandType];
            if (commandName) {
              Logcat.logDebug(`[Command] ${commandType} ${commandName}`);
            } else {
              const vtableOffset = command.readPointer().sub(Libg.libgBeginOffset);
              Logcat.logDebug(
                `[Command] ${commandType} Unknown vtable=libg+0x${vtableOffset.toString(16)}`,
              );
            }
          } catch (error) {
            Logcat.logError(`[Command] read failed: ${error}`);
          }
        }
      },
    });
  }
}

exports.CommandLogger = CommandLogger;
