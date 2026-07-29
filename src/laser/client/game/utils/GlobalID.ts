// @ts-nocheck
class GlobalID {
  static createGlobalID(classId, instanceId) {
    return (instanceId % 1000000) + 1000000 * classId;
  }
  static getClassID(globalId) {
    return Math.round(globalId / 1000000);
  }
  static getInstanceID(globalId) {
    return globalId % 1000000;
  }
}

exports.GlobalID = GlobalID;
