// @ts-nocheck
const { Config } = require("../../../../suitcase/config/Config");
const { EnvironmentRenderer } = require("../gfx/EnvironmentRenderer");
const { SceneRenderer } = require("../gfx/SceneRenderer");

class Outline {
  static init() {
    this.outlineColor = Config.config.OutlineColor.slice();
    EnvironmentRenderer.patch();
    SceneRenderer.patch();
  }
}

exports.Outline = Outline;
