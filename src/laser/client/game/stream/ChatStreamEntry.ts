// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { Config } = require("../../../../suitcase/config/Config");
const { StringObject } = require("../../../titan/client/native/StringObject");
const { CombatHUD } = require("../gui/CombatHUD");
const { LogicLong } = require("../../logic/LogicLong");
const { PlayerInfo } = require("../friends/PlayerInfo");
const { HashTagCodeGenerator } = require("../utils/HashTagCodeGenerator");
const { CustomMarks } = require("../../../../suitcase/feature/CustomMarks");

const decodeHook = Libg.offset(12411460, 11323492);
const accountIdOffset = LogicMemory.offset(16);
const nameOffset = LogicMemory.offset(24);
const messageOffset = LogicMemory.offset(48);

class ChatStreamEntry {
  static patch() {
    Interceptor.attach(decodeHook, {
      onEnter(args) {
        this.chatStreamEntry = args[0];
      },
      onLeave() {
        const accountId = new LogicLong(this.chatStreamEntry.add(accountIdOffset).readPointer());
        const namePointer = this.chatStreamEntry.add(nameOffset).readPointer();
        const name = StringObject.read(namePointer);
        const tag = HashTagCodeGenerator.convertLongToPlayerTag(accountId);
        if (CustomMarks.hasMark(tag)) {
          StringObject.create(
            "".concat(CustomMarks.getMarkDefinitionFor(tag), " ", name),
            namePointer,
          );
        }
        if (Config.config.BattleTextChat) {
          const isOwn = accountId.equals(PlayerInfo.accountId);
          const currentName = StringObject.read(namePointer);
          const message = StringObject.read(this.chatStreamEntry.add(messageOffset).readPointer());
          if (CombatHUD.battleChat?.isCreated()) {
            CombatHUD.battleChat.addMessage(currentName, message, isOwn);
          }
        }
      },
    });
  }
}

exports.ChatStreamEntry = ChatStreamEntry;
