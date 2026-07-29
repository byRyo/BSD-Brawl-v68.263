// @ts-nocheck
const { ListContainerPopup } = require("../flash/popup/ListContainerPopup");
const { Localisation } = require("../localisation/Localisation");
const { LogicDataTables } = require("../../laser/client/logic/data/LogicDataTables");
const { Config } = require("../config/Config");
const { FileManager } = require("../filesystem/FileManager");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { LocationThemeItem } = require("../flash/popup/button/LocationThemeItem");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
class LocationThemeSelectorPopup extends ListContainerPopup {
  constructor(locationInfo) {
    super({ Title: Localisation.getString("LocationThemesPopupTitle") });
    this.adjustPopupHeaderButtons("location_themes_selector");
    this.locationInfo = locationInfo;
    this.refreshItems();
  }
  refreshItems() {
    this.container.clearEntries();
    this.locationThemesTable = LogicDataTables.getTable(LogicDataTables.table.LocationThemes);
    const location = this.locationInfo.locationData;
    const selected = location.locationTheme;
    for (const theme of LogicDataTables.getThemesAvailableForGameModeVariation(
      location.gameModeVariation,
    )) {
      if (theme.isDisabled()) continue;
      const item = new LocationThemeItem(theme, selected);
      item.id = theme.getInstanceID();
      item.setCustomButtonListener(this.buttonPressed.bind(this));
      this.container.addEntry(item);
    }
    const height = this.getNaviHeight();
    this.container.refreshEntryPositions(4, height, 8, 0, 0, 0, -1);
    this.container.refreshBounds(height);
  }
  buttonPressed(_, buttonPointer) {
    const button = new GameButton(buttonPointer);
    const locationName = this.locationInfo.locationData.getName();
    const theme = this.locationThemesTable.getItemAt(button.id);
    if (theme) {
      Config.config.LocationThemeOverrides[locationName] = theme.getName();
      FileManager.updateConfigFile();
      this.locationInfo.locationData.locationTheme = theme;
      GUI.closeAllPopups();
      this.fadeOut();
    }
  }
}
exports.LocationThemeSelectorPopup = LocationThemeSelectorPopup;
