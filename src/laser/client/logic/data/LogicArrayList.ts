// @ts-nocheck
const { Libc } = require("../../../../lib/Libc");

const capacityOffset = 8;
const countOffset = 12;

class LogicArrayList {
  constructor(instance = 0) {
    if (instance instanceof NativePointer) {
      this.instance = instance;
      return;
    }

    this.instance = Libc.malloc(LogicArrayList.allocSize);
    const array = Libc.malloc(Process.pointerSize);
    this.instance.writePointer(array);
    this.instance.add(capacityOffset).writeInt(instance);
    this.instance.add(countOffset).writeInt(0);
  }

  addIntElement(element) {
    this.addElement(element, 4);
  }

  addFloatElement(element) {
    this.addElement(element, 4, true);
  }

  addElement(element, elementSize = Process.pointerSize, isFloat) {
    const count = this.getItemsCount();
    if (count === this.getCapacity()) {
      const doubledCapacity = 2 * count;
      this.ensureCapacity(doubledCapacity !== 0 ? doubledCapacity : 5);
    }

    const newCount = count + 1;
    const destination = this.instance.readPointer().add(elementSize * count);
    if (typeof element === "number") {
      if (isFloat) destination.writeFloat(element);
      else destination.writeInt(element);
    } else {
      destination.writePointer(element);
    }
    this.setCount(newCount);
    return this;
  }

  getElement(index, elementSize = Process.pointerSize) {
    if (index > this.getItemsCount()) return NULL;
    return this.instance
      .readPointer()
      .add(elementSize * index)
      .readPointer();
  }

  getElementBypassCheck(index, elementSize = Process.pointerSize) {
    return this.instance
      .readPointer()
      .add(elementSize * index)
      .readPointer();
  }

  getIntElement(index) {
    if (index > this.getItemsCount()) return NULL;
    return this.instance.readPointer().add(4 * index);
  }

  getArray() {
    return this.instance.readPointer();
  }

  setCapacity(capacity) {
    this.instance.add(capacityOffset).writeInt(capacity);
  }

  setCount(count) {
    this.instance.add(countOffset).writeInt(count);
  }

  getCapacity() {
    return this.instance.add(capacityOffset).readInt();
  }

  getItemsCount() {
    return this.instance.add(countOffset).readInt();
  }

  writeTo(destination) {
    destination.writePointer(this.instance);
    destination.add(capacityOffset).writeInt(this.getCapacity());
    destination.add(countOffset).writeInt(this.getItemsCount());
  }

  ensureCapacity(capacity) {
    if (this.getCapacity() < capacity) {
      const newArray = Libc.malloc(Process.pointerSize * capacity);
      const oldArray = this.instance.readPointer();
      const count = this.getItemsCount();
      if (count >= 1) {
        const end = count + 1;
        for (let index = 0; index < end; index++) {
          const element = oldArray.add(Process.pointerSize * index).readPointer();
          newArray.add(Process.pointerSize * index).writePointer(element);
        }
      }
      Libc.free(oldArray);
      this.instance.writePointer(newArray);
      this.setCapacity(capacity);
    }
  }
}

LogicArrayList.allocSize = 16;

exports.LogicArrayList = LogicArrayList;
