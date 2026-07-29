// @ts-nocheck
const { Libg } = require("../../../lib/Libg");

const settingsInstance = Libg.offset(19824752, 18153640);
const getLastPlayedEventSlotNative = new NativeFunction(Libg.offset(5127352, 5286940), "int", [
  "pointer",
]);

class Settings {
  static getInstance() {
    return settingsInstance.readPointer();
  }

  static getLastPlayedEventSlot() {
    const instance = this.getInstance();
    return instance.isNull() ? 2 : getLastPlayedEventSlotNative(instance);
  }
}

exports.Settings = Settings;
