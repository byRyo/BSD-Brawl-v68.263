// @ts-nocheck
const { GameButton } = require("../../../../laser/client/game/gui/GameButton");
const { countryPopupListItemVtableAddr } = require("../ListContainerPopup");
const { StringTable } = require("../../../../laser/client/game/text/StringTable");
const { FileManager } = require("../../../filesystem/FileManager");
const { DownloadedImage } = require("../../../../laser/titan/client/common/flash/DownloadedImage");
class IconItem extends GameButton {
  constructor(name) {
    super();
    this.instance.writePointer(countryPopupListItemVtableAddr);
    const movieClip = StringTable.getMovieClip("sc/ui.sc", "country_item");
    this.setMovieClip(movieClip, true);
    const directory = FileManager.rootDirPath + "/cache/ondemand/";
    if (!FileManager.isFilepath(directory)) FileManager.createDirectory(directory);
    const path = directory + name;
    if (!FileManager.isFilepath(path))
      FileManager.writeToFile(
        path,
        "wb",
        FileManager.readAAsset("bsd/internal/icon_changer_preview/" + name, "rb"),
      );
    const image = new DownloadedImage(name, movieClip);
    image.setSize(120, 120);
    this.addChild(image);
  }
}
module.exports = { IconItem };
