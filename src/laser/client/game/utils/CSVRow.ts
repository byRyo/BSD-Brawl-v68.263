// @ts-nocheck
const { CSVTable } = require("./CSVTable");

const rowIndexOffset = 8;
const stringColumnsOffset = 40;
const integerColumnsOffset = 24;
const booleanColumnsOffset = 56;
const integerSize = 4;
const highBit = 2147483648;
const invalidStringIndex = 2147483647;
const invalidInt = 4294967295;

class CSVRow {
  static getName(row) {
    return CSVTable.getValueAt(
      row.readPointer().add(rowIndexOffset).readPointer().readPointer(),
      row.add(rowIndexOffset).readU32(),
    );
  }

  static getValueAt(row, column) {
    const rowIndex = row.add(rowIndexOffset).readU32();
    const table = row.readPointer();
    if ((column & highBit) !== 0) return invalidStringIndex;
    return CSVTable.getValueAt(
      table
        .add(stringColumnsOffset)
        .readPointer()
        .add(column * Process.pointerSize)
        .readPointer(),
      rowIndex,
    );
  }

  static getBooleanValueAt(row, column) {
    const rowIndex = row.add(rowIndexOffset).readU32();
    const table = row.readPointer();
    return (
      (column & highBit) === 0 &&
      table
        .add(stringColumnsOffset)
        .readPointer()
        .add(column * Process.pointerSize)
        .readPointer()
        .add(booleanColumnsOffset)
        .readPointer()
        .add(rowIndex)
        .readU8() === 1
    );
  }

  static getIntValueAt(row, column) {
    if ((column & highBit) !== 0) return 0;
    const rowIndex = row.add(rowIndexOffset).readU32();
    const value = row
      .readPointer()
      .add(stringColumnsOffset)
      .readPointer()
      .add(column * Process.pointerSize)
      .readPointer()
      .add(integerColumnsOffset)
      .readPointer()
      .add(integerSize * rowIndex)
      .readU32();
    return value === invalidInt ? 0 : value;
  }
}

exports.CSVRow = CSVRow;
