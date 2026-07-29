// @ts-nocheck
const { LogicCharacterData } = require("../data/LogicCharacterData");
const { LogicGameObjectClient } = require("./LogicGameObjectClient");
const { Libg } = require("../../../../lib/Libg");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");

const isAliveHero = new NativeFunction(Libg.offset(11727040, 10785224), "int", ["pointer"]);
const hitPointsOffset = LogicMemory.offset(172, 172);
const maxHitPointsOffset = LogicMemory.offset(176, 176);

class LogicCharacterClient extends LogicGameObjectClient {
  get data() {
    return new LogicCharacterData(this.dataPtr);
  }
  get hitPoints() {
    return this.instance.add(hitPointsOffset).readInt();
  }
  get maxHitPoints() {
    return this.instance.add(maxHitPointsOffset).readInt();
  }
  isAliveHero() {
    return !!(1 & ~isAliveHero(this.instance));
  }
  static isAliveHero(instance) {
    return !!(1 & ~isAliveHero(instance));
  }
}
exports.LogicCharacterClient = LogicCharacterClient;
