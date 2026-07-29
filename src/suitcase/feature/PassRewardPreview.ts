// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassRewardPreview = void 0;
const GUI_1 = require("../../laser/client/game/gui/GUI");
const DeliveryUnit_1 = require("../../laser/client/game/screen/home/gatcha/DeliveryUnit");
const LogicArrayList_1 = require("../../laser/client/logic/data/LogicArrayList");
const LogicGatchaDrop_1 = require("../../laser/client/logic/home/LogicGatchaDrop");
const BrawlPassAutoCollectRewardsPopup_1 = require("../../laser/client/game/gui/popup/BrawlPassAutoCollectRewardsPopup");
class PassRewardPreview {
  static showBrawlPass() {
    const popup = new BrawlPassAutoCollectRewardsPopup_1.BrawlPassAutoCollectRewardsPopup(0, 0, 0);
    popup.setData(this.buildDeliveryList());
    GUI_1.GUI.showPopup(popup.instance, true, false, false);
  }
  static buildDeliveryList() {
    const unit = new DeliveryUnit_1.DeliveryUnit(100);
    unit.addDrop(
      new LogicGatchaDrop_1.LogicGatchaDrop(LogicGatchaDrop_1.EGatchaDropTypes.GOLD, 1000),
    );
    const list = new LogicArrayList_1.LogicArrayList(1);
    list.addElement(unit.instance);
    return list;
  }
}
exports.PassRewardPreview = PassRewardPreview;
