// @ts-nocheck
const {
  DropGUIContainer,
} = require("../../../../laser/titan/client/common/flash/DropGUIContainer");
const { StringTable } = require("../../../../laser/client/game/text/StringTable");
const { Localisation } = require("../../../localisation/Localisation");
const { LogicMemory } = require("../../../logic/LogicMemory");
const { BSDPlusManager } = require("../../../validation/BSDPlusManager");
const { Config } = require("../../../config/Config");
const ModConfiguration = require("../../../modconfiguration/ModConfiguration");
const { EDebugger } = require("../../../debug/EDebugger");

const toggleIdOffset = LogicMemory.offset(224);
const toggleStateOffset = LogicMemory.offset(240);
const itemDescriptionOffset = LogicMemory.offset(241);
const toggleButtonPointerOffset = LogicMemory.offset(242);

const EModItem = {};
[
  "BATTLE_TEXT_CHAT",
  "PIN_ANIMATION",
  "CHROMATIC_NAME",
  "SHARED_BACKGROUND",
  "BATTLE_BLACK_BARS",
  "SLOW_MODE",
  "MOD_PINS",
  "RANDOM_THEMES_S1",
  "RANDOM_THEMES_S2",
  "RANDOM_THEMES_S3",
  "FRIENDLY_ROOM_OPPONENTS",
  "FPS_COUNTER",
  "BATTLE_CAMERA",
  "SPECTATE_BUTTON",
  "LOWRES_GRAPHICS",
  "HOMESCREEN_TEXT",
  "OWN_PLAYER_COORDINATES",
  "BATTLE_CONNECTION_INDICATOR",
  "SUPER_AIM",
  "SHAME_THUMBSDOWN",
  "MOD_MAPMAKER",
  "MOD_EMOJI_REMOVE",
  "DO_NOT_SHOW_BATTLE_HL",
  "MOD_BETTER_RANGE",
  "ENEMY_AMMO_STATUS",
  "BSD_PROXY",
  "TEAM_CHAT_ANTICENSOR",
  "HIDE_BATTLING_STATUS",
  "HL_LEON_CLONE",
  "COLORED_DAMAGE",
  "SHOW_CHARACTERS_IN_NAMES",
  "SHOW_FAST_PLAY_AGAIN_BUTTON",
  "SHOW_AUTO_PLAY_AGAIN_RADIO_BUTTON",
  "BATTLE_PROXY",
  "SHOW_LASER_LOGS",
  "FRIEND_LIST_OPTIMIZATION",
  "INSTANT_STARRDROP",
  "DISABLE_SHAKE",
  "BATTLE_END_INSTANT_EXIT",
  "BACKGROUND_MATCHMAKING",
  "MOD_OLD_RANK",
  "OLD_GLOWBERT_NAME",
  "ENFORCE_BATTLE_CHAT_BUTTON",
  "ANTI_AFK_KICK",
  "SHOW_MUTE_BUTTON",
  "EXTENDED_TRAJECTORY",
  "HITBOX_RENDERER",
  "ENEMY_TRACER",
  "ATTACK_RANGE_INDICATOR",
  "RANDOM_LOCALIZATION",
  "SHOW_TROPHIES_ABOVE_HEAD",
  "DEV_MODE_TOGGLE",
  "SHOW_DPS",
  "SHOW_SKIN_NAMES_IN_PROFILE",
  "ALLY_RESPAWN_TIMER",
  "ENFORCE_OLD_FRIENDS_LIST",
  "LEGACY_BACKGROUNDS",
  "TEAMMATE_HP_INDICATOR",
  "DISABLE_SKINS",
  "DEFAULT_ENVIRONMENTS",
  "DEBUG_MENU_BUTTON",
  "LEGACY_NAMES",
  "SHOW_FRIENDS_IN_BATTLE",
  "SHOW_ALLIANCE_MEMBERS_IN_BATTLE",
].forEach((name, value) => {
  EModItem[(EModItem[name] = value)] = name;
});

const EBehaviour = {};
EBehaviour[(EBehaviour.SWITCH = 0)] = "SWITCH";
EBehaviour[(EBehaviour.CUSTOM_MOD = 1)] = "CUSTOM_MOD";

