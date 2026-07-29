// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { HashTagCodeGenerator } = require("../utils/HashTagCodeGenerator");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { PlayerDisplayData } = require("./PlayerDisplayData");
const { LogicLong } = require("../../logic/LogicLong");
const { CustomMarks } = require("../../../../suitcase/feature/CustomMarks");
const { LogicCharacterData } = require("../../logic/data/LogicCharacterData");
const { LogicSkinData } = require("../../logic/data/LogicSkinData");
const { ProfileSkinNames } = require("../../../../suitcase/feature/ProfileSkinNames");

const decodeProfileNative = new NativeFunction(Libg.offset(12586984, 11449664), "void", [
  "pointer",
  "pointer",
]);
const displayDataOffset = LogicMemory.offset(48);
const brawlerEntriesOffset = LogicMemory.offset(120);
const titleOffset = LogicMemory.offset(24);
const vectorCountOffset = 12;
const entryCharacterOffset = 0;
const entrySkinOffset = 8;
const entryTrophiesOffset = 36;

class PlayerProfile {
  constructor(instance) {
    this._instance = instance;
  }
  get accountId() {
    return new LogicLong(this._instance);
  }
  get displayData() {
    const instance = this._instance.add(displayDataOffset).readPointer();
    if (!instance.isNull()) return new PlayerDisplayData(instance);
  }
  get title() {
    return this._instance.add(titleOffset).readPointer();
  }

  getBrawlerEntries() {
    const result = [];
    const vector = this._instance.add(brawlerEntriesOffset).readPointer();
    if (vector.isNull()) return result;
    const entries = vector.readPointer();
    const count = vector.add(vectorCountOffset).readU32();
    if (entries.isNull()) return result;
    for (let index = 0; index < count; index++) {
      const entry = entries.add(index * Process.pointerSize).readPointer();
      if (entry.isNull()) continue;
      const character = entry.add(entryCharacterOffset).readPointer();
      if (character.isNull()) continue;
      const skin = entry.add(entrySkinOffset).readPointer();
      result.push({
        character: new LogicCharacterData(character),
        skin: skin.isNull() ? null : new LogicSkinData(skin),
        trophies: entry.add(entryTrophiesOffset).readInt(),
      });
    }
    return result;
  }

  static patch() {
    Interceptor.replace(
      decodeProfileNative,
      new NativeCallback(
        (instance, stream) => {
          decodeProfileNative(instance, stream);
          const profile = new PlayerProfile(instance);
          ProfileSkinNames.onProfileDecoded(profile.getBrawlerEntries());
          const tag = HashTagCodeGenerator.convertLongToPlayerTag(profile.accountId);
          if (CustomMarks.hasMark(tag)) {
            const displayData = profile.displayData;
            if (displayData) {
              displayData.name = "".concat(
                CustomMarks.getMarkDefinitionFor(tag),
                " ",
                displayData.name,
              );
            }
          }
        },
        "void",
        ["pointer", "pointer"],
      ),
    );
  }
}

exports.PlayerProfile = PlayerProfile;
