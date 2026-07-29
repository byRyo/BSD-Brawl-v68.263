// @ts-nocheck
const { Outline } = require("../renderer3d/Outline");
const { Libg } = require("../../../../lib/Libg");

const renderHook = Libg.offset(5601556, 5653604);
const colorOffsets = [9, 10, 11, 12];

class EnvironmentRenderer {
  static patch() {
    Interceptor.attach(renderHook, function () {
      const context = this.context;
      for (let index = 0; index < colorOffsets.length; index++) {
        context.x11.add(colorOffsets[index]).writeU8((Outline.outlineColor[index] / 100) * 255);
      }
    });
  }
}

exports.EnvironmentRenderer = EnvironmentRenderer;
