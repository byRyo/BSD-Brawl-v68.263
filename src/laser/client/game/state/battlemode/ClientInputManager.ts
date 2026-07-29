// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Config } = require("../../../../../suitcase/config/Config");
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const { BattleMode } = require("./BattleMode");

const addInputNative = new NativeFunction(Libg.offset(8318548, 8001580), "void", [
  "pointer",
  "pointer",
]);
const inputTypeOffset = LogicMemory.offset(8);

class ClientInputManager {
  static addInput(input) {
    addInputNative(BattleMode.clientInputManager, input.instance);
  }
  static patch() {
    Interceptor.replace(
      addInputNative,
      new NativeCallback(
        (manager, input) => {
          const type = input.add(inputTypeOffset).readInt();
          if (ClientInputManager.shootClientInputType.includes(type)) {
            ClientInputManager.currentShootClientInputType = type;
          }
          if (!(Config.config.HideSuperAim && type === 5)) {
            addInputNative(BattleMode.clientInputManager, input);
          }
        },
        "void",
        ["pointer", "pointer"],
      ),
    );
  }
}

ClientInputManager.type = {
  Attack: 0,
  Ulti: 1,
  Movement: 2,
  StopMovement: 3,
  EndBattle: 4,
  UltiEnable: 5,
  UltiDisable: 6,
  CarryableAim: 7,
  Accessory: 8,
  Emote: 9,
  ControlledProjectileStopWithStick: 10,
  ToggleEditing: 11,
  LeaveFromBattle: 12,
  StopHoldSkill: 13,
  StartHoldSkill: 14,
  Spray: 15,
  Overcharge: 17,
  BonusSkill: 18,
};
ClientInputManager.shootClientInputType = [
  ClientInputManager.type.Attack,
  ClientInputManager.type.Ulti,
  ClientInputManager.type.Accessory,
];
ClientInputManager.currentShootClientInputType = -1;

exports.ClientInputManager = ClientInputManager;
