// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { Outline } = require("../renderer3d/Outline");

const renderHook = Libg.offset(5674988, 5714432);
const colorOffsets = [412, 416, 420, 424];

class SceneRenderer {
  static patch() {
    Interceptor.attach(renderHook, function () {
      const context = this.context;
      for (let index = 0; index < colorOffsets.length; index++) {
        const value = Outline.outlineColor[index] / 100;
        if (Process.platform === "darwin") {
          context.x11.add(colorOffsets[index]).writeFloat(value);
        } else {
          context.x12.add(colorOffsets[index]).writeFloat(value);
        }
      }
    });
  }
}

exports.SceneRenderer = SceneRenderer;
