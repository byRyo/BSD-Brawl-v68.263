// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const instance = Libg.offset(19845968, 18155248),
  testContentUpdate = Libg.offset(19845960, 18155240);
const reset = new NativeFunction(Libg.offset(8493736, 8133380), "void", ["pointer"]);
class ServerConnection {
  static getInstance() {
    return instance.readPointer();
  }
  static setTestContentUpdate(enabled) {
    testContentUpdate.writeU8(enabled ? 1 : 0);
  }
  static isTestContentUpdateEnabled() {
    return testContentUpdate.readU8() === 1;
  }
  static debugResetCurrentAccountData() {
    const value = this.getInstance();
    if (!value.isNull()) reset(value);
  }
  static patch() {}
}
ServerConnection.stackedDelta = 0;
exports.ServerConnection = ServerConnection;
