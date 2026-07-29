// @ts-nocheck
const { LogicMemory } = require("../../../../../../suitcase/logic/LogicMemory");
const { PiranhaMessage } = require("../../../../../titan/client/common/messaging/PiranhaMessage");
const { LogicArrayList } = require("../../../../logic/data/LogicArrayList");
const { PlayerEntry } = require("../../../screen/battle/PlayerEntry");

const O = [144, 152, 160, 164, 240, 264, 266, 280, 360, 384].map((v) => LogicMemory.offset(v));

class BattleEndMessage extends PiranhaMessage {
  get battleUUIdHigh() {
    return BigInt(this.instance.add(O[0]).readU64().toString());
  }
  get battleUUIdLow() {
    return BigInt(this.instance.add(O[1]).readU64().toString());
  }
  get battleUUId() {
    const s = ((this.battleUUIdHigh << 64n) | this.battleUUIdLow).toString(16).padStart(32, "0");
    return [s.slice(0, 8), s.slice(8, 12), s.slice(12, 16), s.slice(16, 20), s.slice(20)].join("-");
  }
  get type() {
    return this.instance.add(O[2]).readInt();
  }
  get result() {
    return this.instance.add(O[3]).readInt();
  }
  get gameModeVariation() {
    return this.instance.add(O[4]).readInt();
  }
  get winstreak() {
    return this.instance.add(O[5]).readInt();
  }
  get state264() {
    return !!this.instance.add(O[6]).readU8();
  }
  get trainingBattle() {
    return !!this.instance.add(O[7]).readU8();
  }
  get playersArray() {
    const p = this.instance.add(O[8]).readPointer();
    return p.isNull() ? null : new LogicArrayList(p);
  }
  getPlayer(index) {
    const list = this.playersArray;
    if (!list || index < 0 || index > list.getItemsCount()) return null;
    const p = list.getElement(index);
    return p.isNull() ? null : new PlayerEntry(p);
  }
}
BattleEndMessage.result = null;
exports.BattleEndMessage = BattleEndMessage;
