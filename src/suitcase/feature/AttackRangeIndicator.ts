// @ts-nocheck
const { Libg } = require("../../lib/Libg");
const { LogicMemory } = require("../logic/LogicMemory");
const { Config } = require("../config/Config");
const { BattleMode } = require("../../laser/client/game/state/battlemode/BattleMode");
const { LogicBattleModeClient } = require("../../laser/client/logic/mode/LogicBattleModeClient");
const { ColorTransform } = require("../../laser/titan/client/common/flash/ColorTransform");
const { LogicData } = require("../../laser/client/logic/data/LogicData");
const { LogicCharacterData } = require("../../laser/client/logic/data/LogicCharacterData");
const { LogicCharacterClient } = require("../../laser/client/logic/battle/LogicCharacterClient");
const { BattleScreen } = require("../../laser/client/game/screen/battle/BattleScreen");
const { DisplayObject } = require("../../laser/titan/client/common/flash/DisplayObject");
const setSpriteFrame = new NativeFunction(Libg.offset(10340436, 9700904), "void", [
  "pointer",
  "float",
  "float",
  "float",
  "float",
  "float",
]);
const spriteOffsets = [2760, 2768, 2776, 2784, 2792];
const spriteXOffset = LogicMemory.offset(136),
  spriteYOffset = LogicMemory.offset(140),
  spriteFlagsOffset = LogicMemory.offset(144);
const MAX_OBJECTS = 100,
  RANGE_SCALE = 50,
  POSITION_SCALE_X = 16,
  POSITION_SCALE_Y = 16;
class AttackRangeIndicator {
  static patch() {
    Interceptor.attach(BattleScreen.updateSkillAddress, {
      onEnter(args) {
        this.battleScreen = args[0];
      },
      onLeave() {
        if (Config.config.AttackRangeIndicator)
          try {
            AttackRangeIndicator.update(this.battleScreen);
          } catch (_) {}
      },
    });
  }
  static reset() {}
  static isValidPointer(pointer) {
    return !pointer.isNull() && pointer.compare(ptr(0x100000)) > 0;
  }
  static update(battleScreen) {
    if (!this.isValidPointer(battleScreen)) return;
    const modePointer = BattleMode.getLogicBattleModeClient();
    if (!this.isValidPointer(modePointer)) return;
    const mode = new LogicBattleModeClient(modePointer),
      objects = mode.getGameObjects(),
      array = objects.getArray();
    if (!this.isValidPointer(array)) return;
    const count = objects.getItemsCount();
    if (count <= 0 || count > MAX_OBJECTS) return;
    const ownTeam = mode.ownPlayerTeam,
      own = LogicBattleModeClient.getOwnCharacter();
    const ownX = own.instance.isNull() ? 0 : own.x,
      ownY = own.instance.isNull() ? 0 : own.y;
    const sprites = this.collectFreeRangeSprites(battleScreen);
    let used = 0;
    for (let i = 0; i < count && used < sprites.length; i++)
      try {
        const pointer = array.add(8 * i).readPointer();
        if (!this.isValidPointer(pointer)) continue;
        const character = new LogicCharacterClient(pointer),
          dataPointer = character.dataPtr;
        if (
          !this.isValidPointer(dataPointer) ||
          new LogicData(dataPointer).getClassID() !== 16 ||
          character.teamIndex === ownTeam
        )
          continue;
        const data = new LogicCharacterData(dataPointer);
        if (!data.isHero() || !data.weaponSkill) continue;
        const range = data.weaponSkill.getCastingRangeTiles();
        if (range <= 0 || (character.x === 0 && character.y === 0)) continue;
        const sprite = sprites[used++];
        this.positionSprite(sprite, character.x, character.y);
        setSpriteFrame(sprite, 0, range * 0.16, 1, 0, 0);
        new DisplayObject(sprite).visibility = 1;
        const radius = range * RANGE_SCALE,
          dx = ownX - character.x,
          dy = ownY - character.y;
        if (dx * dx + dy * dy > radius * radius)
          ColorTransform.setColorDual(sprite, 96, 255, 96, 24, 0, 255, 0);
        else ColorTransform.setColorDual(sprite, 255, 64, 64, 32, 255, 0, 0);
      } catch (_) {}
  }
  static collectFreeRangeSprites(screen) {
    const result = [];
    for (const offset of spriteOffsets) {
      const pointer = screen.add(offset).readPointer();
      if (this.isValidPointer(pointer) && new DisplayObject(pointer).visibility === 0)
        result.push(pointer);
    }
    return result;
  }
  static positionSprite(sprite, x, y) {
    sprite.add(spriteXOffset).writeFloat(x);
    sprite.add(spriteYOffset).writeFloat(y);
    sprite.add(spriteFlagsOffset).writeS32(0);
    const display = new DisplayObject(sprite);
    display.setXY(x * POSITION_SCALE_X, y * POSITION_SCALE_Y);
    display.scale = 1;
  }
}
exports.AttackRangeIndicator = AttackRangeIndicator;
