// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { StringObject } = require("../../../titan/client/native/StringObject");
const { Player } = require("./Player");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { Config } = require("../../../../suitcase/config/Config");

const createPlayerDisplayDataHook = Libg.offset(12424896, 11334732);
const decodePlayerDisplayDataHook = Libg.offset(12853072, 11641072);
const createOwnPlayerDisplayDataHook = Libg.offset(12282556, 11222224);
const thumbnailOffset = LogicMemory.offset(20);
const nameColorOffset = LogicMemory.offset(24);
const chromaticNameOffset = LogicMemory.offset(28);
const playerDisplayNameColorOffset = LogicMemory.offset(32);
const ownPlayerDisplayNameColorOffset = LogicMemory.offset(32);
let creatingOwnPlayerDisplayData = false;

class PlayerDisplayData {
  constructor(instance) {
    this._instance = instance;
  }
  get name() {
    return StringObject.read(this._instance);
  }
  set name(value) {
    StringObject.create(value, this._instance);
  }

  static patch() {
    Interceptor.attach(createOwnPlayerDisplayDataHook, {
      onEnter() {
        creatingOwnPlayerDisplayData = true;
      },
      onLeave() {
        creatingOwnPlayerDisplayData = false;
      },
    });
    Interceptor.attach(createPlayerDisplayDataHook, {
      onEnter(args) {
        if (!creatingOwnPlayerDisplayData || !StringObject.read(args[1])) return;
        Player.ownName = StringObject.read(args[1]);
        Player.ownThumbnailID = args[3].add(thumbnailOffset).readU32();
        Player.ownNameColorID = args[4].isNull() ? 0 : args[4].add(nameColorOffset).readU32();
        if (Config.config.ChromaticName) args[5] = ptr(-2);
        if (Config.config.PlayerNameOverride) {
          args[1] = StringObject.create(Config.config.PlayerNameOverride);
        }
      },
    });
    Interceptor.attach(decodePlayerDisplayDataHook, {
      onEnter(args) {
        this.self = args[0];
      },
      onLeave() {
        const name = StringObject.read(this.self.readPointer());
        const thumbnail = this.self.add(thumbnailOffset).readU32();
        const nameColor = this.self.add(playerDisplayNameColorOffset).readU32();
        if (
          Config.config.ChromaticName &&
          name === Player.ownName &&
          thumbnail === Player.ownThumbnailID &&
          nameColor === Player.ownNameColorID
        ) {
          this.self.add(chromaticNameOffset).writeS32(-2);
        }
        if (Config.config.PlayerNameOverride && name === Player.ownName) {
          StringObject.create(Config.config.PlayerNameOverride, this.self.readPointer());
        }
      },
    });
  }
}

exports.PlayerDisplayData = PlayerDisplayData;
