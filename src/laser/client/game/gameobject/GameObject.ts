// @ts-nocheck
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicGameObjectClient } = require("../../logic/battle/LogicGameObjectClient");

const logicOffset = LogicMemory.offset(16);

class GameObject {
  constructor(instance) {
    this.instance = instance;
  }
  get logic() {
    return new LogicGameObjectClient(this.logicPtr);
  }
  get logicPtr() {
    return this.instance.add(logicOffset).readPointer();
  }
}

exports.GameObject = GameObject;
