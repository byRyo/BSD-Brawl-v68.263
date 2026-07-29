// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleScreen = void 0;

const { Libg } = require("../../../../../lib/Libg");
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const { Sprite } = require("../../../../titan/client/common/flash/Sprite");
const { CombatHUD } = require("../../gui/CombatHUD");
const { Config } = require("../../../../../suitcase/config/Config");
const { BattleCameraButton } = require("../../../../../suitcase/flash/button/BattleCameraButton");
const { BattleCoordinates } = require("../../../../../suitcase/modconfiguration/BattleCoordinates");
const { PlayerInfo } = require("../../friends/PlayerInfo");
const { BattleChat } = require("../../../../../suitcase/modconfiguration/BattleChat");
const { BattleChatButton } = require("../../../../../suitcase/flash/button/BattleChatButton");
const {
  BattleClearChatButton,
} = require("../../../../../suitcase/flash/button/BattleClearChatButton");
const { BattleCamera } = require("../../../../../suitcase/feature/BattleCamera");
const { ThemeSelectorManager } = require("../../../../../suitcase/modmenu/ThemeSelector");
const {
  BattleFastPlayAgainButton,
} = require("../../../../../suitcase/flash/button/BattleFastPlayAgainButton");
const { BattleLatency } = require("../../../../../suitcase/modconfiguration/BattleLatency");
const {
  BattleAutoPlayAgainRadioButton,
} = require("../../../../../suitcase/flash/button/BattleAutoPlayAgainRadioButton");
const {
  BattleSkipTutorialButton,
} = require("../../../../../suitcase/flash/button/BattleSkipTutorialButton");
const { BattleMode } = require("../../state/battlemode/BattleMode");
const { AttackRangeIndicator } = require("../../../../../suitcase/feature/AttackRangeIndicator");
const { LogicBattleModeClient } = require("../../../logic/mode/LogicBattleModeClient");
const { Breadcrumbs } = require("../../../../../suitcase/debug/Breadcrumbs");
const { TrajectoryExtender } = require("../../../../../suitcase/feature/TrajectoryExtender");
const { Character3D } = require("../../renderer3d/Character3D");
const { BSDPlusManager } = require("../../../../../suitcase/validation/BSDPlusManager");
const { DamageTracker } = require("../../../../../suitcase/feature/DamageTracker");
const { GameObjectManager } = require("../../gameobject/GameObjectManager");
const { LogicSkillData } = require("../../../logic/data/LogicSkillData");

const battleScreenEnter = new NativeFunction(Libg.offset(8735568, 8331100), "void", ["pointer"]);
const battleScreenCreateAddress = Libg.offset(8528988, 8165996);
const battleScreenExit = new NativeFunction(Libg.offset(8747868, 8342160), "void", ["pointer"]);
const battleScreenTrajectoryRenderAddress = Libg.offset(8837472, 8428952);
const battleScreenSendGoHome = new NativeFunction(Libg.offset(8825416, 8417624), "void", [
  "pointer",
  "bool",
  "bool",
  "bool",
  "bool",
]);
const battleScreenExitAddress = Libg.offset(8835780, 8428068);
const battleScreenTrajectoryHookAddress = Libg.offset(8838408, 8429856);
const battleScreenTrajectory = new NativeFunction(Libg.offset(8853472, 8444964), "void", [
  "pointer",
  "pointer",
  "pointer",
  "int",
  "pointer",
  "float",
  "float",
  "float",
  "float",
  "float",
  "float",
]);
const updateSkillAddress = Libg.offset(8799892, 8391668);
const battleScreenUpdateAddress = Libg.offset(8765568, 8360308);
const toggleFollowSpectateNative = new NativeFunction(Libg.offset(8750532, 8344492), "void", [
  "pointer",
]);
const trajectoryNative = new NativeFunction(Libg.offset(10510784, 9838944), "void", [
  "pointer",
  "pointer",
  "float",
  "double",
]);

