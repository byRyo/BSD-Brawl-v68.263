// @ts-nocheck
const { LogicArrayList } = require("../data/LogicArrayList");
const { LogicEmoteData } = require("../data/LogicEmoteData");

class LogicBattleEmotes {
  constructor(instance) {
    this.instance = instance;
  }
  getLogicBattleEmotesArrayList() {
    return this.instance.isNull() ? null : new LogicArrayList(this.instance);
  }
  getEmotes() {
    const list = this.getLogicBattleEmotesArrayList();
    if (!list) return null;
    const result = [];
    for (let i = 0; i < list.getItemsCount(); i++) {
      const item = list.getElement(i);
      if (!item.isNull()) result.push(new LogicEmoteData(item));
    }
    return result;
  }
}
exports.LogicBattleEmotes = LogicBattleEmotes;
