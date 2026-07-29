// @ts-nocheck
const { Libg } = require("../../lib/Libg");
const { EDebugger } = require("../../suitcase/debug/EDebugger");
const { FPSCounter } = require("../../suitcase/modconfiguration/FPSCounter");
const { NativeDialog } = require("../titan/client/native/NativeDialog");
const { Localisation } = require("../../suitcase/localisation/Localisation");
const { StringTable } = require("./game/text/StringTable");
const { BSDProxy } = require("../../suitcase/modconfiguration/BSDProxy");
const { BSDPlusManager } = require("../../suitcase/validation/BSDPlusManager");
const { ModProperties } = require("../../suitcase/config/ModProperties");
const { LogicMemory } = require("../../suitcase/logic/LogicMemory");
const { StringObject } = require("../titan/client/native/StringObject");
const { HomeScreen } = require("./game/screen/home/HomeScreen");
const { GUI } = require("./game/gui/GUI");
const { INativeDialogListener } = require("../titan/client/native/INativeDialogListener");
const { Application } = require("../titan/client/application/Application");
const { CombatHUD } = require("./game/gui/CombatHUD");
const { LogicLong } = require("./logic/LogicLong");
const { Utils } = require("../../tools/skinchanger-config/titan/utils/Utils");
const { BSDMessageManager } = require("../../suitcase/network/messaging/BSDMessageManager");
const {
  BSDKeepAliveMessage,
} = require("../../suitcase/network/messaging/message/BSDKeepAliveMessage");
const {
  GetBSDOnlineMessage,
} = require("../../suitcase/network/messaging/message/GetBSDOnlineMessage");
const { TSChaCha20 } = require("../../suitcase/crypto/TSChaCha20");
const { CustomTextEncoder } = require("../../suitcase/crypto/CustomTextEncoder");
const { Config } = require("../../suitcase/config/Config");
const { DebugMenuButton } = require("../../suitcase/modmenu/DebugMenuButton");
const { LoadingScreen } = require("./game/state/loading/LoadingScreen");
const { BattleDebugOverlay } = require("../../suitcase/feature/BattleDebugOverlay");
const { BattleNetStatsOverlay } = require("../../suitcase/feature/BattleNetStatsOverlay");
const { UiInspector } = require("../../suitcase/feature/UiInspector");
const { Watermark } = require("../../suitcase/feature/Watermark");
const { SmoothHud } = require("../../suitcase/feature/SmoothHud");

const platformCheck = new NativeFunction(Libg.offset(14483884, 9751028), "bool", []);
const destroyGame = new NativeFunction(Libg.offset(15488140, 0), "void", []);
const graphicsRegisterHook = Libg.offset(5054312, 5249396);
const getRandNative = new NativeFunction(Libg.offset(5062240, 5256364), "int", ["int"]);
const graphicsApplyHook = Libg.offset(5050100, 5245400);
const slowModeStorage = Libg.offset(19821688, 18153296);
const frameHook = Libg.offset(5035740, 5233508);
const loadAssetNative = new NativeFunction(Libg.offset(5058140, 5252972), "void", [
  "pointer",
  "int",
]);
const appReviewAddress = Libg.offset(5060344, 5254584);
const appReviewNative = new NativeFunction(appReviewAddress, "void", ["pointer"]);
const integerCheckAddress = Libg.offset(5048832, 5243940);
const graphicsQualityHook = Libg.offset(5060680, 5254940);
const setHibernateNative = new NativeFunction(Libg.offset(5055616, 115496), "void", [
  "pointer",
  "bool",
]);
const activationCaptionHook = Libg.offset(5057748, 5252580);
const showNativeDialogNative = new NativeFunction(Libg.offset(5050252, 5245536), "void", [
  "pointer",
  "int",
  "int",
  "pointer",
  "pointer",
  "pointer",
]);
const showMaintenanceDialogNative = new NativeFunction(Libg.offset(5062256, 5256380), "void", [
  "pointer",
  "int",
  "pointer",
  "int",
]);
const homeEnterHook = Libg.offset(5033968, 5232244);
const hibernateStateOffset = LogicMemory.offset(128);
const overlayContainerOffset = LogicMemory.offset(232);
const reloadRequestedOffset = LogicMemory.offset(257);
const accountIdOffset = LogicMemory.offset(448);
const graphicsQualityOffset = LogicMemory.offset(136);
const memoryQualityOffset = LogicMemory.offset(140);
const graphicsQualityStorage = Libg.offset(19866248, 18163913);
const gameMainInstance = Libg.offset(19821608, 18153216);
const slowModeHook = Libg.offset(5061292, 5255516);

