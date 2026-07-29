// @ts-nocheck
const { TextField, TextField_setAllowColorCodes } = require("./TextField");
const { Libg } = require("../../../../../lib/Libg");
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const decoratedCtor = Libg.offset(6030188, 6019364);
const vtableOffset = LogicMemory.offset(68);
const decoratedVtable = 726355;
class DecoratedTextField extends TextField {
  static patch() {
    Interceptor.attach(decoratedCtor, {
      onEnter(args) {
        const instance = args[0];
        this.tf =
          instance.isNull() || instance.add(vtableOffset).readU32() !== decoratedVtable
            ? null
            : new TextField(instance);
      },
      onLeave() {
        if (this.tf) {
          this.tf.colorTag = true;
          this.tf.setTextScaleIfNecessary(this.tf.text);
        }
      },
    });
    Interceptor.attach(TextField_setAllowColorCodes, {
      onEnter(args) {
        if (args[1].toInt32() === 0) args[1] = ptr(1);
      },
    });
  }
}
module.exports = { DecoratedTextField };
