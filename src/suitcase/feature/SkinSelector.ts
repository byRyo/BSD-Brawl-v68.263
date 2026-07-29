// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkinSelector = void 0;
const LogicGameObjectManagerClient_1 = require("../../laser/client/logic/battle/LogicGameObjectManagerClient");
const PlayerEntry_1 = require("../../laser/client/game/screen/battle/PlayerEntry");
const Config_1 = require("../config/Config");
const LogicAreaEffectClient_1 = require("../../laser/client/logic/battle/LogicAreaEffectClient");
const LogicItemClient_1 = require("../../laser/client/logic/battle/LogicItemClient");
const LogicProjectileClient_1 = require("../../laser/client/logic/battle/LogicProjectileClient");
const HeroScreenPopup_1 = require("../../laser/client/game/gui/popup/HeroScreenPopup");
const Character3D_1 = require("../../laser/client/game/renderer3d/Character3D");
const SinglePlayerMatchRequestMessage_1 = require("../../laser/client/game/network/messaging/message/SinglePlayerMatchRequestMessage");
class SkinSelector {
  static isAvailable() {
    return false;
  }
  static init() {
    if (!this.isAvailable()) return false;
    LogicAreaEffectClient_1.LogicAreaEffectClient.patch();
    LogicItemClient_1.LogicItemClient.patch();
    LogicProjectileClient_1.LogicProjectileClient.patch();
    Character3D_1.Character3D.patch();
    LogicGameObjectManagerClient_1.LogicGameObjectManagerClient.patch();
    HeroScreenPopup_1.HeroScreenPopup.patch();
    PlayerEntry_1.PlayerEntry.patch();
    SinglePlayerMatchRequestMessage_1.SinglePlayerMatchRequestMessage.patch();
  }
  static isInUse() {
    return !!this.isAvailable() && Object.keys(Config_1.Config.config.SkinOverrides).length > 0;
  }
}
exports.SkinSelector = SkinSelector;
SkinSelector.skinDataMap = {};
