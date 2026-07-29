// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const {
  ThemeSelectorManager,
  LegacyBackgroundManager,
  StrangerthingsFixer,
} = require("../../../../../suitcase/modmenu/ThemeSelector");
const { CustomBackground } = require("../../../../../suitcase/feature/CustomBackground");
const { Config } = require("../../../../../suitcase/config/Config");
const { FileManager } = require("../../../../../suitcase/filesystem/FileManager");
const { Player } = require("../../friends/Player");
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const { GameMain } = require("../../../GameMain");
const { Sprite } = require("../../../../titan/client/common/flash/Sprite");
const { StringTable } = require("../../text/StringTable");
const { SoundManager } = require("../../../../titan/client/common/sound/SoundManager");
const { HomePage } = require("./homepage/HomePage");
const { TeamStream, chatButtonOffset } = require("../../stream/TeamStream");
const { MovieClip } = require("../../../../titan/client/common/flash/MovieClip");
const { Validation } = require("../../../../../suitcase/validation/Validation");
const { GUI } = require("../../gui/GUI");
const { DeliveryUnit } = require("./gatcha/DeliveryUnit");
const { LogicGatchaDrop, EGatchaDropTypes } = require("../../../logic/home/LogicGatchaDrop");
const { LogicArrayList } = require("../../../logic/data/LogicArrayList");
const { RewardOpeningPopup } = require("../../gui/popup/RewardOpeningPopup");
const { LogicDataTables } = require("../../../logic/data/LogicDataTables");
const { LogicStarrDropRewards } = require("../../../logic/home/gatcha/LogicStarrDropRewards");
const { LogicRandom } = require("../../../../../suitcase/logic/LogicRandom");
const { ModProperties } = require("../../../../../suitcase/config/ModProperties");
const { Utils } = require("../../../../../tools/skinchanger-config/titan/utils/Utils");
const {
  BSDMessageManager,
} = require("../../../../../suitcase/network/messaging/BSDMessageManager");
const {
  BSDKeepAliveMessage,
} = require("../../../../../suitcase/network/messaging/message/BSDKeepAliveMessage");
const {
  GetBSDOnlineMessage,
} = require("../../../../../suitcase/network/messaging/message/GetBSDOnlineMessage");
const {
  GetBSDOwnHomeData,
} = require("../../../../../suitcase/network/messaging/message/GetBSDOwnHomeData");
const { LoginOkMessage } = require("../../network/messaging/message/LoginOkMessage");
const { EDebugger } = require("../../../../../suitcase/debug/EDebugger");
const { TSChaCha20 } = require("../../../../../suitcase/crypto/TSChaCha20");
const { CustomTextEncoder } = require("../../../../../suitcase/crypto/CustomTextEncoder");
const { BSDPlusManager } = require("../../../../../suitcase/validation/BSDPlusManager");
const { BattleServersManager } = require("../../../../../suitcase/modmenu/BattleServers");
const { SharedReplay } = require("../../../../../suitcase/feature/SharedReplay");
const { DownloadManager } = require("../../network/DownloadManager");
const { Breadcrumbs } = require("../../../../../suitcase/debug/Breadcrumbs");
const { DebugMenuButton } = require("../../../../../suitcase/modmenu/DebugMenuButton");
const { DecoyGuard } = require("../../../../../suitcase/validation/DecoyGuard");

const homeCtorAddress = Libg.offset(8885756, 8467124);
const refreshThemeNative = new NativeFunction(Libg.offset(8905908, 8475940), "void", ["pointer"]);
const relayoutBackgroundNative = new NativeFunction(Libg.offset(8916876, 8485668), "void", [
  "pointer",
]);
const doOfflineGatchaNative = new NativeFunction(Libg.offset(8942452, 8508060), "void", [
  "int",
  "pointer",
  "pointer",
]);
const joinClanByTagNative = new NativeFunction(Libg.offset(8905036, 8475220), "pointer", [
  "pointer",
  "pointer",
  "pointer",
]);
const gotoPageNative = new NativeFunction(Libg.offset(8903736, 8474088), "void", [
  "pointer",
  "int",
  "pointer",
]);
const homeRebuildAddress = Libg.offset(8914344, 8483248);
const nativeIntCallbackAddress = Libg.offset(8906640);
const skipGatchaAnimationAddress = Libg.offset(19847272, 18155720);
const spriteOffset = LogicMemory.offset(104);
const homePageOffset = LogicMemory.offset(2432);
const themeMovieClipOffset = LogicMemory.offset(2320);
const currentThemeOffset = LogicMemory.offset(2320);
const themeSlotOffset = LogicMemory.offset(2344);

