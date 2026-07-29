// @ts-nocheck
const { PiranhaMessage } = require("../../../../../titan/client/common/messaging/PiranhaMessage");
const { Libc } = require("../../../../../../lib/Libc");
const { Libg } = require("../../../../../../lib/Libg");
const { StringObject } = require("../../../../../titan/client/native/StringObject");
const ctor = new NativeFunction(Libg.offset(0, 0), "void", ["pointer"]);
class DebugBillingRequestMessage extends PiranhaMessage {
  constructor() {
    const p = Libc.malloc(DebugBillingRequestMessage.allocationSize);
    ctor(p);
    super(p);
  }
  set tid(v) {
    StringObject.create(v, this.instance.add(144));
  }
  set prodId(v) {
    StringObject.create(v, this.instance.add(160));
  }
  set currencyCode(v) {
    StringObject.create(v, this.instance.add(176));
  }
  set price(v) {
    StringObject.create(v, this.instance.add(192));
  }
  set receiptData(v) {
    const data = Libc.malloc(v.length),
      buffer = new ArrayBuffer(v.length);
    new Uint8Array(buffer).set(v);
    data.writeByteArray(buffer);
    this.instance.add(208).writePointer(data);
    this.instance.add(216).writeInt(v.length);
  }
}
DebugBillingRequestMessage.allocationSize = 224;
exports.DebugBillingRequestMessage = DebugBillingRequestMessage;
