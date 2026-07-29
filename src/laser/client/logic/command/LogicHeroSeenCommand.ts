// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { Libc } = require("../../../../lib/Libc");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");

const ctor = new NativeFunction(Libg.offset(10954452, 10161064), "pointer", ["pointer"]);
const vtable = Libg.offset(18877096, 16916192);
const characterOffset = LogicMemory.offset(32);
const seenStateOffset = LogicMemory.offset(40);
const allocationSize = 48;

class LogicHeroSeenCommand {
  static create(character, state) {
    const instance = Libc.malloc(allocationSize);
    instance.writeByteArray(new ArrayBuffer(allocationSize));
    instance.writePointer(vtable);
    ctor(instance);
    instance.add(characterOffset).writePointer(character);
    instance.add(seenStateOffset).writeInt(state);
    return instance;
  }
}
LogicHeroSeenCommand.SeenState = { Default: 1, FullyViewed: 2, Partial: 3 };
exports.LogicHeroSeenCommand = LogicHeroSeenCommand;