const followSpectateOffset = LogicMemory.offset(4012, 4164);
const combatHUDOffset = LogicMemory.offset(2536);
const gameObjectManagerOffset = LogicMemory.offset(2560, 2728);
const blackBarOffset1 = LogicMemory.offset(288);
const blackBarOffset2 = LogicMemory.offset(296);
const blackBarOffset3 = LogicMemory.offset(304);
const blackBarOffset4 = LogicMemory.offset(312);
const mainPathSpriteOffset = LogicMemory.offset(2800);
const pathSpriteOffset1 = LogicMemory.offset(2808);
const pathSpriteOffset2 = LogicMemory.offset(2816);
const hasBallOffset = LogicMemory.offset(684);
const pathSpriteVisibleOffset = LogicMemory.offset(8);
const tileMapWidthOffset = LogicMemory.offset(196);
const tileMapHeightOffset = LogicMemory.offset(200);

const tileSize = 300;
const pathSpriteRedOffset = 10;
const pathSpriteGreenOffset = 11;
const pathSpriteRedMultiplierOffset = 13;
const pathSpriteGreenMultiplierOffset = 14;
const pathSpriteBlueMultiplierOffset = 15;
const goalDepth = 1050;
const goalWidth = 2100;
const extendedGoalDifference = 100;
const unusedZero = 0;
const trajectoryPointSize = 12;
const unusedEight = 8;
const ballCastingRange = 48;
const ballTotalRange = 9600;
const rangeUnit = 100;
const unusedFour = 4;
const unusedZero2 = 0;
const trajectoryExtensionRange = 1500;

class BattleScreen {
  static getInstance() {
    return this.instance;
  }

  static getCombatHUD() {
    return new Sprite(this.getInstance().add(combatHUDOffset).readPointer());
  }

  static getGameObjectManager() {
    return new GameObjectManager(this.getInstance().add(gameObjectManagerOffset).readPointer());
  }

  static addEnterListener(listener) {
    BattleScreen.enterListeners.push(listener);
  }

  static addExitListener(listener) {
    BattleScreen.exitListeners.push(listener);
  }

  static addUpdateListener(listener) {
    BattleScreen.updateListeners.push(listener);
  }

  static dispatchListeners(listeners) {
    for (const listener of listeners) listener();
  }

