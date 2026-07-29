// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg"),
  { Libc } = require("../../../../../lib/Libc"),
  { StringObject } = require("../../native/StringObject");
const ctor = new NativeFunction(Libg.offset(6093484, 6065120), "void", [
    "pointer",
    "pointer",
    "int",
    "int",
    "int",
    "pointer",
    "pointer",
  ]),
  addEntryNative = new NativeFunction(Libg.offset(6096224, 6067816), "void", [
    "pointer",
    "pointer",
  ]),
  clearNative = new NativeFunction(Libg.offset(6095296, 6066656), "void", ["pointer"]),
  refreshBoundsNative = new NativeFunction(Libg.offset(6096052, 6067636), "void", [
    "pointer",
    "float",
  ]),
  refreshPositionsNative = new NativeFunction(Libg.offset(6096884, 6067996), "void", [
    "pointer",
    "int",
    "float",
    "float",
    "float",
    "int",
    "int",
    "float",
  ]),
  scrollNative = new NativeFunction(Libg.offset(6100100, 6069804), "void", [
    "pointer",
    "float",
    "float",
  ]);
class ListContainer {
  constructor(parent, type, a, b, name, c) {
    this.entries = [];
    this.instance = Libc.malloc(ListContainer.allocationSize);
    StringObject.with(name, (s) => ctor(this.instance, parent.instance, type, a, b, s, c));
  }
  refreshBounds(v) {
    refreshBoundsNative(this.instance, v);
  }
  refreshEntryPositions(...args) {
    refreshPositionsNative(this.instance, ...args);
  }
  addEntry(entry) {
    this.entries.push(entry);
    addEntryNative(this.instance, entry.instance);
  }
  getEntry(predicate) {
    return this.entries.find(predicate);
  }
  clearEntries() {
    clearNative(this.instance);
  }
  scrollTo(a, b) {
    scrollNative(this.instance, a, b);
  }
}
ListContainer.allocationSize = 248;
module.exports = { ListContainer };
