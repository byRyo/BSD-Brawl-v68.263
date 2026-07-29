// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedReplay = void 0;
const Libc_1 = require("../../lib/Libc");
const Libg_1 = require("../../lib/Libg");
const LogicMemory_1 = require("../logic/LogicMemory");
const AllianceManager_1 = require("../../laser/client/game/screen/home/alliance/AllianceManager");
const GameMain_1 = require("../../laser/client/GameMain");
const ReplayUuidLogger_1 = require("./ReplayUuidLogger");
const HashTagCodeGenerator_1 = require("../../laser/client/game/utils/HashTagCodeGenerator");
const Application_1 = require("../../laser/titan/client/application/Application");
const GUI_1 = require("../../laser/client/game/gui/GUI");
const ReplayUuid_1 = require("./ReplayUuid");
const Localisation_1 = require("../localisation/Localisation");
const StringObject_1 = require("../../laser/titan/client/native/StringObject");

const BATTLE_LOG_LIST_OFFSET = LogicMemory_1.LogicMemory.offset(48);
const BATTLE_LOG_ITEM_OFFSET = LogicMemory_1.LogicMemory.offset(16);
const ENTRY_UUID_LOW_OFFSET = LogicMemory_1.LogicMemory.offset(136);
const ENTRY_UUID_HIGH_OFFSET = LogicMemory_1.LogicMemory.offset(157);
const SHARED_REPLAY_DATA_OFFSET = LogicMemory_1.LogicMemory.offset(232, 240);
const UUID_LOW_OFFSET = LogicMemory_1.LogicMemory.offset(48);
const UUID_HIGH_OFFSET = LogicMemory_1.LogicMemory.offset(56);
const SHARED_REPLAY_SIZE = 200;
const UUID_SIZE = 16;
const SHARED_REPLAY_TYPE = 11;
const DEEPLINK_PREFIX = "https://link.brawlstars.com/?action=bsd_replay&code=";
const DEEPLINK_ACTION = "action=bsd_replay";
const CODE_PARAMETER = "code=";
const CONSUMED_DEEPLINK_RESULT = -1;
const HANDLE_URL = Libg_1.Libg.offset(5251308, 5362140);
const BATTLE_LOG_ITEM = Libg_1.Libg.offset(19129672, 17793600);

