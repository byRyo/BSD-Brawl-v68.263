// @ts-nocheck
const { Libg } = require("../../../../../../lib/Libg");
const { StringObject } = require("../../../../../titan/client/native/StringObject");
const { Config } = require("../../../../../../suitcase/config/Config");
const { LogicMemory } = require("../../../../../../suitcase/logic/LogicMemory");
const address = Libg.offset(12393032, 11307952),
  offset = LogicMemory.offset(144);
class TeamChatMessage {
  static patch() {}
}
exports.TeamChatMessage = TeamChatMessage;