const EHomeDeeplinkPage = {
  2: "News",
  News: 2,
  5: "Clan",
  Clan: 5,
  7: "Social",
  Social: 7,
  10: "BrawlPass",
  BrawlPass: 10,
  11: "Quests",
  Quests: 11,
  13: "Clubs",
  Clubs: 13,
  14: "SelectLocation",
  SelectLocation: 14,
  15: "ScidRewards",
  ScidRewards: 15,
  16: "CompetitivePass",
  CompetitivePass: 16,
  17: "Home",
  Home: 17,
};
const EThemeAvailability = {
  0: "DISABLE_UNTIL",
  DISABLE_UNTIL: 0,
  1: "DISABLE_FROM",
  DISABLE_FROM: 1,
  2: "IGNORE",
  IGNORE: 2,
  3: "DISABLE_ONLY",
  DISABLE_ONLY: 3,
};

function decryptResponse(response) {
  const cipher = new TSChaCha20(TSChaCha20.key, TSChaCha20.nonce);
  return JSON.parse(
    CustomTextEncoder.decode(
      cipher.decrypt(new Uint8Array(BSDMessageManager.escapedStringToBytes(response.json.data))),
    ),
  );
}

class HomeScreen {
  static getInstance() {
    return this.instance;
  }

  static getSprite() {
    return new Sprite(GameMain.getInstance().add(spriteOffset).readPointer());
  }

  static getHomePage() {
    return new HomePage(this.getInstance().add(homePageOffset).readPointer());
  }

  static refreshTheme() {
    refreshThemeNative(this.getInstance());
  }

  static joinClanByTag(high, low) {
    joinClanByTagNative(this.getInstance(), high, low);
  }

  static gotoPage(page) {
    const instance = this.getInstance();
    if (!instance.isNull()) gotoPageNative(instance, page, NULL);
  }

  static refreshHeroesAndItems() {}

  static createLobbyInfo() {}

  static doOfflineGatcha(mode, firstDrop, secondDrop) {
    doOfflineGatchaNative(
      mode,
      firstDrop ? firstDrop.instance : NULL,
      secondDrop ? secondDrop.instance : NULL,
    );
  }

  static isSkipGatchaAnimationEnabled() {
    return skipGatchaAnimationAddress.readU8() !== 0;
  }

  static setSkipGatchaAnimation(enabled) {
    skipGatchaAnimationAddress.writeU8(enabled ? 1 : 0);
  }

  static executeTestGatcha() {
    const delivery = new DeliveryUnit(100);
    [
      new LogicGatchaDrop(EGatchaDropTypes.GOLD, 102),
      new LogicGatchaDrop(EGatchaDropTypes.GOLD, 14),
      new LogicGatchaDrop(EGatchaDropTypes.CHARACTER, 1, 15),
      new LogicGatchaDrop(EGatchaDropTypes.GOLD, 57),
      new LogicGatchaDrop(EGatchaDropTypes.GOLD, 1000),
      new LogicGatchaDrop(EGatchaDropTypes.GOLD, 18),
      new LogicGatchaDrop(EGatchaDropTypes.VANITY_ITEM, 1, 1488, LogicDataTables.table.Emotes),
      new LogicGatchaDrop(EGatchaDropTypes.VANITY_ITEM, 1, 228, LogicDataTables.table.Sprays),
      new LogicGatchaDrop(EGatchaDropTypes.GOLD, 16),
      new LogicGatchaDrop(EGatchaDropTypes.SKIN, 1, 143),
      new LogicGatchaDrop(EGatchaDropTypes.BLING, 1000),
      new LogicGatchaDrop(EGatchaDropTypes.POWER_POINTS, 324),
      ...Array.from({ length: 6 }, () => new LogicGatchaDrop(1, 1, 15)),
    ]
      .slice(-8)
      .forEach((drop) => delivery.addDrop(drop));
    const list = new LogicArrayList();
    list.addElement(delivery.instance);
    const popup = new RewardOpeningPopup(29, list);
    GUI.showPopup(popup.instance, true, true, true);
  }

  static openRareStarrDrop() {
    const drop = LogicStarrDropRewards.getRandomDropByWeights("RARE");
    const delivery = new DeliveryUnit(100).addDrop(drop);
    const list = new LogicArrayList(1).addElement(delivery.instance);
    new RewardOpeningPopup(0, list);
  }

  static openSuperRareStarrDrop() {
    const table = LogicStarrDropRewards.table.SUPER_RARE;
    const drop = table[LogicRandom.getRandomInRangeExcept(0, table.length)].getGatchaDrop();
    const delivery = new DeliveryUnit(100).addDrop(drop);
    const list = new LogicArrayList(1).addElement(delivery.instance);
    const popup = new RewardOpeningPopup(1, list);
    GUI.showPopup(popup.instance, true, true, true);
  }

