// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticleSelectorPopup = void 0;
const { ListContainerPopup } = require("../flash/popup/ListContainerPopup");
const { Localisation } = require("../localisation/Localisation");
const { Config } = require("../config/Config");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { FileManager } = require("../filesystem/FileManager");
const { ParticleItem } = require("../flash/popup/button/ParticleItem");
const { ParticleParametersPopup } = require("./ParticleParameters");
const { GUI } = require("../../laser/client/game/gui/GUI");
class ParticleSelectorPopup extends ListContainerPopup {
  constructor() {
    super({ Title: Localisation.getString("ParticleSelectorPopup") });
    this.adjustPopupHeaderButtons("particle_selector_popup");
    this.refreshItems();
  }
  refreshItems() {
    this.container.clearEntries();
    let id = 0;
    const particles = this.getParticles();
    for (const particle of particles) {
      if (
        particle.disabled ||
        (particle.name === "ParticleReset" && Config.config.ParticleExportName === "")
      )
        continue;
      const item = new ParticleItem(particle);
      item.setCustomButtonListener(
        this.buttonClicked.bind(this),
        "particleitem_".concat(particle.export_name, "_button"),
      );
      item.id = id++;
      this.container.addEntry(item);
    }
    const height = this.getNaviHeight();
    this.container.refreshEntryPositions(3, height, 8, false, false, false, -1);
    this.container.refreshBounds(height);
  }
  buttonClicked(_button, movieClip) {
    const rawId = new GameButton(movieClip).id;
    let id = rawId;
    if (Config.config.ParticleExportName === "") id++;
    const particle = this.getParticles()[id];
    if (particle) {
      if (ParticleSelectorPopup.PARTICLE[rawId].export_name !== Config.config.ParticleExportName)
        ParticleSelectorPopup.needsReload = true;
      Config.config.ParticleExportName = particle.export_name;
      Config.config.ParticleFileName = particle.file_name;
      FileManager.updateConfigFile();
      GUI.showPopup(new ParticleParametersPopup(), true, true, false);
    }
  }
  getParticles() {
    return ParticleSelectorPopup.PARTICLE;
  }
}
ParticleSelectorPopup.PARTICLE = [
  ["ParticleReset", "", ""],
  ["ParticleJanetSnow", "sc/effects_brawler.sc", "janet_006_lobby_snow_particle_2"],
  ["ParticleSnowParticle", "sc/ui.sc", "particle_snow_2"],
  ["ParticleAmberSnowflakeParticle", "sc/effects_brawler.sc", "amber_003_snowflake"],
  ["ParticleStuStarParticle", "sc/effects_brawler.sc", "stu_def_oc_atk_star_particle"],
  ["ParticleJanetStarParticle", "sc/effects_brawler.sc", "janet_def_lobby_star"],
  ["ParticleStarParticle", "sc/effects_brawler.sc", "particle_star_gold"],
  ["ParticleHeartSmallParticle", "sc/effects_brawler.sc", "particle_heart_small_05"],
  ["ParticleColleteHeartBodyParticle", "sc/effects_brawler.sc", "colette_004_heart_body_red"],
  ["ParticleColleteHeartUltiParticle", "sc/effects_brawler.sc", "colette_007_ulti_heart_01_red"],
  ["ParticleBoHeartParticle", "sc/effects_brawler.sc", "bo_008_lobby_heart_anim_01"],
  ["ParticleMelodieTrailParticle", "sc/effects_brawler.sc", "melodie_def_atk_trail_note_pink_01"],
  ["ParticleJanetTrailParticle", "sc/effects_brawler.sc", "janet_006_atk_trail_note_02"],
  ["ParticleGusImpactBubble", "sc/effects_brawler.sc", "gus_004_atk_impact_bubble_02"],
  ["ParticleStickyBubble", "sc/effects_brawler.sc", "sticky_def_oc_particle_bubbleGround_2"],
  ["ParticleBuzzBubble", "sc/effects_brawler.sc", "buzz_008_lobby_bubble"],
  ["ParticleThumbsdown", "sc/emoji.sc", "emoji_thumbsdown"],
].map(([name, file_name, export_name]) => ({ name, disabled: false, file_name, export_name }));
ParticleSelectorPopup.needsReload = false;
exports.ParticleSelectorPopup = ParticleSelectorPopup;
