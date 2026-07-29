// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { FileManager } = require("../../../../suitcase/filesystem/FileManager");
const { Config } = require("../../../../suitcase/config/Config");
const { ThemeSelectorManager } = require("../../../../suitcase/modmenu/ThemeSelector");
const { EventSlot } = require("./EventSlot");

const LogicConfData_getIntValue = new NativeFunction(Libg.offset(12527168, 11414856), "int", [
  "pointer",
  "int",
  "int",
]);
const eventSlotsOffset = LogicMemory.offset(16);
const eventSlotCountOffset = LogicMemory.offset(28);

class LogicConfData {
  static getIntValue(instance, valueId, defaultValue) {
    return LogicConfData_getIntValue(instance, valueId, defaultValue);
  }

  static getActiveEventForSlot(instance, slotIndex) {
    if (instance.isNull()) return null;
    for (const slot of this.iterateEventSlotPointers(instance)) {
      if (slot.slotIndex === slotIndex) return slot;
    }
    return null;
  }

  static getEventSlots(instance) {
    return Array.from(this.iterateEventSlotPointers(instance));
  }

  static *iterateEventSlotPointers(instance) {
    if (instance.isNull()) return;
    const slots = instance.add(eventSlotsOffset).readPointer();
    const count = instance.add(eventSlotCountOffset).readInt();
    for (let index = 0; index < count; index++) {
      const slot = slots.add(index * Process.pointerSize).readPointer();
      if (!slot.isNull()) yield new EventSlot(slot);
    }
  }

  static patch() {
    Interceptor.attach(LogicConfData_getIntValue, {
      onEnter(args) {
        this.valueId = args[1].toInt32();
      },
      onLeave(retval) {
        switch (this.valueId) {
          case 1:
            if (!FileManager.isFilepath(FileManager.modSaveFilePath)) {
              FileManager.updateConfigFile();
              Config.config = JSON.parse(FileManager.readFile(FileManager.modSaveFilePath, "r"));
            }
            if (Config.config.ThemeBackgroundID >= 0) {
              ThemeSelectorManager.themeID = Config.config.ThemeBackgroundID;
            } else {
              ThemeSelectorManager.themeID = retval.toInt32() - 41000000;
            }
            retval.replace(ptr(41000000 + ThemeSelectorManager.themeID));
            break;
          case 15:
          case 19:
          case 46:
            retval.replace(ptr(1));
            break;
          case 204:
            if (Config.config.EnforceOldFriendsList) retval.replace(ptr(0));
            break;
        }
      },
    });
  }
}

exports.LogicConfData = LogicConfData;