  static getThemeMovieClip() {
    const instance = this.getInstance();
    return new MovieClip(instance.add(themeMovieClipOffset).readPointer());
  }

  static relayoutBackground() {
    const instance = this.getInstance();
    if (!instance.isNull()) relayoutBackgroundNative(instance);
  }

  static updateTheme(theme, reload = true) {
    ThemeSelectorManager.isCustomBgInUse = false;
    CustomBackground.discard();
    const instance = this.getInstance();
    const sprite = this.getSprite();
    const fileName = theme.getFileName();
    const oldThemeSlot = instance.add(currentThemeOffset);
    instance.add(themeSlotOffset).writePointer(theme.instance);
    sprite.removeChild(oldThemeSlot.readPointer());
    GameMain.loadAsset(fileName);
    let movieClip = StringTable.getMovieClip(fileName, theme.getExportName());
    movieClip = StrangerthingsFixer.fix(movieClip);
    oldThemeSlot.writePointer(movieClip.instance);
    sprite.addChildAt(movieClip, 0);
    relayoutBackgroundNative(instance);
    const music = theme.getThemeMusic();
    if (music.instance.isNull()) SoundManager.stopMusic();
    else SoundManager.playMusic(music);
    if (reload) HomePage.reload();
  }

  static patch() {
    Interceptor.attach(homeCtorAddress, {
      onEnter(args) {
        HomeScreen.instance = args[0];
        Breadcrumbs.push("HomeScreen::ctor");
        StringTable.aprilFoolsMapping = {};
        StringTable.aprilFoolsCleaned = {};
        DecoyGuard.verify();
      },
      onLeave() {
        ThemeSelectorManager.isCustomBgInUse = false;
        CustomBackground.onHomeRebuilt();
        Player.ownIndex = -1;
        Player.playingWith.length = 0;
        HomeScreen.createLobbyInfo();
        if (Config.config.ShowDebugMenuButton && !BSDPlusManager.isBSDPlusEnabled) {
          Config.config.ShowDebugMenuButton = false;
          FileManager.updateConfigFile();
        }
        if (Config.config.ShowDebugMenuButton) DebugMenuButton.spawn();
        else DebugMenuButton.destroy();
        if (ModProperties.environment === "beta" && !Validation.isWhitelisted()) {
          GUI.showFloaterTextAtDefaultPosition("You are not whitelisted!");
          setTimeout(() => Validation.crashGame(), 1000);
        }
        BattleServersManager.loadFromConfig();
        HomeScreen.isEntered = true;
        SharedReplay.notifyHomeReady();
        BSDMessageManager.sendMessage(new BSDKeepAliveMessage()).then((response) => {
          if (response.statusCode !== 200 || !response.json) return;
          GetBSDOnlineMessage.lastOnline = decryptResponse(response).online;
        });
        GameMain.lastKeepAliveSentAt = Utils.getCurrentTime();
        if (LoginOkMessage.getSecondsSinceLoginOk() >= 5) {
          BSDMessageManager.sendMessage(new GetBSDOwnHomeData()).then((response) => {
            if (response.statusCode !== 200) {
              EDebugger.addMessage(EDebugger.ERROR, "Status Code is ".concat(response.statusCode));
              return;
            }
            const data = decryptResponse(response);
            if (BSDMessageManager.validateMessage(data) && data.expires_in) {
              if (data.telegramData) BSDPlusManager.telegramData = data.telegramData;
              BSDPlusManager.EXPIRES_TS = Math.floor(Date.now() / 1000) + data.expires_in;
              BSDPlusManager.isBSDPlusEnabled = data.expires_in > 0;
              GetBSDOnlineMessage.lastOnline = data.online ?? 0;
            }
          });
        }
      },
    });

    Interceptor.attach(homeRebuildAddress, {
      onLeave() {
        const themeMovieClip = HomeScreen.getThemeMovieClip();
        if (Config.config.LegacyBackgrounds) LegacyBackgroundManager.apply(themeMovieClip, true);
        CustomBackground.reapply();
      },
    });

    Interceptor.replace(nativeIntCallbackAddress, new NativeCallback(() => 0, "int", []));

    if (Process.platform !== "darwin") {
      Interceptor.attach(skipGatchaAnimationAddress, function () {
        if (!TeamStream.getInstance().isNull()) {
          new MovieClip(TeamStream.getInstance().add(chatButtonOffset).readPointer()).visibility =
            true;
        }
        return 0;
      });
    }
  }

  static update() {
    if (this.lobbyInfo) this.lobbyInfo.update();
  }
}

HomeScreen.isEntered = false;

exports.EHomeDeeplinkPage = EHomeDeeplinkPage;
exports.HomeScreen = HomeScreen;
