// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { Libc } = require("../../../../lib/Libc");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");

const ctor = new NativeFunction(Libg.offset(10955908, 10162552), "pointer", ["pointer"]);
const vtable = Libg.offset(18877320, 16916416);
const itemOffset = LogicMemory.offset(32);
const allocationSize = 40;

class LogicItemSeenCommand {
  static create(item) {
    const instance = Libc.malloc(allocationSize);
    instance.writeByteArray(new ArrayBuffer(allocationSize));
    instance.writePointer(vtable);
    ctor(instance);
    instance.add(itemOffset).writePointer(item);
    return instance;
  }
}
exports.LogicItemSeenCommand = LogicItemSeenCommand;