class GameMain {
  static get hibernateState() {
    return Boolean(this.getInstance().add(hibernateStateOffset).readU8());
  }

  static getInstance() {
    return gameMainInstance.readPointer();
  }

  static getOverlayContainer() {
    const instance = this.getInstance();
    if (instance.isNull()) return NULL;
    return instance.add(overlayContainerOffset).readPointer();
  }

  static getAccountId() {
    return new LogicLong(this.getInstance().add(accountIdOffset).readPointer());
  }

  static loadAsset(assetName) {
    StringObject.with(assetName, (nativeName) => loadAssetNative(nativeName, 0));
  }

  static showNativeDialog(type, flags = 0, title = "", text = "", button = "") {
    StringObject.withMany([title, text, button], ([nativeTitle, nativeText, nativeButton]) => {
      showNativeDialogNative(
        this.getInstance(),
        type,
        flags,
        nativeTitle,
        nativeText,
        nativeButton,
      );
    });
  }

  static showMaintenanceDialog(type, text, flags) {
    StringObject.with(text, (nativeText) => {
      showMaintenanceDialogNative(this.getInstance(), type, nativeText, flags);
    });
  }

  static reloadGame() {
    this.getInstance().add(reloadRequestedOffset).writeU8(1);
  }

  static triggerAppReview() {
    GameMain.reviewForceOnce = true;
    appReviewNative(this.getInstance());
  }

  static applyGraphicsConfig() {
    const useLowResGraphics = Config.config.UseLowResGraphics;
    graphicsQualityStorage.writeU8(useLowResGraphics ? 1 : 0);

    const instance = this.getInstance();
    if (!instance.isNull()) {
      if (useLowResGraphics) {
        instance.add(graphicsQualityOffset).writeS32(0);
        instance.add(memoryQualityOffset).writeS32(0);
      } else {
        instance.add(graphicsQualityOffset).writeS32(Config.config.GfxQualityLevel);
        instance.add(memoryQualityOffset).writeS32(Config.config.MemQualityLevel);
      }
    }
  }

  static applySlowMode(enabled) {
    slowModeStorage.writeU8(enabled ? 1 : 0);
  }

  static isSlowMode() {
    return slowModeStorage.readU8() !== 0;
  }

  static toggleSlowMode() {
    Config.config.SlowMode = !this.isSlowMode();
    this.applySlowMode(Config.config.SlowMode);
    return Config.config.SlowMode;
  }

  static setHibernate(state) {
    setHibernateNative(this.getInstance(), +state);
  }

  static destroy(delay) {
    setTimeout(() => destroyGame(), delay);
  }

  static getRand(max) {
    return getRandNative(max);
  }

  static openModTelegram(_button, _listener) {
    Application.openUrl("https://t.me/bsdatamines");
  }

