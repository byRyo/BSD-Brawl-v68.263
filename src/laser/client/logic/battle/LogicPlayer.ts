// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { Config } = require("../../../../suitcase/config/Config");
const { StringTable } = require("../../game/text/StringTable");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicHeroSetup } = require("./LogicHeroSetup");
const { LogicPlayerBattleIntroDetails } = require("./LogicPlayerBattleIntroDetails");
const { SkinSelector } = require("../../../../suitcase/feature/SkinSelector");
const { PlayerInfo } = require("../../game/friends/PlayerInfo");
const { LogicLong } = require("../LogicLong");
const { Player } = require("../../game/friends/Player");
const { LogicDataTables } = require("../data/LogicDataTables");
const { FriendListMessage } = require("../../game/network/messaging/message/FriendListMessage");
const { MyAllianceMessage } = require("../../game/network/messaging/message/MyAllianceMessage");

const decodeNative = new NativeFunction(Libg.offset(12844768, 11634544), "void", [
  "pointer",
  "pointer",
]);
const decodeAddress = Libg.offset(12844768, 11634544);
const playersCountOffset = LogicMemory.offset(8);
const heroSetupOffset = LogicMemory.offset(48);
const playerIndexOffset = LogicMemory.offset(60);
const logicPlayerBattleIntroDetails = LogicMemory.offset(560);

class LogicPlayer {
  constructor(instance) {
    this.instance = instance;
  }
  decode(stream) {
    LogicPlayer.decode(this.instance, stream);
  }
  getPlayersCount() {
    return this.instance.add(playersCountOffset).readU32();
  }
  getLogicPlayerBattleIntroDetails() {
    return new LogicPlayerBattleIntroDetails(
      this.instance.add(logicPlayerBattleIntroDetails).readPointer(),
    );
  }
  getLogicHeroSetup() {
    return new LogicHeroSetup(this.instance.add(heroSetupOffset).readPointer());
  }
  get playerId() {
    return this.instance.isNull() ? null : new LogicLong(this.instance);
  }
  getPlayerIndex() {
    return this.instance.add(playerIndexOffset).readU32();
  }
  static decode(instance, stream) {
    decodeNative(instance, stream);
  }
  static patch() {
    Interceptor.replace(
      decodeAddress,
      new NativeCallback(
        (instance, stream) => {
          const player = new LogicPlayer(instance);
          decodeNative(instance, stream);
          const intro = player.getLogicPlayerBattleIntroDetails();
          const emotes = player.getLogicHeroSetup().getLogicBattleEmotes();
          let playerName = intro.getPlayerName();
          if (Config.config.PlayerNameOverride && player.playerId?.equals(PlayerInfo.accountId)) {
            playerName = Config.config.PlayerNameOverride;
          }

          let badges = "";
          if (emotes) {
            if (Config.config.ShamePlayersWithThumbsdownPin) {
              const values = emotes.getEmotes();
              if (
                values &&
                values.some((emote) => LogicPlayer.negativeEmotes.includes(emote.getName()))
              )
                badges += "🤡";
            }
            if (player.playerId?.equals(PlayerInfo.accountId)) {
              const values = emotes.getEmotes();
              if (values && values.find(LogicPlayer.FIND_EMOTE_FUNC)) {
                PlayerInfo.ownThumbdownEmoteIndex =
                  values.findIndex(LogicPlayer.FIND_EMOTE_FUNC) + 1;
              }
            }
          }
          if (player.playerId) {
            const id = player.playerId.toString();
            if (Config.config.ShowFriendsInBattle && FriendListMessage.friendsIds.has(id))
              badges += "👥";
            if (Config.config.ShowAllianceMembersInBattle && MyAllianceMessage.membersIds.has(id))
              badges += "🛡️";
          }

          let characterLabel = "";
          if (Config.config.ShowCharactersInNames) {
            const character = player.getLogicHeroSetup().getLogicCharacterData();
            characterLabel = "(".concat(StringTable.getString(character.getTID()), ")");
          }
          intro.setPlayerName(
            [
              badges.length !== 0 ? "[".concat(badges, "]") : "",
              playerName,
              characterLabel.length !== 0 ? characterLabel : "",
            ]
              .filter(Boolean)
              .join(" "),
          );

          if (player.playerId && PlayerInfo.accountId.equals(player.playerId)) {
            Player.ownIndex = player.getPlayerIndex();
            const setup = player.getLogicHeroSetup();
            const character = setup.getLogicCharacterData();
            if (!SkinSelector.isInUse()) return;
            const characterName = character.getName();
            const currentSkin = setup.getSkin();
            if (Config.config.SkinOverrides.hasOwnProperty(characterName)) {
              const skinName = Config.config.SkinOverrides[characterName];
              const skin = LogicDataTables.getTableItemByName(
                LogicDataTables.table.Skins,
                skinName,
              );
              if (!skin) return;
              setup.setSkin(skin);
              if (!SkinSelector.skinDataMap[characterName]) return;
              Player.playingWith.push({
                character: characterName,
                skin: currentSkin.instance.isNull()
                  ? character.getDefaultSkin().getName()
                  : currentSkin.getName(),
              });
            }
          }
        },
        "void",
        ["pointer", "pointer"],
      ),
    );
  }
}
LogicPlayer.THUMBDOWN_EMOTE = "emoji_thumbsdown";
LogicPlayer.FIND_EMOTE_FUNC = (emote) => emote.getName() === LogicPlayer.THUMBDOWN_EMOTE;
LogicPlayer.negativeEmotes = [
  "emoji_thumbsdown",
  "emoji_champie_thumbsdown",
  "emoji_clown",
  "emoji_stop",
];
exports.logicPlayerBattleIntroDetails = logicPlayerBattleIntroDetails;
exports.LogicPlayer = LogicPlayer;
