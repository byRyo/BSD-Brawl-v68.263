// @ts-nocheck
const { LogicDataTable } = require("./LogicDataTable");
const { Libg } = require("../../../../lib/Libg");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");

const LogicClientGlobals_ctor = new NativeFunction(Libg.offset(11224376, 10387508), "void", [
  "pointer",
]);
const firstFlagOffset = LogicMemory.offset(901);
const secondFlagOffset = LogicMemory.offset(902);

class LogicClientGlobals extends LogicDataTable {
  static patch() {
    Interceptor.replace(
      LogicClientGlobals_ctor,
      new NativeCallback(
        (instance) => {
          LogicClientGlobals_ctor(instance);
          instance.add(firstFlagOffset).writeU8(0);
          instance.add(secondFlagOffset).writeU8(0);
        },
        "void",
        ["pointer"],
      ),
    );
  }
}

exports.LogicClientGlobals = LogicClientGlobals;
