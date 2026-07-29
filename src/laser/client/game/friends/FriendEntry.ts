// @ts-nocheck
const { LogicLong } = require("../../logic/LogicLong");

class FriendEntry {
  constructor(instance) {
    this.instance = instance;
  }
  get playerId() {
    return new LogicLong(this.instance.readPointer());
  }
}

exports.FriendEntry = FriendEntry;
