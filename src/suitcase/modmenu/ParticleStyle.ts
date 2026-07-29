// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticleStylePopup = void 0;
const { ListContainerPopup } = require("../flash/popup/ListContainerPopup");
const { Localisation } = require("../localisation/Localisation");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { ParticleSelectorPopup } = require("./ParticleSelector");
const { Config } = require("../config/Config");
const { ParticleStyleItem } = require("../flash/popup/button/ParticleStyleItem");
const { FileManager } = require("../filesystem/FileManager");

class ParticleStylePopup extends ListContainerPopup {
  constructor() {
    super({ Title: Localisation.getString("ParticleStylePopup") });
    this.adjustPopupHeaderButtons("particle_type_popup");
    this.refreshItems();
  }
  refreshItems() {
    this.container.clearEntries();
    let id = 0;
    for (const type of ParticleStylePopup.PARTICLE_TYPE) {
      const item = new ParticleStyleItem(type);
      item.setCustomButtonListener(this.buttonClicked.bind(this), "particleStyle_".concat(id));
      item.id = id;
      this.container.addEntry(item);
      id++;
    }
    const height = this.getNaviHeight();
    this.container.refreshEntryPositions(true, 2.5 * height, false, false, false, false, -1);
    this.container.refreshBounds(height);
  }
  buttonClicked(_button, movieClip) {
    const id = new GameButton(movieClip).id;
    const type = ParticleStylePopup.PARTICLE_TYPE[id];
    if (type) {
      if (ParticleStylePopup.PARTICLE_TYPE[id].style !== Config.config.ParticleStyle) {
        ParticleSelectorPopup.needsReload = true;
      }
      Config.config.ParticleStyle = type.style;
      FileManager.updateConfigFile();
      GUI.showPopup(new ParticleSelectorPopup(), true, true, false);
    }
  }
}
ParticleStylePopup.PARTICLE_TYPE = [
  { name: "ParticleStyleSnow", style: "Snow" },
  { name: "ParticleStyleEmber", style: "Ember" },
];
exports.ParticleStylePopup = ParticleStylePopup;
