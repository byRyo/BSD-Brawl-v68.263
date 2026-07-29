// @ts-nocheck
const { LogicBattleModeClient } = require("../../logic/mode/LogicBattleModeClient");
const { BattleLatency } = require("../../../../suitcase/modconfiguration/BattleLatency");
const { BattleMode } = require("../state/battlemode/BattleMode");
const { Libg } = require("../../../../lib/Libg");
const { MovieClip } = require("../../../titan/client/common/flash/MovieClip");
const { LogicMemory } = require("../../../../suitcase/logic/LogicMemory");
const { StartLoadingMessage } = require("../network/messaging/message/StartLoadingMessage");
const { Breadcrumbs } = require("../../../../suitcase/debug/Breadcrumbs");
const { LogicPlayer } = require("../../logic/battle/LogicPlayer");

const CombatHUD_update = Libg.offset(6406324, 6326908);
const CombatHUD_renderTitle = new NativeFunction(Libg.offset(6405688, 6323396), "void", [
  "pointer",
  "pointer",
  "pointer",
  "pointer",
]);
const CombatHUD_setChatBubbles = new NativeFunction(Libg.offset(5872452, 5880592), "void", [
  "pointer",
  "char",
]);
const CombatHUD_renderOffscreenIndicator = Libg.offset(5946244, 5945332);
const CombatHUD_setHintText = new NativeFunction(Libg.offset(5969796, 5971652), "void", [
  "pointer",
  "pointer",
  "pointer",
]);
const CombatHUD_updateHintTextsStart = Libg.offset(5886952, 5890324);
const CombatHUD_updateHintTextsEnd = Libg.offset(5965128, 5962776);
const CombatHUD_renderBattleTitle = Libg.offset(5971824, 5968184);
const CombatHUD_renderKillFeed = new NativeFunction(Libg.offset(5975628, 5971792), "void", [
  "pointer",
  "float",
]);
const primaryHintTextFieldOffset = LogicMemory.offset(16);
const primaryHintActiveOffset = LogicMemory.offset(1040);
const secondaryHintActiveOffset = LogicMemory.offset(1224);
const battleIntroTitleOffset = LogicMemory.offset(544);
const killFeedMovieClipOffset = LogicMemory.offset(40);
const spectateButtonOffset = LogicMemory.offset(1856);
const spectateButtonVisibleOffset = LogicMemory.offset(8);

class CombatHUD {
  static savedTitleClips = [];
  static chatBubblesVisible = true;
  static updateListeners = [];
  static offscreenIndicatorListeners = [];
  static offscreenIndicatorHooked = false;
  static hintTextsListeners = [];
  static hintTextsHooked = false;

