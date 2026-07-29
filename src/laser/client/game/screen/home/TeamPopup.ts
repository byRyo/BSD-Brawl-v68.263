// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Sprite } = require("../../../../titan/client/common/flash/Sprite");
const { DisableBotsButton } = require("../../../../../suitcase/flash/button/DisableBotsButton");

const teamPopupCtor = Libg.offset(8074052, 7783968);
const disabledSlotsOffset = 144;
const disabledSlotsVectorOffset = 296;
const vectorSizeOffset = 80;
const vectorCountOffset = 12;

class TeamPopup {
  static getDisabledSlotIndices() {
    const result = new Set();
    if (this.instance.isNull()) return result;
    try {
      const slots = this.instance.add(disabledSlotsOffset).readPointer();
      if (slots.isNull()) return result;
      const vector = slots.add(disabledSlotsVectorOffset).readPointer();
      if (vector.isNull()) return result;
      const data = vector.readPointer();
      const count = vector.add(vectorCountOffset).readS32();
      for (let i = 0; i < count; i++) result.add(data.add(4 * i).readS32());
    } catch (_) {}
    return result;
  }

  static patch() {
    Interceptor.attach(teamPopupCtor, {
      onEnter(args) {
        this.self = args[0];
      },
      onLeave() {
        try {
          TeamPopup.instance = this.self;
          const sprite = new Sprite(this.self.add(vectorSizeOffset).readPointer());
          sprite.addChild(new DisableBotsButton());
        } catch (_) {}
      },
    });
  }
}

TeamPopup.instance = NULL;
exports.TeamPopup = TeamPopup;
