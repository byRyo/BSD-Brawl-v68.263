// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const { StringObject } = require("../../../../titan/client/native/StringObject");

const NewsPage_create = new NativeFunction(Libg.offset(9351704, 8857612), "pointer", [
  "pointer",
  "pointer",
  "int",
]);
const NewsPage_forceOpenLandingPage = new NativeFunction(Libg.offset(9356420, 8861608), "void", [
  "pointer",
]);
const retryButtonOffset = LogicMemory.offset(552);
const timerTextFieldOffset = LogicMemory.offset(536);

class NewsPage {
  constructor(instance) {
    this.instance = instance;
  }
  static create(parent, url, mode) {
    const parentInstance = parent ? parent.instance : NULL;
    return StringObject.with(
      url,
      (value) => new NewsPage(NewsPage_create(parentInstance, value, mode)),
    );
  }
  forceOpenLandingPage() {
    if (!this.instance.isNull()) NewsPage_forceOpenLandingPage(this.instance);
  }
  getRetryButton() {
    return this.instance.isNull() ? NULL : this.instance.add(retryButtonOffset).readPointer();
  }
  getTimerTextField() {
    return this.instance.isNull() ? NULL : this.instance.add(timerTextFieldOffset).readPointer();
  }
}

module.exports = { NewsPage };
