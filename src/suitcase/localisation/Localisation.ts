// @ts-nocheck
const { FileManager } = require("../filesystem/FileManager");
const { ModProperties } = require("../config/ModProperties");

class Localisation {
  static get languageCode() {
    return this._languageCode;
  }

  static set languageCode(value) {
    if (!value || value.length === 0) value = "en";
    this._languageCode = value;
  }

  static init() {
    try {
      const contents = FileManager.readAAsset("bsd/credits.json", "r");
      if (contents) {
        const credits = JSON.parse(contents);
        const modName = credits.LobbyCreditModName;
        const socials = credits.LobbyCreditSocials;
        const serverCredit = credits.ServerConnectionCredit;
        const aboutCaptions = credits.AboutModCaptions;

        if (modName) this.jointModName = " & ".concat(modName);
        if (socials) this.jointModSocials = "".concat(socials, "\n");
        if (serverCredit) {
          this.jointModServerConnectionCredit = "\n".concat(serverCredit, "\nㅤ");
        }
        if (aboutCaptions) {
          this.jointModAboutScreen = "\n".concat(aboutCaptions, "\n");
        }
      }
    } catch (error) {
      console.error("Failed to initialize localization credits:", error);
    }
  }

  static getString(key) {
    if (this.localizationObject.hasOwnProperty(key)) {
      return this.localizationObject[key];
    }
    return key;
  }

  static getPatchNotesForCurrentVersion() {
    const notes = this.patchNotes[ModProperties.showPatchNotesFor];
    if (notes) {
      if (notes.hasOwnProperty(this.languageCode)) {
        return notes[this.languageCode];
      }
      return "";
    }
    return this.getString("NoChangelogs");
  }
}

Localisation._languageCode = "";
Localisation.jointModAboutScreen = "";
Localisation.jointModName = "";
Localisation.jointModServerConnectionCredit = "";
Localisation.jointModSocials = "";
Localisation.isLanguageIndexSet = false;
Localisation.localizationObject = {};
Localisation.patchNotes = {
  "32.0": { EN: "Refactored!", RU: "Рефактор!" },
};

exports.Localisation = Localisation;
