// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { Config } = require("../../../../suitcase/config/Config");
const { Breadcrumbs } = require("../../../../suitcase/debug/Breadcrumbs");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { DisplayObject } = require("../../../titan/client/common/flash/DisplayObject");
const { MovieClip } = require("../../../titan/client/common/flash/MovieClip");
const { Sprite } = require("../../../titan/client/common/flash/Sprite");
const { TextField } = require("../../../titan/client/common/flash/TextField");
const { LogicCharacterClient } = require("../../logic/battle/LogicCharacterClient");
const { LogicSkinData } = require("../../logic/data/LogicSkinData");
const { StartLoadingMessage } = require("../network/messaging/message/StartLoadingMessage");
const { StringTable } = require("../text/StringTable");
const { GameObject } = require("./GameObject");

const floatingNumberHook = Libg.offset(5371028, 5457476);
const characterCtorHook = Libg.offset(5420332, 5499464);
const characterUpdateHook = Libg.offset(5444184, 5522312);
const skinOffset = LogicMemory.offset(1408);
const heroHudClipOffsets = [
  LogicMemory.offset(1408),
  LogicMemory.offset(1304),
  LogicMemory.offset(1312),
  LogicMemory.offset(1296),
  LogicMemory.offset(1104),
  LogicMemory.offset(1264),
  LogicMemory.offset(1272),
  LogicMemory.offset(1120),
  LogicMemory.offset(1128),
  LogicMemory.offset(2872),
];
const visibilityOffset = LogicMemory.offset(8);
const ammoStatusOffset = LogicMemory.offset(2824);
const trophyDisplays = new Map();

class Character extends GameObject {
  static addFloatingNumberListener(listener) {
    this.floatingNumberListeners.push(listener);
  }

  static applyHeroHudVisibility(character, visible) {
    for (const offset of this.heroHudClipOffsets) {
      const clip = character.add(offset).readPointer();
      if (!clip.isNull()) clip.add(visibilityOffset).writeU8(+visible);
    }
  }

  get skin() {
    const instance = this.instance.add(skinOffset).readPointer();
    return instance.isNull() ? null : new LogicSkinData(instance);
  }
  set skin(value) {
    if (value !== null) this.instance.add(skinOffset).writePointer(value.instance);
  }
  get logic() {
    return new LogicCharacterClient(this.logicPtr);
  }

  static patch() {
    Interceptor.attach(floatingNumberHook, {
      onEnter(args) {
        try {
          const character = new Character(args[0]);
          const value = args[1].toInt32();
          for (const listener of Character.floatingNumberListeners) {
            try {
              listener(character, value);
            } catch (_) {}
          }
        } catch (_) {}
      },
    });

    Interceptor.attach(characterCtorHook, {
      onEnter(args) {
        this.character = args[0];
        Breadcrumbs.push("Character::ctor");
      },
      onLeave() {
        const movieClipPtr = this.character.add(heroHudClipOffsets[0]).readPointer();
        if (movieClipPtr.isNull()) return;
        const playerName = new MovieClip(movieClipPtr).getTextFieldByName("player_name");
        if (playerName) {
          playerName.colorTag = true;
          playerName.setTextScaleIfNecessary(playerName.text);
        }
        try {
          const textField = StringTable.getMovieClip(
            "sc/ui.sc",
            "popover_text_left",
          ).getTextFieldByName("text");
          if (!textField) return;
          textField.color = 4294956800;
          textField.fontOutline = true;
          textField.fontSize = 16;
          textField.align = 0;
          textField.visibility = false;
          new Sprite(movieClipPtr).addChildAt(textField, 0);

          const icon = StringTable.getMovieClip("sc/ui.sc", "icon_trophy");
          icon.scale = 0.15;
          icon.visibility = false;
          new Sprite(movieClipPtr).addChildAt(icon, 0);
          trophyDisplays.set(this.character.toString(), {
            textField: textField.instance,
            icon: icon.instance,
          });
        } catch (_) {}
      },
    });

    Interceptor.attach(characterUpdateHook, {
      onEnter(args) {
        this.self = args[0];
      },
      onLeave() {
        const character = this.self;
        const key = character.toString();
        if (Character.heroHudHidden) {
          Character.applyHeroHudVisibility(character, false);
          Character.heroHudCharactersToRestore.add(key);
          return;
        }
        if (Character.heroHudCharactersToRestore.has(key)) {
          Character.heroHudCharactersToRestore.delete(key);
          Character.applyHeroHudVisibility(character, true);
        }

        if (Config.config.ShowEnemyAmmoStatus) {
          const ammoStatus = character.add(ammoStatusOffset).readPointer();
          if (!ammoStatus.isNull()) new MovieClip(ammoStatus).visibility = true;
        }
        if (!Config.config.ShowTrophiesAboveHead) return;
        const display = trophyDisplays.get(key);
        if (!display) return;
        const trophyText = new TextField(display.textField);
        const trophyIcon = new DisplayObject(display.icon);
        if (StartLoadingMessage.playerTrophies.size === 0) return;

        const playerNameClip = character.add(heroHudClipOffsets[0]).readPointer();
        if (playerNameClip.isNull()) return;
        const playerNameField = new MovieClip(playerNameClip).getTextFieldByName("player_name");
        if (!playerNameField) return;
        const name = playerNameField.text;
        const totalTrophies = Character.findTrophiesForName(name, true);
        const characterTrophies = Character.findTrophiesForName(name, false);
        const values = [];
        if (totalTrophies !== null) values.push(totalTrophies.toString());
        if (characterTrophies !== null) values.push(characterTrophies.toString());
        if (values.length !== 0) {
          trophyText.text = values.join(" / ");
          const hasLowerHudClip = Character.heroHudClipOffsets.slice(0, 8).some((offset) => {
            const clip = character.add(offset).readPointer();
            return !clip.isNull() && clip.add(visibilityOffset).readU8() === 1;
          });
          const yOffset = hasLowerHudClip ? -45 : -20;
          trophyText.x = playerNameField.x - 20;
          trophyText.y = playerNameField.y + yOffset;
          trophyText.visibility = true;
          trophyIcon.x = trophyText.x - 15;
          trophyIcon.y = trophyText.y + 7;
          trophyIcon.visibility = true;
          return;
        }
        trophyDisplays.delete(key);
      },
    });
  }

  static findTrophiesForName(name, total) {
    const trophies = total
      ? StartLoadingMessage.playerCharacterTrophies
      : StartLoadingMessage.playerTrophies;
    for (const [playerName, value] of trophies) {
      if (name.includes(playerName)) return value;
    }
    return null;
  }
}

Character.floatingNumberListeners = [];
Character._childrenLogged = false;
Character._childCountLogged = false;
Character.heroHudHidden = false;
Character.heroHudCharactersToRestore = new Set();
Character.heroHudClipOffsets = heroHudClipOffsets;
exports.Character = Character;
