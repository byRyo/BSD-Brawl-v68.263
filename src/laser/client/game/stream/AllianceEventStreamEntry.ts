// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { StringObject } = require("../../../titan/client/native/StringObject");

const formatHook = Libg.offset(12409560, 11322008);
const eventTypeOffset = LogicMemory.offset(24);
const muterNameOffset = LogicMemory.offset(72);

class AllianceEventStreamEntry {
  static patch() {
    Interceptor.attach(formatHook, {
      onEnter(args) {
        this.self = args[0];
      },
      onLeave() {
        if (this.self.add(eventTypeOffset).readU32() === 114) {
          AllianceEventStreamEntry.textChatMuterName = " (".concat(
            StringObject.read(this.self.add(muterNameOffset).readPointer()),
            ")",
          );
        }
      },
    });
  }
}

exports.AllianceEventStreamEntry = AllianceEventStreamEntry;
