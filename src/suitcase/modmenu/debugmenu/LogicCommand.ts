// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommandTypeVtableOffset = exports.LogicCommand = void 0;
const executeVtableOffset = 3 * Process.pointerSize;
exports.getCommandTypeVtableOffset = 4 * Process.pointerSize;
class LogicCommand {
  constructor(instance) {
    this.instance = instance;
    this.vtable = this.instance.readPointer();
  }
  execute(arg) {
    return LogicCommand.resolveExecuteFunction(this.vtable)(this.instance, arg, 3, 0);
  }
  getCommandType() {
    return LogicCommand.getCommandType(this.instance);
  }
  static getCommandType(instance) {
    return LogicCommand.resolveGetCommandTypeFunction(instance.readPointer())(instance);
  }
  static resolveExecuteFunction(vtable) {
    return new NativeFunction(vtable.add(executeVtableOffset).readPointer(), "int", [
      "pointer",
      "pointer",
      "int",
      "bool",
    ]);
  }
  static resolveGetCommandTypeFunction(vtable) {
    return new NativeFunction(vtable.add(exports.getCommandTypeVtableOffset).readPointer(), "int", [
      "pointer",
    ]);
  }
}
exports.LogicCommand = LogicCommand;