class ModConfigurationItem extends DropGUIContainer {
  constructor(configuration) {
    super(null, ModConfigurationItem.allocationSize);
    this.configuration = configuration;

    const movieClip = StringTable.getMovieClip("sc/ui.sc", "modifier_item");
    this.setMovieClip(movieClip);
    movieClip.setInteractiveRecursive(true);

    const toggleButton = this.addGameButton("mod_toggle", true);
    const toggleMovieClip = toggleButton.getMovieClip();
    toggleButton.instance.add(toggleIdOffset).writeU8(configuration.id);
    toggleButton.instance.add(toggleStateOffset).writeU8(+configuration.key);
    this.toggleButton = toggleButton;
    toggleButton.setCustomButtonListener(this.buttonPressed, configuration.infoPrefix);
    this.instance.add(toggleButtonPointerOffset).writePointer(toggleButton.instance);

    toggleMovieClip.setText("text_on", StringTable.getString("TID_SETTINGS_ON"));
    toggleMovieClip.setText("text_off", StringTable.getString("TID_SETTINGS_OFF"));
    toggleMovieClip.gotoAndStopFrameIndex(+!configuration.key);

    const title = movieClip.getTextFieldByName("mod_title");
    const description = movieClip.getTextFieldByName("mod_desc");
    this.instance.add(itemDescriptionOffset).writePointer(description.instance);
    title.setTextScaleIfNecessary(Localisation.getString(configuration.infoPrefix + "_name"));

    const descriptionText = Localisation.getString(configuration.infoPrefix + "_descEnabled");
    const plusOnly =
      configuration.isBSDPlusOnly && !BSDPlusManager.isBSDPlusEnabled
        ? " <cFFC040>" + Localisation.getString("BSDPlusOnly") + "</c>"
        : "";
    description.colorTag = true;
    description.setTextScaleIfNecessary(descriptionText + plusOnly);

    const placeholder = movieClip.getMovieClipByName("icon_ph");
    placeholder.visibility = false;
    const placeholderHeight = placeholder.height;
    let icon = null;
    try {
      if (configuration.iconCallback) icon = configuration.iconCallback();
    } catch (error) {
      EDebugger.addMessage(
        EDebugger.ERROR,
        "Couldn't load icon for ".concat(this.configuration.configKey, "\n", error.stack),
      );
    } finally {
      if (!icon) {
        icon = StringTable.getMovieClip("sc/ui.sc", "questionmark_overlay");
      }
    }

    const iconHeight = icon.height;
    icon.scale = placeholderHeight / iconHeight;
    const [x, y] = [placeholder.x, placeholder.y];
    icon.setPixelSnappedXY(x, y);
    movieClip.addChild(icon.instance);
  }

  buttonPressed(_argument0, pointer) {
    const { ModConfigurationPopup } = ModConfiguration;
    const id = pointer.add(toggleIdOffset).readU8();
    const item = ModConfigurationPopup.getItemById(id);
    if (!item) {
      EDebugger.addMessage(EDebugger.ERROR, `Item with id ${id} not found!`);
      return;
    }

    if (item.configuration.isBSDPlusOnly && !BSDPlusManager.isBSDPlusEnabled) {
      BSDPlusManager.showBSDPlusOnlyNativeDialog();
      return;
    }

    const state = Boolean(pointer.add(toggleStateOffset).readU8());
    switch (item.configuration.behaviour) {
      case EBehaviour.CUSTOM_MOD: {
        const payload = item.configuration.payload;
        if (!payload) return;
        const list = Config.config[item.configuration.configKey];
        if (list.includes(payload)) {
          Config.config[item.configuration.configKey] = list.filter((entry) => entry !== payload);
        } else {
          list.push(payload);
        }
        break;
      }
      case EBehaviour.SWITCH:
        if (item.configuration.key && item.configuration.setState) {
          item.configuration.setState(!item.configuration.key);
        }
        break;
      default:
        Config.config[item.configuration.configKey] = !state;
        break;
    }

    pointer.add(toggleStateOffset).writeU8(+!state);
    item.toggleButton.getMovieClip().gotoAndStopFrameIndex(+state);

    if (item.configuration.shouldReloadGame) {
      ModConfigurationPopup.shouldReloadGame = true;
    }
    if (item.configuration.shouldGoToHomeScreen) {
      ModConfigurationPopup.shouldGoToHomeScreen = true;
    }
    if (item.configuration.shouldReopenSettingsPopup) {
      ModConfigurationPopup.shouldReopenSettingsPopup = true;
    }
    if (item.configuration.showShowRestartRequiredDialog) {
      ModConfigurationPopup.showShowRestartRequiredDialog = true;
    }

    if (!item.configuration.callback) return;
    if (
      ModConfigurationPopup.pendingCallbacks.find(
        (entry) => entry.item.id === item.configuration.id,
      )
    ) {
      ModConfigurationPopup.pendingCallbacks = ModConfigurationPopup.pendingCallbacks.filter(
        (entry) => entry.item.id !== item.configuration.id,
      );
    } else {
      ModConfigurationPopup.pendingCallbacks.push({ item, state });
    }
  }
}

ModConfigurationItem.allocationSize = 264;

exports.EModItem = EModItem;
exports.EBehaviour = EBehaviour;
exports.ModConfigurationItem = ModConfigurationItem;
