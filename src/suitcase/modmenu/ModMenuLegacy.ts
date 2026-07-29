// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModMenuPopupLegacy = void 0;
const { ListContainerPopup } = require("../flash/popup/ListContainerPopup");
const { ModMenuItem } = require("../flash/popup/button/ModMenuItem");
const { Localisation } = require("../localisation/Localisation");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { GameMain } = require("../../laser/client/GameMain");
const { ThemeSelectorPopup } = require("./ThemeSelector");
const { StatusSelectorPopup } = require("./StatusSelector");
const { GatchaPopup } = require("./Gatcha");
const { StatsTrackersPopup } = require("./StatsTrackers");
const { OutlineColorPopup } = require("./OutlineColorPopup");
const { InputItemsPopup } = require("./InputItemsPopup");
const { BattleServersPopup } = require("./BattleServers");
const { BillingPackagesPopup } = require("./BillingPackages");
const { EnvironmentEditorPopup } = require("./EnvironmentEditor");
const { ParticleStylePopup } = require("./ParticleStyle");
const { IconSelectorPopup } = require("./IconSelector");
const {
  DebugBillingRequestMessage,
} = require("../../laser/client/game/network/messaging/message/DebugBillingRequestMessage");
const { MessageManager } = require("../../laser/client/game/network/MessageManager");
const { Latency } = require("../../laser/client/game/network/Latency");
const { EDebugger } = require("../debug/EDebugger");
const { NativeDialog } = require("../../laser/titan/client/native/NativeDialog");
class ModMenuPopupLegacy extends ListContainerPopup {
  constructor() {
    super({ Title: Localisation.getString("ModMenuTitle") });
    this.adjustPopupHeaderButtons("mod_menu");
    this.refreshItems();
  }
  refreshItems() {
    this.container.clearEntries();
    ModMenuPopupLegacy.ITEMS.forEach((entry, id) => {
      if (entry.disabled) return;
      const item = new ModMenuItem(entry);
      item.id = id;
      item.setCustomButtonListener(this.buttonPressed.bind(this));
      this.container.addEntry(item);
    });
    this.refresh();
  }
  buttonPressed(_button, clip) {
    const item = ModMenuPopupLegacy.ITEMS[new GameButton(clip).id];
    if (item?.callback) item.callback();
  }
  static popup(Popup) {
    GUI.showPopup(new Popup(), true, true, false);
  }
  static onReloadGamePressed() {
    GameMain.reloadGame();
  }
  static openThemesPopup() {
    this.popup(ThemeSelectorPopup);
  }
  static openStatusesPopup() {
    this.popup(StatusSelectorPopup);
  }
  static openIconChanger() {
    IconSelectorPopup.open();
  }
  static openGatchaPopup() {
    this.popup(GatchaPopup);
  }
  static openBattleServersPopup() {
    this.popup(BattleServersPopup);
  }
  static openOutlineColorPopup() {
    this.popup(OutlineColorPopup);
  }
  static openStatsTrackersPopup() {
    this.popup(StatsTrackersPopup);
  }
  static openInputItemsPopup() {
    this.popup(InputItemsPopup);
  }
  static openBillingPackagesPopup() {
    this.popup(BillingPackagesPopup);
  }
  static openEnvironmentPopup() {
    this.popup(EnvironmentEditorPopup);
  }
  static openParticleStylePopup() {
    this.popup(ParticleStylePopup);
  }
  static updateLatency() {
    Latency.test();
  }
  static showLatestUpdateChangelog() {
    GameMain.showLatestUpdateChangelog();
  }
  static showResetConfigPrompt() {
    GameMain.showResetConfigPrompt();
  }
  static hideOrShowDebugger() {
    EDebugger.toggle();
  }
  static clearDebugger() {
    EDebugger.clear();
  }
  static openFaqDialog() {
    NativeDialog.show("BSD", Localisation.getString("FaqText"), "OK", "", "");
  }
  static doDebugBilling(packageName) {
    MessageManager.sendMessage(new DebugBillingRequestMessage(packageName));
  }
  static doTestCase(testCase) {
    GameMain.doTestCase(testCase);
  }
  static doGatchaDrop(type) {
    GameMain.doOfflineGatcha(type);
  }
}
ModMenuPopupLegacy.ITEMS = [
  ["ReloadGame", "onReloadGamePressed"],
  ["SwitchTheme", "openThemesPopup"],
  ["StatusesPopupTitle", "openStatusesPopup"],
  ["IconChangerTitle", "openIconChanger"],
  ["GatchaPopupTitle", "openGatchaPopup"],
  ["BattleServersPopupTitle", "openBattleServersPopup"],
  ["OutlineColorPopupTitle", "openOutlineColorPopup"],
  ["StatsTrackersPopup", "openStatsTrackersPopup"],
  ["InputItemsPopup", "openInputItemsPopup"],
  ["Billing Packages", "openBillingPackagesPopup"],
  ["EnvironmentEditorPopup", "openEnvironmentPopup"],
  ["ParticleStylePopup", "openParticleStylePopup"],
].map(([name, fn]) => ({
  name,
  disabled: false,
  callback: ModMenuPopupLegacy[fn].bind(ModMenuPopupLegacy),
}));
exports.ModMenuPopupLegacy = ModMenuPopupLegacy;
