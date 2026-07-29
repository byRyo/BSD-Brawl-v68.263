// @ts-nocheck
class PiranhaMessage {
  constructor(instance) {
    this.instance = instance;
  }
  getMessageType() {
    return PiranhaMessage.getMessageType(this.instance);
  }
  static getMessageType(instance) {
    return new NativeFunction(
      instance
        .readPointer()
        .add(5 * Process.pointerSize)
        .readPointer(),
      "int",
      [],
    )();
  }
}
module.exports = { PiranhaMessage };
