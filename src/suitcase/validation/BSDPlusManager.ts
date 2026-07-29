// @ts-nocheck
"use strict";

const { BASE64 } = require("../crypto/BASE64");
const {
  LoginOkMessage,
} = require("../../laser/client/game/network/messaging/message/LoginOkMessage");
const { NativeDialog } = require("../../laser/titan/client/native/NativeDialog");
const { Localisation } = require("../localisation/Localisation");
const { INativeDialogListener } = require("../../laser/titan/client/native/INativeDialogListener");
const { Application } = require("../../laser/titan/client/application/Application");
const { PlayerInfo } = require("../../laser/client/game/friends/PlayerInfo");
const { Stage } = require("../../laser/titan/client/common/flash/Stage");
const { StringTable } = require("../../laser/client/game/text/StringTable");
const { MovieClip } = require("../../laser/titan/client/common/flash/MovieClip");
const { Libc } = require("../../lib/Libc");
const { LogicMemory } = require("../logic/LogicMemory");
const { Libg } = require("../../lib/Libg");

const ACTIVATION_TIME_SECONDS = 80;
const NANOSECONDS_PER_SECOND = 1000000000;
const gameTimeAddress = Libg.offset(15514920, 14301116);

class BSDPlusManager {
  static isTelegramLinked() {
    return undefined !== this.telegramData;
  }

  static telegramToString() {
    const telegramData = this.telegramData;
    if (telegramData) {
      return "".concat(telegramData.name, " (", telegramData.username ?? telegramData.id, ")");
    }
    return "";
  }

  static decrypt(input, key) {
    try {
      let result = "";
      const decoded = BASE64.decode(input);
      for (let i = 0; i < decoded.length; i++) {
        if (decoded[i]) {
          result += String.fromCharCode((decoded[i] - key.charCodeAt(i % key.length)) % 255);
        }
      }
      return result;
    } catch (_error) {
      return "";
    }
  }

  static encrypt(input, key) {
    try {
      const encoded = [];
      for (let i = 0; i < input.length; i++) {
        encoded.push((input.charCodeAt(i) + key.charCodeAt(i % key.length)) % 255);
      }
      return BASE64.encode(encoded);
    } catch (_error) {
      return "";
    }
  }

  static compareCurrentAccount(key) {
    return PlayerInfo.tag === this.decrypt(key, this.KEY);
  }

  static verify(key) {
    if (!key.startsWith("~bsda") || this.forceRevokedKeys.includes(key) || key.length < 9) {
      return this.STATUSES.BAD_KEY;
    }

    const salt = key.slice(5, 9);
    const encryptedPayload = key.slice(9);
    const payload = this.decrypt(encryptedPayload, this.encrypt(this.NEWKEY, salt)).split(":");

    if (payload.length !== 4) {
      return this.STATUSES.BAD_KEY;
    }

    const tag = payload[0];
    const timestamp = payload[1];
    const type = payload[2];
    const checksum = payload[3];

    if (tag !== PlayerInfo.tag) {
      return this.STATUSES.WRONG_ACCOUNT;
    }
    if (isNaN(Number(timestamp))) {
      return this.STATUSES.WRONG_TS;
    }
    if (type !== "1") {
      return this.STATUSES.WRONG_TYPE;
    }

    payload.pop();
    const crc32 = (value) => {
      const table = [];
      let crc = -1;

      for (let i = 0; i < 256; i++) {
        let current = i;
        for (let bit = 0; bit < 8; bit++) {
          current = current & 1 ? 3988292384 ^ (current >>> 1) : current >>> 1;
        }
        table[i] = current;
      }

      for (let i = 0; i < value.length; i++) {
        crc = (crc >>> 8) ^ table[(crc ^ value.charCodeAt(i)) & 255];
      }

      return (-1 ^ crc) >>> 0;
    };

    if (crc32(payload.join("/")).toString(16) !== checksum) {
      return this.STATUSES.CRC_VALIDATION_FAILED;
    }

    let expiresAt = parseInt(timestamp);
    expiresAt += 23587200;
    if (expiresAt < LoginOkMessage.serverTime) {
      return this.STATUSES.EXPIRED;
    }

    this.EXPIRES_TS = expiresAt;
    return this.STATUSES.SUCCESS;
  }

