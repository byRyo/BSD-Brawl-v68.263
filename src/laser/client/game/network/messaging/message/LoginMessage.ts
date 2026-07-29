// @ts-nocheck
const { Libg } = require("../../../../../../lib/Libg");
const { PlayerInfo } = require("../../../friends/PlayerInfo");
const { LogicLong } = require("../../../../logic/LogicLong");
const { HashTagCodeGenerator } = require("../../../utils/HashTagCodeGenerator");
const {
  MaintenancePopupPreview,
} = require("../../../../../../suitcase/feature/MaintenancePopupPreview");

const decode = new NativeFunction(Libg.offset(12353772, 11277016), "void", ["pointer", "pointer"]),
  send = Libg.offset(12351216, 11274484);

class LoginMessage {
  static patch() {
    Interceptor.replace(
      decode,
      new NativeCallback(
        (message, id) => {
          PlayerInfo.accountId = new LogicLong(id);
          PlayerInfo.tag = HashTagCodeGenerator.convertLongToPlayerTag(PlayerInfo.accountId);
          decode(message, id);
        },
        "void",
        ["pointer", "pointer"],
      ),
    );

    Interceptor.replace(
      send,
      new NativeCallback(
        (message) => {
          if (!MaintenancePopupPreview.isLoginBlockActive())
            new NativeFunction(send, "void", ["pointer"])(message);
        },
        "void",
        ["pointer"],
      ),
    );
  }
}
exports.LoginMessage = LoginMessage;
