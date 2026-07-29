// @ts-nocheck
const { Libg } = require("../../../../../../lib/Libg");
const { Libc } = require("../../../../../../lib/Libc");
const { LogicMemory } = require("../../../../../../suitcase/logic/LogicMemory");
const { PiranhaMessage } = require("../../../../../titan/client/common/messaging/PiranhaMessage");
const ctor = new NativeFunction(Libg.offset(12623112, 11478136), "void", ["pointer"]),
  offset = LogicMemory.offset(144);
class MapPreviewMessage extends PiranhaMessage {
  constructor(value) {
    if (value instanceof NativePointer) {
      super(value);
      return;
    }
    const p = Libc.calloc(MapPreviewMessage.allocationSize, 1);
    ctor(p);
    super(p);
  }
  setLocation(location) {
    this.instance.add(offset).writePointer(location.instance);
  }
}
MapPreviewMessage.allocationSize = 152;
exports.MapPreviewMessage = MapPreviewMessage;