  static showActivationCaption() {
    if (this.activationCaption) return;

    const caption = MovieClip.getTextFieldByName(
      StringTable.getMovieClip("sc/ui.sc", "popover_text_left").instance,
      "text",
    );
    caption.x = 200;
    caption.y = 5;
    caption.fontOutline = true;
    caption.color = 4294951424;
    caption.fontSize = 25;
    caption.text = "Please activate BSD+: 80";
    Stage.addChild(caption.instance);
    this.activationCaption = caption;
    this.activationStartedAtNs = null;
  }

  static get expired() {
    return this.expiresIn <= 0;
  }

  static get expiresIn() {
    return this.EXPIRES_TS - Math.floor(Date.now() / 1000);
  }

  static patch() {
    if (!this.timeCaptureInstalled) {
      this.timeCaptureInstalled = true;
      Interceptor.attach(gameTimeAddress, {
        onLeave() {
          const gameTime = this.context.x0;
          BSDPlusManager.gameTimeNs = uint64(gameTime.toString());
        },
      });
    }
  }

  static updateActivationTimer() {
    if (this.activationKilled) return;
    if (!this.activationCaption) return;

    if (this.isBSDPlusEnabled) {
      Stage.removeChild(this.activationCaption.instance);
      this.activationCaption = null;
      return;
    }

    if (this.gameTimeNs.equals(uint64(0))) return;
    if (this.activationStartedAtNs === null) {
      this.activationStartedAtNs = this.gameTimeNs;
    }

    const elapsedNs = this.gameTimeNs.sub(this.activationStartedAtNs).toNumber();
    const elapsedSeconds = Math.floor(elapsedNs / NANOSECONDS_PER_SECOND);
    const remainingSeconds = Math.max(0, ACTIVATION_TIME_SECONDS - elapsedSeconds);
    this.activationCaption.text = "Please activate BSD+: ".concat(remainingSeconds);

    if (remainingSeconds <= 0) {
      this.activationKilled = true;
      Libc.kill(Libc.getpid(), 15);
      LogicMemory.clearBssSegment(0);
    }
  }

  static showBSDPlusOnlyNativeDialog() {
    NativeDialog.show(
      Localisation.getString("PaidFeatureTitle"),
      Localisation.getString("PaidFeatureDescription"),
      Localisation.getString("PaidFeatureOkButton"),
      Localisation.getString("PaidFeatureInfoChannelButton"),
      "",
      this.bsdPlusDialogListener.instance,
    );
  }
}

exports.BSDPlusManager = BSDPlusManager;

BSDPlusManager.isBSDPlusEnabled = false;
BSDPlusManager.activationCaption = null;
BSDPlusManager.activationStartedAtNs = null;
BSDPlusManager.activationKilled = false;
BSDPlusManager.gameTimeNs = uint64(0);
BSDPlusManager.timeCaptureInstalled = false;
BSDPlusManager.KEY = "270MNG0IX8";
BSDPlusManager.NEWKEY = "LU516E987Q";
BSDPlusManager.STATUSES = {
  SUCCESS: 0,
  BAD_KEY: 1,
  WRONG_ACCOUNT: 2,
  WRONG_TS: 3,
  WRONG_TYPE: 4,
  CRC_VALIDATION_FAILED: 5,
  EXPIRED: 6,
};
BSDPlusManager.EXPIRES_TS = 0;
BSDPlusManager.forceRevokedKeys = [];
BSDPlusManager.bsdPlusDialogListener = new INativeDialogListener((_instance, button) => {
  if (button === 1) {
    const tag = PlayerInfo.tag || "";
    Application.openUrl("https://t.me/bsdbrawlbot?start=tag".concat(tag));
  }
});