  static patch() {
    Interceptor.attach(homeEnterHook, {
      onEnter() {
        DebugMenuButton.destroy();
        HomeScreen.isEntered = false;
        GUI.removeAllPopups();
      },
    });

    Interceptor.attach(frameHook, {
      onEnter(args) {
        this.deltaTime = args[1].readFloat();
        GameMain.isJniReady ||= true;
        LoadingScreen.update();
      },
      onLeave() {
        EDebugger.update();
        if (CombatHUD.battleChat?.isCreated()) {
          CombatHUD.battleChat?.update();
        }
        FPSCounter.update();
        BattleDebugOverlay.update();
        BattleNetStatsOverlay.update();
        UiInspector.update();
        Watermark.update();
        SmoothHud.update();
        HomeScreen.update();
        GUI.update(this.deltaTime);
        BSDPlusManager.updateActivationTimer();

        if (
          HomeScreen.isEntered &&
          Utils.getCurrentTime() > GameMain.lastKeepAliveSentAt + GameMain.KEEP_ALIVE_INTERVAL_SEC
        ) {
          GameMain.lastKeepAliveSentAt = Utils.getCurrentTime();
          BSDMessageManager.sendMessage(new BSDKeepAliveMessage()).then((response) => {
            if (response.statusCode !== 200 || !response.json) return;
            const encrypted = response.json;
            const cipher = new TSChaCha20(TSChaCha20.key, TSChaCha20.nonce);
            const decoded = CustomTextEncoder.decode(
              cipher.decrypt(
                new Uint8Array(BSDMessageManager.escapedStringToBytes(encrypted.data)),
              ),
            );
            GetBSDOnlineMessage.lastOnline = JSON.parse(decoded).online;
          });
        }
      },
    });

    Interceptor.replace(
      showNativeDialogNative,
      new NativeCallback(
        (instance, type, title, text, button1, button2) => {
          EDebugger.addMessage(EDebugger.INFO, "NativeDialog Type = ".concat(type.toString()));
          if (type === 5) {
            NativeDialog.show(
              Localisation.getString("UpdateNativeDialogTitle"),
              Localisation.getString("UpdateNativeDialogDesc"),
              Localisation.getString("UpdateNativeDialogOurSocialButton"),
              "",
              "",
              GameMain.modUpdateNativeDialogListener.instance,
            );
          } else if (type === 31) {
            NativeDialog.show(
              StringTable.getString("TID_ERROR_POP_UP_LOGIN_BLOCKED_TITLE"),
              StringTable.getString("TID_LOGIN_RESTRICTED_BY_LOCATION"),
              "OK",
              "",
              Localisation.getString("EnableProxy"),
              BSDProxy.proxyNativeDialogListener.instance,
            );
          } else {
            showNativeDialogNative(instance, type, title, text, button1, button2);
          }
        },
        "void",
        ["pointer", "int", "int", "pointer", "pointer", "pointer"],
      ),
    );

    Interceptor.replace(integerCheckAddress, new NativeCallback(() => 0, "int", []));
    Interceptor.replace(
      platformCheck,
      new NativeCallback(() => (Process.platform === "darwin" ? 0 : 3), "bool", []),
    );
    Interceptor.replace(
      appReviewAddress,
      new NativeCallback(
        (instance) => {
          if (GameMain.reviewForceOnce) {
            GameMain.reviewForceOnce = false;
            appReviewNative(instance);
          }
        },
        "void",
        ["pointer"],
      ),
    );

    Interceptor.attach(activationCaptionHook, {
      onLeave() {
        if (
          ModProperties.environment === "plus" &&
          !BSDPlusManager.isBSDPlusEnabled &&
          !BSDPlusManager.activationCaption
        ) {
          BSDPlusManager.showActivationCaption();
        }
      },
    });
    Interceptor.attach(graphicsRegisterHook, function () {
      this.context.x21 = ptr(1);
    });
    Interceptor.attach(graphicsQualityHook, {
      onLeave(retval) {
        retval.replace(ptr(+Config.config.UseLowResGraphics));
      },
    });
    Interceptor.attach(graphicsApplyHook, {
      onLeave() {
        GameMain.applyGraphicsConfig();
      },
    });
    Interceptor.attach(slowModeHook, {
      onEnter() {
        if (Config.config.SlowMode) this.context.x0 = ptr(1);
      },
    });
  }
}

GameMain.KEEP_ALIVE_INTERVAL_SEC = ModProperties.environment === "dev" ? 10 : 60;
GameMain.lastKeepAliveSentAt = Utils.getCurrentTime();
GameMain.isJniReady = false;
GameMain.reviewForceOnce = false;
GameMain.modUpdateNativeDialogListener = new INativeDialogListener(GameMain.openModTelegram);

exports.GameMain = GameMain;
