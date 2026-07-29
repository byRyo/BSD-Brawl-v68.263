// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { GenericPopup } = require("../../../titan/client/common/flash/GenericPopup");
const { StringObject } = require("../../../titan/client/native/StringObject");

const SimpleWebView_create = new NativeFunction(Libg.offset(9465296, 8948024), "pointer", []);
const SimpleWebView_loadURL = new NativeFunction(Libg.offset(9466340, 8948964), "void", [
  "pointer",
  "pointer",
]);

class SimpleWebView extends GenericPopup {
  static create() {
    return new SimpleWebView(SimpleWebView_create());
  }
  loadURL(url) {
    StringObject.with(url, (value) => SimpleWebView_loadURL(this.instance, value));
  }
}

module.exports = { SimpleWebView };