class SharedReplay {
  static patch() {
    Interceptor.attach(HANDLE_URL, {
      onEnter(args) {
        try {
          const url = StringObject_1.StringObject.read(args[1]);
          if (url.indexOf(DEEPLINK_ACTION) < 0) return;
          const code = SharedReplay.extractCodeFromDeeplink(url);
          if (!code) return;
          this.consumedBsdDeeplink = true;
          if (SharedReplay.homeReady) SharedReplay.watchByCode(code);
          else SharedReplay.pendingCode = code;
        } catch (_) {}
      },
      onLeave(retval) {
        if (this.consumedBsdDeeplink) {
          try {
            retval.writeS32(CONSUMED_DEEPLINK_RESULT);
          } catch (_) {}
        }
      },
    });
  }
  static notifyHomeReady() {
    this.homeReady = true;
    if (!this.pendingCode) return;
    const code = this.pendingCode;
    this.pendingCode = null;
    this.watchByCode(code);
  }
  static copyShareCode() {
    const code = this.buildShareCode();
    if (code) {
      Application_1.Application.copyString(code);
      GUI_1.GUI.showFloaterTextAtDefaultPosition(
        Localisation_1.Localisation.getString("CopyReplayCodeCopied").replace("{code}", code),
      );
      return true;
    }
    GUI_1.GUI.showFloaterTextAtDefaultPosition(
      Localisation_1.Localisation.getString("CopyReplayCodeNoCapture"),
    );
    return false;
  }
  static copyShareLink() {
    const code = this.buildShareCode();
    if (code) {
      Application_1.Application.copyString(this.encodeDeeplink(code));
      GUI_1.GUI.showFloaterTextAtDefaultPosition(
        Localisation_1.Localisation.getString("BattleLogCopyLinkCopied"),
      );
      return true;
    }
    GUI_1.GUI.showFloaterTextAtDefaultPosition(
      Localisation_1.Localisation.getString("CopyReplayCodeNoCapture"),
    );
    return false;
  }
  static hasValidEntryUuid(item) {
    try {
      const entry = this.resolveBattleEntry(item);
      if (!entry) return false;
      const low = entry.add(ENTRY_UUID_LOW_OFFSET).readPointer();
      const high = entry.add(ENTRY_UUID_HIGH_OFFSET).readPointer();
      return !low.isNull() || !high.isNull();
    } catch (_) {
      return false;
    }
  }
  static resolveBattleEntry(item) {
    if (item.isNull()) return null;
    const list = item.add(BATTLE_LOG_LIST_OFFSET).readPointer();
    if (list.isNull()) return null;
    const holder = list.add(8).readPointer();
    if (holder.isNull()) return null;
    const entry = holder.readPointer();
    if (entry.isNull()) return null;
    const result = entry.readPointer();
    return result.isNull() ? null : result;
  }
  static copyLinkForBattleLogItem(item) {
    const entry = this.resolveBattleEntry(item);
    if (!entry) return this.reportNoCapture();
    const uuid = Libc_1.Libc.malloc(UUID_SIZE);
    Memory.copy(uuid, entry.add(UUID_LOW_OFFSET), 8);
    Memory.copy(uuid.add(8), entry.add(UUID_HIGH_OFFSET), 8);
    const hex = ReplayUuid_1.ReplayUuid.toHex(uuid);
    Libc_1.Libc.free(uuid);
    const code = "".concat(
      hex,
      ":",
      HashTagCodeGenerator_1.HashTagCodeGenerator.convertLongToPlayerTag(
        GameMain_1.GameMain.getAccountId(),
      ),
    );
    Application_1.Application.copyString(this.encodeDeeplink(code));
    GUI_1.GUI.showFloaterTextAtDefaultPosition(
      Localisation_1.Localisation.getString("BattleLogCopyLinkCopied"),
    );
    return true;
  }
  static encodeDeeplink(code) {
    return DEEPLINK_PREFIX + code;
  }
  static watchByCode(code) {
    const parts = code.trim().split(":");
    if (parts.length !== 2) return this.reportInvalidCode();
    const uuid = ReplayUuid_1.ReplayUuid.toBuffer(parts[0]);
    const tag = parts[1].replace("#", "").trim().toUpperCase();
    if (!uuid || !this.isValidPlayerTag(tag)) return this.reportInvalidCode();
    if (
      tag ===
      HashTagCodeGenerator_1.HashTagCodeGenerator.convertLongToPlayerTag(
        GameMain_1.GameMain.getAccountId(),
      )
    )
      return this.watchOwnReplay(uuid);
    const accountId = HashTagCodeGenerator_1.HashTagCodeGenerator.convertPlayerTagToLong(tag);
    return this.watchSharedReplay(uuid, accountId.instance);
  }
  static watchOwnReplay(uuid) {
    const low = uuid.readU64();
    const high = uuid.add(8).readU64();
    const manager = AllianceManager_1.AllianceManager.getInstance();
    if (!manager.isNull()) manager.add(BATTLE_LOG_ITEM_OFFSET).writeU8(0);
    return AllianceManager_1.AllianceManager.doStartReplay(low, high);
  }
  static buildShareCode() {
    const uuid = ReplayUuidLogger_1.ReplayUuidLogger.getLastRawUuid();
    if (!uuid) return null;
    const tag = HashTagCodeGenerator_1.HashTagCodeGenerator.convertLongToPlayerTag(
      GameMain_1.GameMain.getAccountId(),
    );
    return "".concat(ReplayUuid_1.ReplayUuid.toHex(uuid), ":", tag);
  }
  static extractCodeFromDeeplink(url) {
    const position = url.indexOf(CODE_PARAMETER);
    if (position < 0) return null;
    const start = position + 5;
    const end = url.indexOf("&", start);
    return decodeURIComponent(end < 0 ? url.slice(start) : url.slice(start, end));
  }
  static watchSharedReplay(uuid, accountId) {
    const data = Libc_1.Libc.calloc(SHARED_REPLAY_SIZE, 1);
    data.add(UUID_LOW_OFFSET).writeByteArray(uuid.readByteArray(8));
    data.add(UUID_HIGH_OFFSET).writeInt(SHARED_REPLAY_TYPE);
    data.add(SHARED_REPLAY_DATA_OFFSET).writePointer(accountId);
    const manager = AllianceManager_1.AllianceManager.getInstance();
    if (!manager.isNull()) manager.add(BATTLE_LOG_ITEM_OFFSET).writeU8(0);
    return AllianceManager_1.AllianceManager.doStartSharedReplay(data);
  }
  static isValidPlayerTag(tag) {
    if (tag.length === 0) return false;
    for (const character of tag)
      if (!HashTagCodeGenerator_1.HashTagCodeGenerator.CONVERSION_CHARS.includes(character))
        return false;
    return true;
  }
  static reportInvalidCode() {
    GUI_1.GUI.showFloaterTextAtDefaultPosition(
      Localisation_1.Localisation.getString("WatchSharedReplayBadCode"),
    );
    return false;
  }
  static reportNoCapture() {
    GUI_1.GUI.showFloaterTextAtDefaultPosition(
      Localisation_1.Localisation.getString("CopyReplayCodeNoCapture"),
    );
    return false;
  }
}
exports.SharedReplay = SharedReplay;
SharedReplay.pendingCode = null;
SharedReplay.homeReady = false;
