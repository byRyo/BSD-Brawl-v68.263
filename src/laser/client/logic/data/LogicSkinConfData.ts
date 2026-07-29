// @ts-nocheck
const { LogicData } = require("./LogicData");
const { LogicCharacterData } = require("./LogicCharacterData");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { Libg } = require("../../../../lib/Libg");
const { LogicDataTables } = require("./LogicDataTables");
const { Config } = require("../../../../suitcase/config/Config");
const { LogicArrayList } = require("./LogicArrayList");

const killEffectAddress = Libg.offset(11631624, 10711688);
const charactersOffset = LogicMemory.offset(88);

class LogicSkinConfData extends LogicData {
  getCharacter(index = 0) {
    const characters = new LogicArrayList(this.instance.add(charactersOffset));
    if (index < 0 || index > characters.getItemsCount()) return null;
    const instance = characters.getElement(index);
    return instance.isNull() ? null : new LogicCharacterData(instance);
  }
  static patch() {
    Interceptor.attach(killEffectAddress, {
      onLeave(retval) {
        if (Config.config.KillEffectType === "") return;
        const effect = LogicDataTables.getTable(LogicDataTables.table.Effects).getItemByName(
          Config.config.KillEffectType,
        );
        retval.replace(effect.instance);
      },
    });
  }
}
exports.LogicSkinConfData = LogicSkinConfData;
