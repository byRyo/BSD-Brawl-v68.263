// @ts-nocheck
const { StringObject } = require("../../../titan/client/native/StringObject");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { LogicDataTables } = require("./LogicDataTables");

const itemsOffset = LogicMemory.offset(8);
const itemCountOffset = LogicMemory.offset(20);
const getItemByNameVtableOffset = LogicMemory.offset(80);
const tableIndexOffset = LogicMemory.offset(48);

class LogicDataTable {
  constructor(instance) {
    this.instance = instance;
  }

  getItemAt(index) {
    const instance = this.getItemPointerAt(index);
    if (!instance || instance.isNull()) return null;
    return LogicDataTables.wrapDataForTable(this.getTableIndex(), instance);
  }

  getItemPointerAt(index) {
    if (index < 0 || index >= this.getItemCount()) return null;
    const items = this.instance.add(itemsOffset).readPointer();
    if (items.isNull()) return null;
    return items.add(8 * index).readPointer();
  }

  getItemCount() {
    return this.instance.add(itemCountOffset).readU32();
  }

  getItemByName(name, fallback = NULL) {
    return StringObject.with(name, (namePointer) =>
      LogicDataTables.getDataByPtr(this.callGetItemByNameNative(namePointer, fallback)),
    );
  }

  getTableIndex() {
    return this.instance.add(tableIndexOffset).readInt();
  }

  callGetItemByNameNative(name, fallback) {
    const vtable = this.instance.readPointer();
    const native = new NativeFunction(
      vtable.add(getItemByNameVtableOffset).readPointer(),
      "pointer",
      ["pointer", "pointer", "pointer"],
    );
    return native(this.instance, name, fallback);
  }
}

exports.LogicDataTable = LogicDataTable;
