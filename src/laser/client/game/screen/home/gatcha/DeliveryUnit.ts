// @ts-nocheck
const { Libg } = require("../../../../../../lib/Libg");
const { LogicArrayList } = require("../../../../logic/data/LogicArrayList");
const { Libc } = require("../../../../../../lib/Libc");
const { LogicMemory } = require("../../../../../../suitcase/logic/LogicMemory");

const deliveryUnitCtor = new NativeFunction(Libg.offset(11029772, 10223532), "void", [
  "pointer",
  "int",
]);
const arrayOffset = LogicMemory.offset(16);
const capacityOffset = LogicMemory.offset(24);
const countOffset = LogicMemory.offset(28);

class DeliveryUnit {
  constructor(type) {
    this.instance = Libc.malloc(DeliveryUnit.allocationSize);
    deliveryUnitCtor(this.instance, type);
    this.array = new LogicArrayList();
  }

  addDrop(drop) {
    this.array.addElement(drop.instance);
    this.instance.add(arrayOffset).writePointer(this.array.getArray());
    this.instance.add(capacityOffset).writeInt(this.array.getCapacity());
    this.instance.add(countOffset).writeInt(this.array.getItemsCount());
    return this;
  }
}

DeliveryUnit.allocationSize = 32;
exports.DeliveryUnit = DeliveryUnit;
