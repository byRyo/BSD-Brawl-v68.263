// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { StringObject } = require("../../../../titan/client/native/StringObject");
const { HashTagCodeGenerator } = require("../../utils/HashTagCodeGenerator");
const FriendRequestContainer_show = new NativeFunction(Libg.offset(7362856, 7167528), "void", [
  "pointer",
  "pointer",
]);
class FriendRequestContainer {
  static show(name, tag) {
    StringObject.with(name, (value) => FriendRequestContainer_show(value, tag.instance));
  }
  static showForTag(tag) {
    this.show(tag, HashTagCodeGenerator.convertPlayerTagToLong(tag));
  }
}
module.exports = { FriendRequestContainer };
