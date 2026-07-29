// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");

const getFramerateManager = new NativeFunction(Libg.offset(0, 9580596), "pointer", []);
const setSegmentNative = new NativeFunction(Libg.offset(0, 14246680), "void", ["pointer", "int"]);

class FramerateManager {
  constructor(instance) {
    this.instance = instance;
  }

  get frameRate() {
    return this.instance.readDouble();
  }

  set frameRate(value) {
    this.instance.writeDouble(value);
  }

  get frameRates() {
    return [
      this.instance.add(8).readDouble(),
      this.instance.add(16).readDouble(),
      this.instance.add(24).readDouble(),
    ];
  }

  set frameRates(values) {
    this.instance.add(8).writeDouble(values[0]);
    this.instance.add(16).writeDouble(values[1]);
    this.instance.add(24).writeDouble(values[2]);
  }

  get frameTime() {
    return this.instance.add(32).readFloat();
  }

  set frameTime(value) {
    this.instance.add(32).writeFloat(value);
  }

  get initialized() {
    return this.instance.add(36).readU8() !== 0;
  }

  set initialized(value) {
    this.instance.add(36).writeU8(value ? 1 : 0);
  }

  get bestFrameRateIndex() {
    const frameRates = this.frameRates;
    return frameRates.indexOf(Math.max(frameRates[0], frameRates[1], frameRates[2]));
  }

  static patch() {
    Interceptor.attach(setSegmentNative, {
      onEnter(args) {
        args[1] = ptr(new FramerateManager(args[0]).bestFrameRateIndex);
      },
    });
  }

  static setSegment(index) {
    const instance = getFramerateManager();
    const frameRate = instance.add(8 + 8 * index).readDouble();
    instance.writeDouble(frameRate);
    instance.add(32).writeFloat(1 / frameRate);
  }

  static setFrameRate(frameRate) {
    const manager = new FramerateManager(getFramerateManager());
    manager.frameRates = [frameRate, frameRate, frameRate];
    manager.frameRate = frameRate;
    manager.frameTime = 1 / frameRate;
  }
}

exports.FramerateManager = FramerateManager;
