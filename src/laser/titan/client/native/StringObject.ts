// @ts-nocheck
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { Libc } = require("../../../../lib/Libc");
const { Libg } = require("../../../../lib/Libg");

const StringObject_ctor = new NativeFunction(Libg.offset(15293804, 14170096), "void", [
  "pointer",
  "pointer",
]);
const StringObject_dtor = new NativeFunction(Libg.offset(15293532, 14169812), "void", ["pointer"]);
const allocationSize = 16;
const lengthOffset = LogicMemory.offset(4);
const dataOffset = LogicMemory.offset(8);
const inlineCapacity = 7;

class StringObject {
  constructor(instance) {
    this.instance = instance;
  }

  static createNative(value) {
    return this.create(value);
  }

  static create(value, instance = NULL) {
    const result = instance.isNull() ? Libc.malloc(allocationSize) : instance;
    const nativeValue = Memory.allocUtf8String(value);
    StringObject_ctor(result, nativeValue);
    return result;
  }

  static read(instance) {
    const length = instance.add(lengthOffset).readU32();
    const data =
      length > inlineCapacity ? instance.add(dataOffset).readPointer() : instance.add(dataOffset);
    return data.readUtf8String(length) ?? "";
  }

  static clear(...instances) {
    for (const instance of instances) {
      StringObject_dtor(instance);
      Libc.free(instance);
    }
  }

  static with(value, callback) {
    const instance = this.create(value);
    try {
      return callback(instance);
    } finally {
      this.clear(instance);
    }
  }

  static withMany(values, callback) {
    const instances = values.map((value) => this.create(value));
    try {
      return callback(instances);
    } finally {
      this.clear(...instances);
    }
  }

  read() {
    return StringObject.read(this.instance);
  }
}

exports.StringObject = StringObject;
