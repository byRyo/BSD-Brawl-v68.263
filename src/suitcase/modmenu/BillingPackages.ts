// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingPackagesPopup = void 0;
const { ListContainerPopup } = require("../flash/popup/ListContainerPopup");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { ModMenuPopupLegacy } = require("./ModMenuLegacy");
const { LogicDataTables } = require("../../laser/client/logic/data/LogicDataTables");
const { BillingPackageItem } = require("../flash/popup/button/BillingPackageItem");

class BillingPackagesPopup extends ListContainerPopup {
  constructor() {
    super({ Title: "Billing Packages" });
    this.adjustPopupHeaderButtons("billing_packages");
    this.refreshItems();
  }
  refreshItems() {
    this.container.clearEntries();
    const table = LogicDataTables.getTable(LogicDataTables.table.BillingPackages);
    for (let i = 0; i < table.getItemCount(); i++) {
      const item = new BillingPackageItem(table.getItemAt(i).getName());
      item.id = i;
      item.setCustomButtonListener(this.buttonPressed.bind(this));
      this.container.addEntry(item);
    }
    this.refresh();
  }
  buttonPressed(_button, movieClip) {
    const id = new GameButton(movieClip).id;
    if (id >= 0) {
      const table = LogicDataTables.getTable(LogicDataTables.table.BillingPackages);
      ModMenuPopupLegacy.doDebugBilling(table.getItemAt(id).getName());
    }
  }
}
exports.BillingPackagesPopup = BillingPackagesPopup;