  static addUpdateListener(listener) {
    this.updateListeners.push(listener);
  }
  static addOffscreenIndicatorListener(listener) {
    this.offscreenIndicatorListeners.push(listener);
    this.hookOffscreenIndicator();
  }
  static hookOffscreenIndicator() {
    if (this.offscreenIndicatorHooked) return;
    this.offscreenIndicatorHooked = true;
    Interceptor.attach(CombatHUD_renderOffscreenIndicator, {
      onEnter(args) {
        this.ownTeam = args[1].toInt32();
        this.ownCharacter = args[2];
        this.indicatorClip = args[3];
        this.teammateOrder = args[4].toInt32();
      },
      onLeave() {
        for (const listener of CombatHUD.offscreenIndicatorListeners)
          listener(this.ownTeam, this.ownCharacter, this.indicatorClip, this.teammateOrder);
      },
    });
  }
  static addHintTextsListener(listener) {
    this.hintTextsListeners.push(listener);
    this.hookHintTexts();
  }
  static hookHintTexts() {
    if (this.hintTextsHooked) return;
    this.hintTextsHooked = true;
    Interceptor.attach(CombatHUD_updateHintTextsStart, {
      onEnter(args) {
        for (const listener of CombatHUD.hintTextsListeners) listener(args[0]);
      },
    });
  }
  static isReturnAddressInUpdateHintTexts(address) {
    return (
      address.compare(CombatHUD_updateHintTextsStart) >= 0 &&
      address.compare(CombatHUD_updateHintTextsEnd) < 0
    );
  }
  static setHintText(hud, field, text) {
    CombatHUD_setHintText(hud, field, text);
  }
  static getPrimaryHintTextField(hud) {
    return hud.add(primaryHintTextFieldOffset).readPointer();
  }
  static setPrimaryHintActive(hud, active) {
    hud.add(primaryHintActiveOffset).writeU8(active ? 1 : 0);
  }
  static setSecondaryHintActive(hud, active) {
    hud.add(secondaryHintActiveOffset).writeU8(active ? 1 : 0);
  }
  static getSpectateButton(hud) {
    return hud.add(spectateButtonOffset).readPointer();
  }
  static getSpectateButtonVisible(hud) {
    const button = this.getSpectateButton(hud);
    return button.isNull() ? -1 : button.add(spectateButtonVisibleOffset).readU8();
  }
  static setSpectateButtonVisible(hud, visible) {
    const button = this.getSpectateButton(hud);
    if (!button.isNull()) button.add(spectateButtonVisibleOffset).writeU8(visible ? 1 : 0);
  }
  static toggleChatBubbles(hud) {
    if (!hud.isNull()) {
      this.chatBubblesVisible = !this.chatBubblesVisible;
      CombatHUD_setChatBubbles(hud, this.chatBubblesVisible ? 1 : 0);
    }
    return this.chatBubblesVisible;
  }
  static areChatBubblesVisible() {
    return this.chatBubblesVisible;
  }
  static rerenderTitle(hud, index) {
    Breadcrumbs.push(`rerenderTitle idx=${index} saved=${this.savedTitleClips.length} ptr=${hud}`);
    if (index < this.savedTitleClips.length) {
      const saved = this.savedTitleClips[index];
      Breadcrumbs.push(
        `rerenderTitle calling render titleClip=${saved.titleClip} prestigeClip=${saved.prestigeClip}`,
      );
      CombatHUD_renderTitle(hud, saved.titleClip, saved.prestigeClip, saved.txtStr);
    }
  }

  static patch() {
    Interceptor.attach(CombatHUD_update, {
      onEnter() {
        for (const listener of CombatHUD.updateListeners) listener();
      },
    });
    Interceptor.attach(LogicBattleModeClient.timeSinceLastprocessedTickOffset, {
      onEnter() {
        if (!CombatHUD.latencyTextField) return;
        const latency = (
          Process.platform === "darwin" ? this.context.x26 : this.context.x23
        ).toInt32();
        if (latency === 0 || BattleMode.isInOfflineGame) return;
        CombatHUD.latencyTextField.text = `${latency} ms`;
        CombatHUD.latencyTextField.textField.color = 0xff000000 + BattleLatency.getColor(latency);
      },
    });
    Interceptor.replace(
      CombatHUD_renderKillFeed,
      new NativeCallback(
        (hud, delta) => {
          CombatHUD_renderKillFeed(hud, delta);
          const clip = new MovieClip(hud.add(killFeedMovieClipOffset).readPointer());
          const killed = clip.getTextFieldByName("killed");
          if (killed) killed.colorTag = true;
          const killer = clip.getTextFieldByName("killer");
          if (killer) killer.colorTag = true;
        },
        "void",
        ["pointer", "float"],
      ),
    );
    Interceptor.attach(CombatHUD_updateHintTextsEnd, {
      onEnter() {
        CombatHUD.savedTitleClips = [];
        StartLoadingMessage.applyPendingTitles();
      },
    });
    Interceptor.attach(CombatHUD_renderBattleTitle, {
      onEnter(args) {
        const player = args[0];
        const intro = player.add(LogicPlayer.logicPlayerBattleIntroDetails).readPointer();
        if (intro.isNull()) return;
        const title = intro.add(battleIntroTitleOffset).readPointer();
        Breadcrumbs.push(`titleRender: player=${player} introPtr=${intro} titlePtr=${title}`);
        CombatHUD.savedTitleClips.push({
          titleClip: args[1],
          prestigeClip: args[2],
          txtStr: args[3],
        });
      },
    });
  }
}

module.exports = { CombatHUD };