  static patch() {
    Interceptor.attach(battleScreenEnter, {
      onEnter() {
        BattleScreen.instance = this.context.x0;
        Breadcrumbs.push("BattleScreen::enter");
        ThemeSelectorManager.hideCustomBackground();
      },
    });

    Interceptor.attach(battleScreenUpdateAddress, {
      onLeave() {
        BattleScreen.dispatchListeners(BattleScreen.updateListeners);
      },
    });

    Interceptor.attach(battleScreenCreateAddress, {
      onEnter() {
        BattleScreen.dispatchListeners(BattleScreen.enterListeners);
        const hud = BattleScreen.getCombatHUD();
        if (!hud.isNull()) {
          CombatHUD.battleChat && CombatHUD.battleChat.clear();

          if (Config.config.HideBattleBlackBars) {
            const offsets = [blackBarOffset1, blackBarOffset2, blackBarOffset3, blackBarOffset4];
            for (const offset of offsets) {
              const blackBar = hud.instance.add(offset).readPointer();
              blackBar.isNull() || blackBar.add(pathSpriteVisibleOffset).writeU8(0);
            }
          }

          if (Config.config.ShowBattleCameraButton) {
            const button = new BattleCameraButton();
            hud.addChild(button);
          }

          if (BattleMode.isPlayingTutorial) {
            const button = new BattleSkipTutorialButton();
            hud.addChild(button);
          }

          Config.config.ShowOwnPlayerCoordinates &&
            ((CombatHUD.coordinates = new BattleCoordinates()),
            hud.addChild(CombatHUD.coordinates.textField));

          if (Config.config.BattleTextChat && PlayerInfo.isInGameroom) {
            const battleChat = new BattleChat();
            battleChat.create(hud);
            const chatButton = new BattleChatButton();
            hud.addChild(chatButton);
            const clearChatButton = new BattleClearChatButton(battleChat);
            hud.addChild(clearChatButton);
          }

          Config.config.ShowBattleConnectionIndicator &&
            ((CombatHUD.latencyTextField = new BattleLatency()),
            hud.addChild(CombatHUD.latencyTextField.textField));

          Config.config.ShowDPS &&
            (DamageTracker.reset(), hud.addChild(DamageTracker.createTextField()));

          if (Config.config.ShowFastPlayAgainButton) {
            const button = new BattleFastPlayAgainButton();
            hud.addChild(button);
          }

          if (Config.config.ShowAutoPlayAgainRadioButton) {
            const button = new BattleAutoPlayAgainRadioButton();
            hud.addChild(button);
            hud.addChild(button.textField);
          }
        }
      },
    });

    Interceptor.replace(
      battleScreenExit,
      new NativeCallback(
        (value) => {
          Config.config.EnforceBattleChatButton && value.replace(ptr(1));
        },
        "void",
        ["pointer"],
      ),
    );

    Interceptor.attach(battleScreenExitAddress, {
      onLeave(value) {
        BattleScreen.dispatchListeners(BattleScreen.exitListeners);
        const hud = BattleScreen.getCombatHUD();
        if (!hud.isNull()) {
          CombatHUD.coordinates &&
            (hud.removeChild(CombatHUD.coordinates.textField), (CombatHUD.coordinates = null));
          CombatHUD.latencyTextField &&
            (hud.removeChild(CombatHUD.latencyTextField.textField),
            (CombatHUD.latencyTextField = null));
          CombatHUD.battleChat &&
            (CombatHUD.battleChat.clear(),
            CombatHUD.battleChat.destroy(),
            (CombatHUD.battleChat = null));
        }
        battleScreenExit(value);
        Breadcrumbs.push("BattleScreen::exit");
        CombatHUD.fastPlayAgainButton = null;
        CombatHUD.muteButton = null;
        BattleCamera.mode = 0;
        AttackRangeIndicator.reset();
        Character3D.flushSkinLogs();
        Config.config.RandomThemeMask[2] && ThemeSelectorManager.setRandomTheme();
      },
    });

    let trajectoryPoints = [];
    let trajectoryActive = false;
    let trajectoryHasBall = false;
    let trajectoryTotalRange = 0;
    let trajectoryInGoal = false;

    Interceptor.attach(battleScreenTrajectory, {
      onEnter() {
        if (!BSDPlusManager.isBSDPlusEnabled) return;
        const context = this.context;
        if (context.x3.toInt32() === 0) {
          this.outBuf = context.x8;
          this.active = true;
          this.hasBall = 1 === this.outBuf.add(hasBallOffset).readU8();
          this.skillData = context.x2;
        }
      },
      onLeave() {
        if (!BSDPlusManager.isBSDPlusEnabled) return;
        if (!this.active) return;

        const outBuf = this.outBuf;
        const begin = outBuf.add(0).readPointer();
        const end = outBuf.add(8).readPointer();
        if (begin.isNull() || end.isNull()) {
          trajectoryActive = false;
          return;
        }

        const pointCount = (end.toUInt32() - begin.toUInt32()) / trajectoryPointSize;
        if (this.hasBall && pointCount >= 2) {
          const lastPointOffset = (pointCount - 1) * trajectoryPointSize;
          const x = begin.add(lastPointOffset).readFloat();
          const y = begin.add(lastPointOffset + 4).readFloat();
          trajectoryInGoal = BattleScreen.isPointInGoal(x, y);
        }

        trajectoryHasBall = this.hasBall;
        trajectoryTotalRange = BattleScreen.computeTotalRangeUnits(
          this.skillData,
          trajectoryHasBall,
        );

        if (Config.config.ExtendedTrajectory) {
          if (trajectoryHasBall) {
            if (pointCount < 4) {
              trajectoryActive = false;
              return;
            }
            trajectoryPoints = [];
            for (let index = 0; index < pointCount; index++) {
              const pointOffset = index * trajectoryPointSize;
              trajectoryPoints.push({
                x: begin.add(pointOffset).readFloat(),
                y: begin.add(pointOffset + 4).readFloat(),
                z: begin.add(pointOffset + 8).readFloat(),
              });
            }
            trajectoryActive = true;
            return;
          }
          trajectoryActive = false;
        }
      },
    });

    Interceptor.attach(battleScreenTrajectoryHookAddress, {
      onEnter() {
        if (BSDPlusManager.isBSDPlusEnabled) {
          trajectoryActive = false;
          trajectoryInGoal = false;
        }
      },
      onLeave() {
        if (BSDPlusManager.isBSDPlusEnabled) {
          trajectoryInGoal &&
            (!trajectoryActive || trajectoryPoints.length < 4) &&
            BattleScreen.colorMainPathSpriteGreenIfVisible(false);

          if (trajectoryActive && trajectoryPoints.length >= 4) {
            try {
              const range = trajectoryHasBall ? 0 : trajectoryExtensionRange;
              const result = TrajectoryExtender.extend(
                BattleScreen.instance,
                trajectoryPoints,
                trajectoryNative,
                range,
                trajectoryTotalRange,
              );
              trajectoryHasBall &&
                result &&
                !trajectoryInGoal &&
                (trajectoryInGoal = BattleScreen.isPointInGoalExtended(result.endX, result.endY));
              trajectoryInGoal && BattleScreen.colorAllTrajectoryPathSpritesGreen();
              return;
            } catch (_error) {
              return;
            }
          }
        }
      },
    });
  }

