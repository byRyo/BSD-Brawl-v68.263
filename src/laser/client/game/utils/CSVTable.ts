// @ts-nocheck
class CSVTable {
  static getValueAt(table, index) {
    return table
      .add(8)
      .readPointer()
      .add(16 * index);
  }
}

exports.CSVTable = CSVTable;
