// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontSelectorPopup = void 0;
const { ListContainerPopup } = require("../flash/popup/ListContainerPopup");
const { Localisation } = require("../localisation/Localisation");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { FontItem } = require("../flash/popup/button/FontItem");
const { Config } = require("../config/Config");
const { GameMain } = require("../../laser/client/GameMain");
const { FontManager } = require("../../laser/titan/client/common/font/FontManager");
const { FileManager } = require("../filesystem/FileManager");

class FontSelectorPopup extends ListContainerPopup {
  constructor() {
    super({ Title: Localisation.getString("FontSelectorPopup") });
    this.adjustPopupHeaderButtons("font_selector_popup");
    this.refreshItems();
  }
  refreshItems() {
    this.container.clearEntries();
    let id = 0;
    for (const font of FontManager.BSD_FONTS) {
      const item = new FontItem(font);
      item.setCustomButtonListener(this.buttonClicked.bind(this), "font_".concat(id));
      item.id = id;
      this.container.addEntry(item);
      GameMain.loadAsset(font.fileName);
      id++;
    }
    const height = this.getNaviHeight();
    this.container.refreshEntryPositions(4, height, 8, false, false, false, -1);
    this.container.refreshBounds(height);
  }
  buttonClicked(_button, movieClip) {
    const id = new GameButton(movieClip).id;
    Config.config.Font = id === 0 ? -1 : id;
    Config.config.Font = id === 0 ? -1 : id;
    FileManager.updateConfigFile();
    GameMain.reloadGame();
  }
}
exports.FontSelectorPopup = FontSelectorPopup;
