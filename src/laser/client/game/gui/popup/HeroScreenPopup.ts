// @ts-nocheck
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const { Libg } = require("../../../../../lib/Libg");
const { Libc } = require("../../../../../lib/Libc");
const { SkinSelector } = require("../../../../../suitcase/feature/SkinSelector");
const { LogicSkinData } = require("../../../logic/data/LogicSkinData");
const { Breadcrumbs } = require("../../../../../suitcase/debug/Breadcrumbs");
const { LogicCharacterData } = require("../../../logic/data/LogicCharacterData");
const { Config } = require("../../../../../suitcase/config/Config");
const { GUI } = require("../GUI");
const { LogicDataTables } = require("../../../logic/data/LogicDataTables");

const HeroScreenPopup_ctorAddress = Libg.offset(9232380, 8749800);
const HeroScreenPopup_skinChanged = new NativeFunction(Libg.offset(9243492, 8757644), "void", [
  "pointer",
  "pointer",
]);
const characterDataOffset = LogicMemory.offset(816);
const skinDataOffset = LogicMemory.offset(448);
const skinCollectionIconOffset = LogicMemory.offset(600);
const heroModelOffset = LogicMemory.offset(616);
const popupTypeOffset = LogicMemory.offset(416);
const HeroScreenPopup_ctor = new NativeFunction(HeroScreenPopup_ctorAddress, "void", [
  "pointer",
  "pointer",
  "pointer",
  "int",
]);
const allocationSize = 936;

class HeroScreenPopup {
  static popupType = 26;
  static _instance;

  constructor(instance) {
    this.instance = instance;
    HeroScreenPopup._instance = instance;
  }

  static getInstance() {
    if (!this._instance || this._instance.isNull()) return null;
    return new HeroScreenPopup(this._instance);
  }

  static skinChanged(skin, instance) {
    const popup = GUI.getPopupByType(this.popupType);
    if (!popup.isNull()) HeroScreenPopup_skinChanged(instance ?? popup, skin.instance);
  }
  skinChanged(skin) {
    HeroScreenPopup.skinChanged(skin, this.instance);
  }
  getLogicCharacterData() {
    return new LogicCharacterData(this.instance.add(characterDataOffset).readPointer());
  }
  getLogicSkinData() {
    return new LogicSkinData(this.instance.add(skinDataOffset).readPointer());
  }
  setLogicSkinData(skin) {
    this.instance.add(skinDataOffset).writePointer(skin.instance);
  }
  getSkinCollectionIcon() {
    return this.instance.add(skinCollectionIconOffset).readPointer();
  }
  getHeroModel() {
    return this.instance.add(heroModelOffset).readPointer();
  }

  static show(character, skin = null) {
    const instance = Libc.calloc(allocationSize, 1);
    HeroScreenPopup_ctor(instance, character.instance, skin?.instance ?? NULL, 0);
    GUI.showPopup(instance, false, false, false);
  }

  static capturePopupTypeFromInstance(instance) {
    try {
      const type = instance.add(popupTypeOffset).readS32();
      if (type > 0 && type < 200) this.popupType = type;
    } catch (_) {}
  }

  static patch() {
    Interceptor.attach(HeroScreenPopup_ctorAddress, {
      onEnter(args) {
        HeroScreenPopup._instance = args[0];
        HeroScreenPopup.capturePopupTypeFromInstance(args[0]);
        Breadcrumbs.push(`HeroScreenPopup::ctor type=${HeroScreenPopup.popupType}`);
        if (SkinSelector.isInUse()) this.entry = new HeroScreenPopup(args[0]);
      },
      onLeave() {
        if (!SkinSelector.isInUse()) return;
        const characterName = this.entry.getLogicCharacterData().getName();
        if (!Config.config.SkinOverrides.hasOwnProperty(characterName)) return;
        const skinName = Config.config.SkinOverrides[characterName];
        const skin = LogicDataTables.getSkinByName(skinName);
        Breadcrumbs.push(
          `skinChanged: char=${characterName} skin=${skinName} ptr=${skin?.instance}`,
        );
        if (skin && !skin.instance.isNull()) {
          try {
            this.entry.skinChanged(skin);
            this.entry.setLogicSkinData(skin);
          } catch (_) {}
        }
      },
    });
  }
}

module.exports = { HeroScreenPopup };
