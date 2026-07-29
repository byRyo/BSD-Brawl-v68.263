// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const setMatchContext = new NativeFunction(Libg.offset(10564200, 9886852), "void", [
  "pointer",
  "int",
  "pointer",
  "int",
  "int",
  "pointer",
  "pointer",
]);
const instance = Libg.offset(19850832, 18156864);
class SessionStatics {
  static getInstance() {
    return instance;
  }
  static setMatchContext(context) {
    setMatchContext(instance, context, NULL, -1, 0, NULL, NULL);
  }
}
exports.SessionStatics = SessionStatics;
