// @ts-nocheck
const { Libg } = require("../../../../../../lib/Libg");
const { LogicMemory } = require("../../../../../../suitcase/logic/LogicMemory");
const { HomeMode } = require("../../../state/homemode/HomeMode");
const { GameStateManager } = require("../../../state/GameStateManager");

const openDeleteAccount = new NativeFunction(Libg.offset(10135304, 9524412), "void", []);
const toggleHidePlayerProfile = new NativeFunction(Libg.offset(10134580, 9524140), "void", [
  "pointer",
]);
const preferencesOffset = LogicMemory.offset(704, 824);
const hideProfileBit = 2;

class SettingsPrivacyScreen {
  static openDeleteAccount() {
    openDeleteAccount(NULL);
  }
  static toggleHidePlayerProfile() {
    if (HomeMode.getInstance() !== null) toggleHidePlayerProfile();
  }
  static isHidePlayerProfileEnabled() {
    const preferences = this.getPreferences();
    return !preferences.isNull() && !!((preferences.readU8() >> hideProfileBit) & 1);
  }
  static getPreferences() {
    const avatar = GameStateManager.getPlayerAvatar();
    if (avatar.instance.isNull()) return NULL;
    return avatar.instance.add(preferencesOffset).readPointer();
  }
}

exports.SettingsPrivacyScreen = SettingsPrivacyScreen;