  static writePathSpriteGreen(pathSprite) {
    pathSprite.add(9).writeU8(0);
    pathSprite.add(pathSpriteRedOffset).writeU8(255);
    pathSprite.add(pathSpriteGreenOffset).writeU8(0);
    pathSprite.add(pathSpriteRedMultiplierOffset).writeU8(0);
    pathSprite.add(pathSpriteGreenMultiplierOffset).writeU8(255);
    pathSprite.add(pathSpriteBlueMultiplierOffset).writeU8(0);
  }

  static colorMainPathSpriteGreenIfVisible(ignoreVisibility) {
    const pathSprite = BattleScreen.instance.add(mainPathSpriteOffset).readPointer();
    pathSprite.isNull() ||
      (ignoreVisibility && 1 !== pathSprite.add(pathSpriteVisibleOffset).readU8()) ||
      BattleScreen.writePathSpriteGreen(pathSprite);
  }

  static colorPathSpriteGreenIfVisible(offset) {
    const pathSprite = BattleScreen.instance.add(offset).readPointer();
    pathSprite.isNull() ||
      1 !== pathSprite.add(pathSpriteVisibleOffset).readU8() ||
      BattleScreen.writePathSpriteGreen(pathSprite);
  }

  static colorAllTrajectoryPathSpritesGreen() {
    BattleScreen.colorPathSpriteGreenIfVisible(mainPathSpriteOffset);
    BattleScreen.colorPathSpriteGreenIfVisible(pathSpriteOffset1);
    BattleScreen.colorPathSpriteGreenIfVisible(pathSpriteOffset2);
  }

  static isPointInGoalExtended(x, y) {
    const tileMap = LogicBattleModeClient.getTileMap();
    if (tileMap.isNull()) return false;
    const width = tileMap.add(tileMapWidthOffset).readS32() * tileSize;
    const height = tileMap.add(tileMapHeightOffset).readS32() * tileSize;
    return (
      (y <= 950 || y >= height - goalDepth + extendedGoalDifference) &&
      x >= 2200 &&
      x <= width - goalWidth - extendedGoalDifference
    );
  }

  static isPointInGoal(x, y) {
    const tileMap = LogicBattleModeClient.getTileMap();
    if (tileMap.isNull()) return false;
    const width = tileMap.add(tileMapWidthOffset).readS32() * tileSize;
    const height = tileMap.add(tileMapHeightOffset).readS32() * tileSize;
    return (y <= goalDepth || y >= height - goalDepth) && x >= goalWidth && x <= width - goalWidth;
  }

  static computeTotalRangeUnits(skillData, hasBall) {
    const range = LogicSkillData.getCastingRangeTiles(skillData);
    if (hasBall && range === ballCastingRange) return ballTotalRange;
    return range * rangeUnit;
  }

  static sendGoHomeMessage() {
    battleScreenSendGoHome(this.getInstance(), true, false, false, false);
  }

  static toggleFollowSpectate() {
    const instance = this.getInstance();
    instance.isNull() || toggleFollowSpectateNative(instance);
  }

  static isFollowSpectate() {
    const instance = this.getInstance();
    return !instance.isNull() && 1 === instance.add(followSpectateOffset).readU8();
  }
}

exports.BattleScreen = BattleScreen;
BattleScreen.updateSkillAddress = updateSkillAddress;
BattleScreen.enterListeners = [];
BattleScreen.exitListeners = [];
BattleScreen.updateListeners = [];
