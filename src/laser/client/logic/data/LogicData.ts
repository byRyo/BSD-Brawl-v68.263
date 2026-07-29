// @ts-nocheck
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { StringObject } = require("../../../titan/client/native/StringObject");
const { CSVRow } = require("../../game/utils/CSVRow");
const { GlobalID } = require("../../game/utils/GlobalID");

const csvRowOffset = LogicMemory.offset(8);
const globalIdOffset = LogicMemory.offset(32);
const tidColumnOffset = LogicMemory.offset(36);

class LogicData {
  constructor(instance) {
    this.instance = instance;
  }

  getName() {
    return LogicData.getName(this.instance);
  }

  getValueAt(index) {
    return LogicData.getValueAt(this.instance, index);
  }

  getBooleanValueAt(index) {
    return LogicData.getBooleanValueAt(this.instance, index);
  }

  getIntValueAt(index) {
    return LogicData.getIntValueAt(this.instance, index);
  }

  getStringValueAt(index) {
    return StringObject.read(this.getValueAt(index));
  }

  getTID() {
    return LogicData.getTID(this.instance);
  }

  getTIDPointer() {
    return LogicData.getTIDPointer(this.instance);
  }

  getGlobalID() {
    return LogicData.getGlobalID(this.instance);
  }

  getClassID() {
    return LogicData.getClassID(this.instance);
  }

  getInstanceID() {
    return LogicData.getInstanceID(this.instance);
  }

  equals(other) {
    return LogicData.equals(this, other);
  }

  readU8(offset) {
    return this.instance.add(offset).readU8();
  }

  readU16(offset) {
    return this.instance.add(offset).readU16();
  }

  readU32(offset) {
    return this.instance.add(offset).readU32();
  }

  readS32(offset) {
    return this.instance.add(offset).readS32();
  }

  readFloat(offset) {
    return this.instance.add(offset).readFloat();
  }

  readPointer(offset) {
    return this.instance.add(offset).readPointer();
  }

  readString(offset) {
    return StringObject.read(this.instance.add(offset));
  }

  readWrappedPointer(offset, wrapper) {
    const instance = this.readPointer(offset);
    return instance.isNull() ? null : wrapper(instance);
  }

  readBoolByte(offset) {
    return Boolean(this.readU8(offset));
  }

  writePointer(offset, value) {
    this.instance.add(offset).writePointer(value);
  }

  static getName(instance) {
    return StringObject.read(CSVRow.getName(this.getCsvRow(instance)));
  }

  static getValueAt(instance, index) {
    return CSVRow.getValueAt(this.getCsvRow(instance), index);
  }

  static getBooleanValueAt(instance, index) {
    return CSVRow.getBooleanValueAt(this.getCsvRow(instance), index);
  }

  static getIntValueAt(instance, index) {
    return CSVRow.getIntValueAt(this.getCsvRow(instance), index);
  }

  static getStringValueAt(instance, index) {
    return StringObject.read(this.getValueAt(instance, index));
  }

  static getTID(instance) {
    return StringObject.read(this.getTIDPointer(instance));
  }

  static getTIDPointer(instance) {
    const column = instance.add(tidColumnOffset).readS32();
    return CSVRow.getValueAt(this.getCsvRow(instance), column);
  }

  static getGlobalID(instance) {
    return instance.add(globalIdOffset).readInt();
  }

  static getClassID(instance) {
    const globalId = this.getGlobalID(instance);
    return GlobalID.getClassID(globalId);
  }

  static getInstanceID(instance) {
    const globalId = this.getGlobalID(instance);
    return GlobalID.getInstanceID(globalId);
  }

  static equals(first, second) {
    first = first.instance ?? first;
    return first.equals(second.instance ?? first);
  }

  static getCsvRow(instance) {
    return instance.add(csvRowOffset).readPointer();
  }
}

exports.LogicData = LogicData;
