// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { Config } = require("../../../../suitcase/config/Config");
const { InputField } = require("../../../titan/client/common/flash/InputField");

const buttonClickedNative = new NativeFunction(Libg.offset(6374188, 6295512), "void", [
  "pointer",
  "pointer",
]);
const instanceAddress = Libg.offset(19844328, 18154896);
const inputFieldOffset = LogicMemory.offset(88);

class TeamStream {
  static getInstance() {
    return instanceAddress.readPointer();
  }
  static buttonClicked(offset) {
    const instance = this.getInstance();
    buttonClickedNative(instance, instance.add(offset).readPointer());
  }
  static patch() {
    Interceptor.attach(buttonClickedNative, {
      onEnter(args) {
        if (!args[0].add(exports.chatButtonOffset).readPointer().equals(args[1])) return;
        const input = new InputField(args[0].add(inputFieldOffset).readPointer());
        Config.config.TeamChatAnticensor;
        input.setMaxTextLength(128);
      },
    });
  }
}

exports.chatButtonOffset = LogicMemory.offset(40);
exports.TeamStream = TeamStream;
