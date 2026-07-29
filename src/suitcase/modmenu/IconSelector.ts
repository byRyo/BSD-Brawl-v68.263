// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconSelectorPopup = void 0;
const { ListContainerPopup } = require("../flash/popup/ListContainerPopup");
const { FileManager } = require("../filesystem/FileManager");
const { Localisation } = require("../localisation/Localisation");
const { IconItem } = require("../flash/popup/button/IconItem");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { SafeJNI } = require("../../laser/titan/client/application/SafeJNI");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { EDebugger } = require("../debug/EDebugger");
const { FPSCounter } = require("../modconfiguration/FPSCounter");
const { AlternateIconManager } = require("./AlternateIconManager");
const { Libc } = require("../../lib/Libc");

class IconSelectorPopup extends ListContainerPopup {
  static open() {
    if (Process.platform === "darwin") {
      if (AlternateIconManager.isSupported()) {
        GUI.showPopup(new IconSelectorPopup(), true, true, false);
        return;
      }
      GUI.showFloaterTextAtDefaultPosition(
        Localisation.getString("IconChangerNotSupportediOSDevice"),
      );
      return;
    }
    const buffer = Libc.malloc(100);
    Libc.systemPropertyGet(Memory.allocUtf8String("ro.dalvik.vm.isa.arm"), buffer);
    let emulator = false;
    try {
      emulator = buffer.readUtf8String().includes("x86");
    } catch (_error) {}
    Libc.free(buffer);
    if (emulator)
      GUI.showFloaterTextAtDefaultPosition(Localisation.getString("EmulatorBannedFunction"));
    else GUI.showPopup(new IconSelectorPopup(), true, true, false);
  }
  constructor() {
    super({ Title: Localisation.getString("IconChangerTitle") });
    this.iconList = {};
    this.adjustPopupHeaderButtons("icon_changer_menu");
    const list = FileManager.readAAsset("bsd/internal/icon_changer_preview/list.json", "r");
    if (list) {
      this.iconList = JSON.parse(list);
      this.refreshItems();
    }
  }
  refreshItems() {
    this.container.clearEntries();
    const icons = Object.values(this.iconList);
    for (let i = 0; i < icons.length; i++) {
      const item = new IconItem(icons[i]);
      item.setCustomButtonListener(
        this.buttonPressed.bind(this),
        "".concat(i, "_icon_item_button"),
      );
      item.id = i;
      this.container.addEntry(item);
    }
    const height = this.getNaviHeight();
    this.container.refreshEntryPositions(4, height, 2, false, false, false, -1);
    this.container.refreshBounds(height);
  }
  buttonPressed(_button, movieClip) {
    const id = new GameButton(movieClip).id;
    const keys = Object.keys(this.iconList);
    const icon = keys[id];
    if (Process.platform === "darwin") {
      IconSelectorPopup.applyIconIOS(icon);
      return;
    }
    const clazz = SafeJNI.findClass("bsd/suitcase/addons/IconChanger");
    const method = SafeJNI.callStaticObjectMethodV(
      clazz,
      "changeIcon",
      "(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)V",
    );
    const packageName = SafeJNI.newStringUTF("com.supercell.brawlstars.".concat(icon));
    const aliases = SafeJNI.newStringUTF(keys.join(";").replace("GameApp;", ""));
    SafeJNI.callVoidMethod(clazz, method, aliases, packageName);
    GUI.showFloaterTextAtDefaultPosition(Localisation.getString("IconSetText"), 4290772736);
    FPSCounter.toggle(false);
    EDebugger.clear();
    EDebugger.destroy();
  }
  static applyIconIOS(icon) {
    const nativeIcon = icon === "CurrentUpdateIcon" ? null : icon;
    AlternateIconManager.setIcon(nativeIcon, (error) => {
      if (error) {
        GUI.showFloaterTextAtDefaultPosition(
          "".concat(Localisation.getString("IconChangerFailed"), ": ", error),
          4294918208,
        );
      } else {
        GUI.showFloaterTextAtDefaultPosition(Localisation.getString("IconSetText"), 4290772736);
        FPSCounter.toggle(false);
        EDebugger.clear();
        EDebugger.destroy();
      }
    });
  }
}
exports.IconSelectorPopup = IconSelectorPopup;
