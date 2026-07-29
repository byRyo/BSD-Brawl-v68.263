// @ts-nocheck
const { Libg } = require("../../../lib/Libg");
const { GenericPopup } = require("../../../laser/titan/client/common/flash/GenericPopup");
const { ListContainer } = require("../../../laser/titan/client/common/flash/ListContainer");
const { Stage } = require("../../../laser/titan/client/common/flash/Stage");
const { Libc } = require("../../../lib/Libc");
const { LogicMemory } = require("../../logic/LogicMemory");
const { PopupBase } = require("../../../laser/titan/client/common/flash/PopupBase");

const listContainerVtableAddr = Libg.offset(18688384, 16725368);
const countryPopupListItemVtableAddr = Libg.offset(18577064, 16613256);
const popupFlagOffset = LogicMemory.offset(304);

class ListContainerPopup extends GenericPopup {
  static allocationSize = 448;
  constructor(options = {}) {
    const {
      ExportName = "country_popup",
      Title = "POPUP NAME",
      PopupBackgroundFileName = "",
      PopupBackgroundExportName = "",
      CustomBaseAddress = null,
    } = options;
    super(ExportName, true, false, PopupBackgroundFileName, PopupBackgroundExportName, "");
    LogicMemory.fillWithZeroes(this.instance.add(PopupBase.fields.ListContainer), 32);
    this.instance.writePointer(CustomBaseAddress ?? listContainerVtableAddr);
    this.instance.add(PopupBase.fields.ButtonsCallback).writePointer(NULL);
    this.setUpScreenHeader();
    const movieClip = this.getMovieClip();
    movieClip.y = -0.5 * Stage.getMatrixY();
    const memory = Libc.malloc(8 * Process.pointerSize);
    LogicMemory.fillWithZeroes(memory, 8 * Process.pointerSize);
    this.container = new ListContainer(movieClip, 1, 3, 2, "", memory.add(8));
    Libc.free(memory);
    this.instance.add(PopupBase.fields.ListContainer).writePointer(this.container.instance);
    this.setTitleTid(Title);
    this.instance.add(popupFlagOffset).writeU8(0);
  }
  refresh() {
    const height = this.getNaviHeight();
    this.container.refreshEntryPositions(4, height, 8, 0, 0, 0, -1);
    this.container.refreshBounds(height);
  }
}
module.exports = { ListContainerPopup, countryPopupListItemVtableAddr };
