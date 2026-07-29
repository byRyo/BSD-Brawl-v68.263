// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const ChatOptionsPopup_show = new NativeFunction(Libg.offset(9681492, 9135100), "void", []);
class ChatOptionsPopup {
  static show() {
    ChatOptionsPopup_show();
  }
}
module.exports = { ChatOptionsPopup };
