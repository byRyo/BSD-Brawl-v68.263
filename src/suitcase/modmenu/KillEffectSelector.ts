// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.KillEffectSelectorPopup = void 0;
const { ListContainerPopup } = require("../flash/popup/ListContainerPopup");
const { Localisation } = require("../localisation/Localisation");
const { Config } = require("../config/Config");
const { KillEffectItem } = require("../flash/popup/button/KillEffectItem");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { FileManager } = require("../filesystem/FileManager");
class KillEffectSelectorPopup extends ListContainerPopup {
  constructor(effectType = 0) {
    super({ Title: Localisation.getString("KillEffectSelectorPopup") });
    this.effectType = effectType;
    this.adjustPopupHeaderButtons("kill_effect_popup");
    this.refreshItems();
  }
  refreshItems() {
    this.container.clearEntries();
    let id = 0;
    for (const effect of this.getEffects()) {
      if (
        effect.disabled ||
        (effect.name === "KillEffectReset" && Config.config.KillEffectType === "")
      )
        continue;
      const item = new KillEffectItem(effect);
      item.setCustomButtonListener(
        this.buttonClicked.bind(this),
        "killEffect_".concat(effect.effect_name, "_button"),
      );
      item.id = id++;
      this.container.addEntry(item);
    }
    const height = this.getNaviHeight();
    this.container.refreshEntryPositions(3, height, 8, false, false, false, -1);
    this.container.refreshBounds(height);
  }
  buttonClicked(_button, movieClip) {
    let id = new GameButton(movieClip).id;
    if (Config.config.KillEffectType === "") id++;
    const effect = this.getEffects()[id];
    if (effect) {
      Config.config.KillEffectType = effect.effect_name;
      FileManager.updateConfigFile();
      this.fadeOut();
    }
  }
  getEffects() {
    return this.effectType === 0
      ? KillEffectSelectorPopup.KILL_EFFECT_TYPE_COMMON
      : KillEffectSelectorPopup.KILL_EFFECT_TYPE_CUSTOM;
  }
}
const common = [
  ["KillEffectReset", ""],
  ["KillEffectPhoenixCrow", "crow_006_kill"],
  ["KillEffectMechBo", "bo_002_kill"],
  ["KillEffectRoboCrow", "crow_002_kill"],
  ["KillEffectMechMike", "dynamike_004_kill"],
  ["KillEffectVirus8Bit", "arcade_002_kill"],
  ["KillEffectEvilPam", "pam_003_kill"],
  ["KillEffectMechMortis", "mortis_005_kill"],
  ["KillEffectIceAmber", "amber_003_kill"],
  ["KillEffectMonsterStu", "stu_003_kill"],
  ["KillEffectMechEdgar", "edgar_006_kill"],
  ["KillEffectDarkNita", "nita_008_kill"],
  ["KillEffectKingFrank", "frank_006_kill"],
  ["KillEffectWukongMiko", "mico_002_kill"],
  ["KillEffectCartoonSpike", "spike_007_kill"],
  ["KillEffectMechLeon", "leon_008_kill"],
  ["KillEffectRagnarokBibi", "bibi_007_kill"],
  ["KillEffectScorpionChuck", "chuck_002_kill"],
  ["KillEffectMechColt", "colt_009_kill"],
  ["KillEffectVirusCharlie", "charlie_003_kill"],
  ["KillEffectBuzzilla", "buzz_007_kill"],
  ["KillEffectLoadedRico", "rico_008_kill"],
  ["KillEffectDDraco", "draco_002_kill"],
  ["KillEffectToonCordelius", "cordelius_005_kill"],
  ["KillEffectAngelicEdgar", "edgar_008_kill"],
  ["KillEffectDemonicMortis", "mortis_008_kill"],
  ["KillEffectSurgeLightyear", "surge_buzz_kill"],
  ["KillEffectHCColt", "colt_011_kill"],
  ["KillEffectMechFinx", "finx_002_kill"],
  ["KillEffectSurgeCandleDynamike", "dynamike_012_oc_kill"],
  ["KillEffectSurgeJapanSamurai", "samurai_003_kill"],
  ["KillEffectHypnosSandy", "sandy_007_kill"],
  ["KillEffectHalloweenTick", "tick_009_kill"],
  ["KillEffectStreetPoco", "poco_010_kill"],
  ["KillEffectPorcelainSurge", "surge_010_kill_k2"],
  ["KillEffectStNita", "nita_012_kill"],
  ["KillEffectMechPiper", "piper_010_kill"],
  ["KillEffectMechJessie", "jessie_011_kill"],
  ["KillEffectTigerLeon", "leon_010_kill"],
];
const custom = [
  ["KillEffectReset", ""],
  ["KillEffectGoal", "mode_gift_goal"],
  ["KillEffectOverchargedExplosion", "buzz_overcharged_ulti_explosion"],
  ["KillEffectUno", "chester_005_ulti_explode"],
  ["KillEffectDynamikeExplosion", "dynamike_009_ulti_explosion"],
  ["KillEffectBonnieHit", "bonnie_004_atk_small_hit"],
  ["KillEffectGromUlti", "grom_005_ulti2_reached"],
  ["KillEffectConfettiShield", "rosa_006_ulti"],
  ["KillEffectTickExplosion", "tick_005_atk1_explode"],
  ["KillEffectBats", "mortuary_themed_explo"],
  ["KillEffectBrawlUpgrade", "brawler_upgrade_effect"],
  ["KillEffectFleaLanding", "flea_002_ulti_landing"],
  ["KillEffectGrayFinger", "gray_def_oc_ulti_ready"],
  ["KillEffectPearlUlti", "pearl_004_ulti_k2"],
  ["KillEffectDracoNotes", "draco_003_atk_hit"],
  ["KillEffectMeteor", "mico_def_ulti_landing"],
];
KillEffectSelectorPopup.KILL_EFFECT_TYPE_COMMON = common.map(([name, effect_name]) => ({
  name,
  disabled: false,
  effect_name,
}));
KillEffectSelectorPopup.KILL_EFFECT_TYPE_CUSTOM = custom.map(([name, effect_name]) => ({
  name,
  disabled: false,
  effect_name,
}));
exports.KillEffectSelectorPopup = KillEffectSelectorPopup;
