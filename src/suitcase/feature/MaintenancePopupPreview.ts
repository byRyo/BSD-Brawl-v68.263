// @ts-nocheck
const { MaintenanceModeInfo } = require("../../laser/client/game/gui/info/MaintenanceModeInfo");
const { NewsPage } = require("../../laser/client/game/gui/page/NewsPage");
const { LaserBoxManager } = require("../../laser/client/game/network/LaserBoxManager");
const { GameMain } = require("../../laser/client/GameMain");
const { Sprite } = require("../../laser/titan/client/common/flash/Sprite");
const { TextField } = require("../../laser/titan/client/common/flash/TextField");
const { DisplayObject } = require("../../laser/titan/client/common/flash/DisplayObject");
const { LogicMemory } = require("../logic/LogicMemory");
const { Logcat } = require("../debug/Logcat");
const initSubStateOffset = LogicMemory.offset(72);
class MaintenancePopupPreview {
  static showDefault() {
    this.queueRealAndReload(4, 600);
  }
  static showShort30s() {
    this.queueRealAndReload(4, 30);
  }
  static showTwoTab() {
    this.queueRealAndReload(3, 600);
  }
  static showThreeTab() {
    this.queueRealAndReload(7, 600);
  }
  static showNewsEsports() {
    this.queueRealAndReload(6, 600);
  }
  static isLoginBlockActive() {
    return this.pendingReal !== null;
  }
  static onInitStateUpdate(state) {
    if (!this.pendingReal || state.isNull()) return;
    const subState = state.add(initSubStateOffset).readS32();
    if (subState !== this.lastLoggedSubState) {
      Logcat.logDebug(`[Maintenance] sub-state=${subState}`);
      this.lastLoggedSubState = subState;
    }
    if (subState >= 4) {
      if (!this.pendingReal.overlayShown) {
        const { mode, secondsUntilEnd } = this.pendingReal;
        this.pendingReal.overlayShown = true;
        try {
          this.showOverlay(mode, secondsUntilEnd);
        } catch (error) {
          Logcat.logDebug(`[Maintenance] overlay error: ${error}`);
        }
      } else this.tickCountdown();
    }
  }
  static tickCountdown() {
    const pending = this.pendingReal;
    if (!pending) return;
    const remaining = pending.expiresAt - Date.now();
    if (remaining <= 0) {
      Logcat.logDebug("[Maintenance] countdown expired, releasing login block");
      this.dismissOverlay(pending);
      this.pendingReal = null;
      this.lastLoggedSubState = -1;
      GameMain.reloadGame();
      return;
    }
    const text = this.formatRemainingTime(Math.ceil(remaining / 1000));
    if (text !== pending.lastTimerText) {
      pending.lastTimerText = text;
      if (pending.timerTextField && !pending.timerTextField.isNull())
        new TextField(pending.timerTextField).text = text;
    }
  }
  static queueRealAndReload(mode, secondsUntilEnd) {
    this.pendingReal = {
      mode,
      secondsUntilEnd,
      overlayShown: false,
      expiresAt: Date.now() + 1000 * secondsUntilEnd,
      timerTextField: null,
      lastTimerText: "",
      pageInstance: null,
    };
    GameMain.reloadGame();
  }
  static showOverlay(mode, seconds) {
    GameMain.loadAsset("sc/ui.sc");
    LaserBoxManager.updateManifest();
    const info = MaintenanceModeInfo.alloc(mode, seconds, false, "");
    LaserBoxManager.forceTabsAvailable = true;
    const page = NewsPage.create(info, "", 4);
    LaserBoxManager.forceTabsAvailable = false;
    const overlay = GameMain.getOverlayContainer();
    Sprite.addChild(overlay, page.instance);
    page.forceOpenLandingPage();
    const retry = page.getRetryButton();
    if (!retry.isNull()) new DisplayObject(retry).visibility = 0;
    const timer = page.getTimerTextField();
    if (!timer.isNull()) {
      const text = this.formatRemainingTime(seconds);
      new TextField(timer).text = text;
      if (this.pendingReal) {
        this.pendingReal.timerTextField = timer;
        this.pendingReal.lastTimerText = text;
      }
    }
    if (this.pendingReal) this.pendingReal.pageInstance = page.instance;
    LaserBoxManager.showWebview();
  }
  static dismissOverlay(pending) {
    if (pending.pageInstance && !pending.pageInstance.isNull()) {
      const overlay = GameMain.getOverlayContainer();
      if (!overlay.isNull()) new Sprite(overlay).removeChild(pending.pageInstance);
    }
    LaserBoxManager.hideWebview();
  }
  static formatRemainingTime(seconds) {
    const totalMinutes = Math.floor(seconds / 60),
      sec = seconds % 60,
      hours = Math.floor(totalMinutes / 60),
      min = totalMinutes % 60,
      pad = (value) => value.toString().padStart(2, "0");
    return hours > 0 ? `${hours}:${pad(min)}:${pad(sec)}` : `${min}:${pad(sec)}`;
  }
}
MaintenancePopupPreview.pendingReal = null;
MaintenancePopupPreview.lastLoggedSubState = -1;
exports.MaintenancePopupPreview = MaintenancePopupPreview;
