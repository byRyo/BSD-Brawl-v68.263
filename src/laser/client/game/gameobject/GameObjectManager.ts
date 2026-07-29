// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");

const playEffectNative = new NativeFunction(Libg.offset(5452624, 5531864), "pointer", ["pointer", "int", "int", "int", "pointer", "pointer", "int", "char", "char", "char",]);

class GameObjectManager {
  constructor(instance) {
    this.instance = instance;
  }
  isNull() {
    return this.instance.isNull();
  }
  playEffect(
    effect,
    x,
    y,
    z = 0,
    parent = NULL,
    playerIndex = -1,
    mirror = false,
    scale = true,
    autoRemove = false,
  ) {
    return playEffectNative(
      this.instance,
      x,
      y,
      z,
      effect.instance,
      parent,
      playerIndex,
      mirror ? 1 : 0,
      scale ? 1 : 0,
      autoRemove ? 1 : 0,
    );
  }
}

exports.GameObjectManager = GameObjectManager;
