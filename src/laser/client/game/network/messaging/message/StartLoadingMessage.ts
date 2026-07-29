// @ts-nocheck
const { PiranhaMessage } = require("../../../../../titan/client/common/messaging/PiranhaMessage");
const { Libg } = require("../../../../../../lib/Libg");
const { LogicPlayer } = require("../../../../logic/battle/LogicPlayer");
const { LogicArrayList } = require("../../../../logic/data/LogicArrayList");
const { HashTagCodeGenerator } = require("../../../utils/HashTagCodeGenerator");
const { BSDHttpClient } = require("../../../../../../suitcase/network/BSDHttpClient");
const {
  BSDMessageManager,
} = require("../../../../../../suitcase/network/messaging/BSDMessageManager");
const {
  GetBSDUsersByMask,
} = require("../../../../../../suitcase/network/messaging/message/GetBSDUsersByMask");
const { TSChaCha20 } = require("../../../../../../suitcase/crypto/TSChaCha20");
const { CustomTextEncoder } = require("../../../../../../suitcase/crypto/CustomTextEncoder");
const { CustomMarks } = require("../../../../../../suitcase/feature/CustomMarks");
const { LogicDataTables } = require("../../../../logic/data/LogicDataTables");
const { Logcat } = require("../../../../../../suitcase/debug/Logcat");
const { Utils } = require("../../../../../../tools/skinchanger-config/titan/utils/Utils");
const { Breadcrumbs } = require("../../../../../../suitcase/debug/Breadcrumbs");
const { BattleMode } = require("../../../state/battlemode/BattleMode");
const { BattleScreen } = require("../../../screen/battle/BattleScreen");
const { SkinSelector } = require("../../../../../../suitcase/feature/SkinSelector");
const { PlayerInfo } = require("../../../friends/PlayerInfo");
const { Config } = require("../../../../../../suitcase/config/Config");
const { LogicMemory } = require("../../../../../../suitcase/logic/LogicMemory");
const decodeAddress = Libg.offset(12475400, 11374868),
  decode = new NativeFunction(decodeAddress, "void", ["pointer", "pointer"]),
  VARIATION = LogicMemory.offset(248),
  PLAYERS = 256;
