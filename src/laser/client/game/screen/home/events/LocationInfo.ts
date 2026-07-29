// @ts-nocheck
const { Libg } = require("../../../../../../lib/Libg");
const { LogicLocationData } = require("../../../../logic/data/LogicLocationData");
const { LogicDataTables } = require("../../../../logic/data/LogicDataTables");

const getLocationThemeIndex = new NativeFunction(Libg.offset(7426916, 7229560), "int", ["pointer"]);

class LocationInfo {
  constructor(instance) {
    this._instance = instance;
  }
  get locationData() {
    return new LogicLocationData(this._instance.readPointer());
  }
  getLocationThemeData() {
    const index = getLocationThemeIndex(this._instance);
    return LogicDataTables.getTable(LogicDataTables.table.LocationThemes).getItemAt(index);
  }
  static getLocationThemeData(location) {
    const index = getLocationThemeIndex(location.instance);
    return LogicDataTables.getTable(LogicDataTables.table.LocationThemes).getItemAt(index);
  }
}

exports.LocationInfo = LocationInfo;
