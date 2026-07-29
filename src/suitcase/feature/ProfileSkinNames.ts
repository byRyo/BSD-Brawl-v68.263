// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileSkinNames = void 0;
const Config_1 = require("../config/Config");
const StringObject_1 = require("../../laser/titan/client/native/StringObject");
const LogicData_1 = require("../../laser/client/logic/data/LogicData");
const StringTable_1 = require("../../laser/client/game/text/StringTable");
class ProfileSkinNames {
  static patch() {
    if (!this.hookInstalled) {
      this.hookInstalled = true;
      Interceptor.attach(StringTable_1.StringTable_getString, {
        onEnter(args) {
          if (
            !Config_1.Config.config.ShowSkinNamesInProfile ||
            ProfileSkinNames.characterTIDStringToSkinTID.size === 0
          )
            return;
          try {
            const tid = StringObject_1.StringObject.read(args[0]);
            if (tid === null) return;
            const replacement = ProfileSkinNames.characterTIDStringToSkinTID.get(tid);
            if (replacement !== undefined) args[0] = replacement;
          } catch (_) {}
        },
      });
    }
  }
  static onProfileDecoded(entries) {
    this.characterTIDStringToSkinTID.clear();
    if (!Config_1.Config.config.ShowSkinNamesInProfile) return;
    for (const entry of entries) {
      try {
        if (entry.skin === null || entry.character.instance.equals(entry.skin.instance)) continue;
        const characterTid = LogicData_1.LogicData.getTIDPointer(entry.character.instance);
        const skinTid = LogicData_1.LogicData.getTIDPointer(entry.skin.instance);
        if (characterTid.isNull() || skinTid.isNull()) continue;
        const characterText = StringObject_1.StringObject.read(characterTid);
        if (characterText === null || characterText.length === 0) continue;
        const skinText = StringObject_1.StringObject.read(skinTid);
        if (skinText === null || skinText.length === 0) continue;
        this.characterTIDStringToSkinTID.set(characterText, skinTid);
      } catch (_) {}
    }
  }
}
exports.ProfileSkinNames = ProfileSkinNames;
ProfileSkinNames.characterTIDStringToSkinTID = new Map();
ProfileSkinNames.hookInstalled = false;