class StartLoadingMessage extends PiranhaMessage {
  get gameModeVariation() {
    return this.instance.add(VARIATION).readInt();
  }
  get gameModeVariationData() {
    return LogicDataTables.getDataById(
      LogicDataTables.table.GameModeVariations,
      this.gameModeVariation,
    );
  }
  get players() {
    const list = new LogicArrayList(this.instance.add(PLAYERS).readPointer()),
      length = list.getItemsCount();
    return new Proxy([], {
      get(_t, p) {
        if (p === "length") return length;
        if (typeof p === "symbol") return null;
        const i = +p;
        if (isNaN(i) || i < 0 || i >= length) return null;
        const value = list.getElement(i);
        return value.isNull() ? null : new LogicPlayer(value);
      },
      ownKeys() {
        return Array.from({ length }, (_, i) => i.toString());
      },
      getOwnPropertyDescriptor() {
        return { enumerable: true, configurable: true };
      },
    });
  }
  static patch() {
    BattleScreen.addEnterListener(() => {
      if (this.bsdResponseReady) this.applyPendingTitles();
    });
    Interceptor.replace(
      decodeAddress,
      new NativeCallback(
        (message, stream) => {
          decode(message, stream);
          Breadcrumbs.push("StartLoadingMessage::decode");
          this.bsdUsersTags = [];
          this.pendingTitleData = [];
          this.bsdResponseReady = false;
          this.bsdRequestSent = false;
          this.lastBSDResponse = null;
          const decoded = new StartLoadingMessage(message),
            players = decoded.players,
            tags = [],
            characters = {},
            cached = [];
          for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if (!player?.playerId) continue;
            if (SkinSelector.isInUse() && player.playerId.equals(PlayerInfo.accountId)) {
              const setup = player.getLogicHeroSetup(),
                character = setup.getLogicCharacterData(),
                name = character.getName();
              if (Config.config.SkinOverrides.hasOwnProperty(name)) {
                const skin = LogicDataTables.getSkinByName(Config.config.SkinOverrides[name]),
                  clone = setup.getSkin().clone();
                clone.setConf(skin.getConf());
                setup.setSkin(clone);
              }
            }
            const tag = HashTagCodeGenerator.convertLongToPlayerTag(player.playerId);
            if (!tag.length) continue;
            tags.push(`#${tag}`);
            characters[`#${tag}`] = player
              .getLogicHeroSetup()
              .getLogicCharacterData()
              .getGlobalID();
            const intro = player.getLogicPlayerBattleIntroDetails(),
              display = intro.displayData;
            cached.push({ tag, name: display.name, introPtr: intro.instance });
            if (CustomMarks.hasMark(tag))
              display.name = `${CustomMarks.getMarkDefinitionFor(tag)} ${display.name}`;
          }
          this.lastCachedPlayers = cached;
          const mode = decoded.gameModeVariationData?.getName();
          this.bsdRequestSent = true;
          BSDMessageManager.sendMessage(
            new GetBSDUsersByMask(characters, mode),
            () => {
              BSDHttpClient.startSleep();
              while (BSDHttpClient.shouldSleep) Utils.setGameThreadSleepTo(0.01);
            },
            true,
          ).then((response) => {
            this.lastBSDResponse = response;
            this.bsdResponseReady = true;
            if (BattleMode.client) this.applyPendingTitles();
          });
        },
        "void",
        ["pointer", "pointer"],
      ),
    );
  }
  static applyPendingTitles() {
    try {
      const battle = BattleMode.client;
      if (!battle) return;
      const count = battle.getPlayerCount();
      if (this.bsdResponseReady && this.lastBSDResponse) {
        const response = this.lastBSDResponse;
        if (response.statusCode === 200 && response.json) {
          const cipher = new TSChaCha20(TSChaCha20.key, TSChaCha20.nonce),
            decoded = JSON.parse(
              CustomTextEncoder.decode(
                cipher.decrypt(
                  new Uint8Array(BSDMessageManager.escapedStringToBytes(response.json.data)),
                ),
              ),
            );
          if (decoded.status === "ok" && decoded.bsd_users) {
            for (let i = 0; i < count; i++) {
              const player = battle.getPlayer(i);
              if (!player?.playerId) continue;
              const tag = HashTagCodeGenerator.convertLongToPlayerTag(player.playerId),
                user = decoded.bsd_users[`#${tag}`] || decoded.bsd_users[tag];
              if (!user) continue;
              const custom = CustomMarks.hasTitle(tag),
                title = custom ? CustomMarks.getTitleDefinitionFor(tag) : user?.title;
              if (title?.length) this.applyTitleToPlayer(battle, count, tag, title, custom);
              const intro = player.getLogicPlayerBattleIntroDetails(),
                original = intro.getPlayerName();
              let name = user.name ? (user.name.length === 0 ? original : user.name) : original;
              if (Config.config.PlayerNameOverride && player.playerId?.equals(PlayerInfo.accountId))
                name = Config.config.PlayerNameOverride;
              if (user.trophies !== undefined && user.trophies !== -1)
                this.playerTrophies.set(name, user.trophies);
              if (user.character !== undefined && user.character !== -1)
                this.playerCharacterTrophies.set(name, user.character);
              const mark = CustomMarks.hasMark(tag)
                ? CustomMarks.getMarkDefinitionFor(tag)
                : user?.plus !== -1
                  ? user?.plus === 1
                    ? "<cfde423>[<cfdd509>B<cfdbf01>S<cfea603>D<cfe9304>+<cfa7d00>]</c>"
                    : "[BSD]"
                  : null;
              if (mark && !name.includes(mark)) intro.setPlayerName(`${mark} ${name}`);
            }
          }
        }
      }
      this.lastBSDResponse = null;
      this.bsdResponseReady = false;
      for (let i = 0; i < count; i++) {
        const p = battle.getPlayer(i);
        if (!p?.playerId) continue;
        const tag = HashTagCodeGenerator.convertLongToPlayerTag(p.playerId);
        if (CustomMarks.hasTitle(tag)) {
          const title = CustomMarks.getTitleDefinitionFor(tag);
          if (title) this.applyTitleToPlayer(battle, count, tag, title, true);
        }
      }
    } catch (error) {
      Logcat.logError(`Error applying titles: ${error.stack}`);
    }
  }
  static applyTitleToPlayer(battle, count, tag, titleTid, custom) {
    for (let i = 0; i < count; i++) {
      const player = battle.getPlayer(i);
      if (!player?.playerId || HashTagCodeGenerator.convertLongToPlayerTag(player.playerId) !== tag)
        continue;
      const intro = player.getLogicPlayerBattleIntroDetails(),
        base = LogicDataTables.getDataById(76, 0),
        normal = LogicDataTables.getDataById(46, 2),
        special = LogicDataTables.getDataById(46, 31),
        title = base.clone();
      title.titleTid = titleTid;
      title.gradient = custom ? special : normal;
      intro.title = title;
      return;
    }
  }
}
StartLoadingMessage.bsdUsersTags = [];
StartLoadingMessage.playerTrophies = new Map();
StartLoadingMessage.playerCharacterTrophies = new Map();
StartLoadingMessage.pendingTitleData = [];
StartLoadingMessage.bsdResponseReady = false;
StartLoadingMessage.bsdRequestSent = false;
StartLoadingMessage.lastBSDResponse = null;
StartLoadingMessage.lastCachedPlayers = [];
exports.StartLoadingMessage = StartLoadingMessage;
