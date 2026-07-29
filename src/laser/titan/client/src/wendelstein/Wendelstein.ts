// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Config } = require("../../../../../suitcase/config/Config");
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");

const emitterComponentHook = Libg.offset(15345456);
const secondaryFrameRateOffset = LogicMemory.offset(328);

var wendelstein;
(function (wendelstein) {
  class IEmitterComponent {
    static patch() {
      if (Process.platform !== "darwin") {
        Interceptor.attach(emitterComponentHook, {
          onEnter(args) {
            const frameRate = Config.config.FPSLimit > 0 ? Config.config.FPSLimit : 600;
            args[0].writeDouble(frameRate);
            args[0].add(secondaryFrameRateOffset).writeDouble(frameRate);
          },
        });
      }
    }
  }

  wendelstein.IEmitterComponent = IEmitterComponent;
})(wendelstein || (exports.wendelstein = wendelstein = {}));
