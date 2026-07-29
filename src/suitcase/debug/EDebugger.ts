// @ts-nocheck
const { TextField } = require("../../laser/titan/client/common/flash/TextField");
const { Config } = require("../config/Config");
const { MovieClip } = require("../../laser/titan/client/common/flash/MovieClip");
const { StringTable } = require("../../laser/client/game/text/StringTable");
const { Stage } = require("../../laser/titan/client/common/flash/Stage");
const { ModProperties } = require("../config/ModProperties");
const { DeviceSpecifications } = require("../config/DeviceSpecifications");

class EDebugger {
  static configure(fontSize, maxMessagesPerScreen) {
    EDebugger.fontSize = fontSize;
    EDebugger.maxMessagesPerScreen = maxMessagesPerScreen;
  }

  static addMessage(level, ...messages) {
    if (!Config.useDebugLogging) return;

    const rawMessage = messages
      .map((message) => {
        if (typeof message === "object" && message !== null) {
          try {
            return JSON.stringify(message);
          } catch (_error) {
            return String(message);
          }
        }
        try {
          return message.toString();
        } catch (_error) {
          return String(message);
        }
      })
      .join(" ");

    if (rawMessage !== this.lastRawMessage || level !== this.lastLevel) {
      this.lastRawMessage = rawMessage;
      this.lastLevel = level;

      switch (level) {
        case EDebugger.ERROR:
          this.text += `<cFF0000>[E] ${rawMessage}</c>\n`;
          break;
        case EDebugger.WARNING:
          this.text += `<cFFFF00>[W] ${rawMessage}</c>\n`;
          break;
        case EDebugger.INFO:
          this.text += `<c90EE90>[I] ${rawMessage}</c>\n`;
          break;
        case EDebugger.LASER:
          this.text += `<cFDBDBA>[L] ${rawMessage}</c>\n`;
          break;
        case EDebugger.VERBOSE:
          this.text += `<cDDDDDD>[V] ${rawMessage}</c>\n`;
          break;
        default:
          this.text += `<cBC8F8F>[U(${level})] ${rawMessage}</c>\n`;
          break;
      }
      this.messagesOnScreen++;
    }
  }

  static clear() {
    this.messagesOnScreen = 0;
    this.text = "";
    this.lastRawMessage = "";
    this.lastLevel = null;
  }

  static create() {
    if (Config.useDebugLogging) {
      const textField = MovieClip.getTextFieldByName(
        StringTable.getMovieClip("sc/ui.sc", "popover_text_left").instance,
        "text",
      );
      textField.x = 20;
      textField.y = 10;
      textField.color = 0;
      textField.colorTag = true;
      textField.fontOutline = true;
      textField.fontSize = this.fontSize;
      this.textfield = new TextField(textField.instance);
      this.headerText = `<c90EE90>[I] BSD Brawl (${ModProperties.environment}) for ${DeviceSpecifications.platform}, version ${ModProperties.version}</c>\n`;
      this.headerText += "<c90EE90>[I] You can disable debug log displaying in mod menu</c>\n";
      Stage.addChild(this.textfield.instance);
    }
  }

  static destroy() {
    if (this.textfield) {
      Stage.removeChild(this.textfield.instance);
      this.textfield = null;
    }
  }

  static hideOrShow() {
    this.isHidden = !this.isHidden;
    this.textfield.visibility = +!this.isHidden;
  }

  static isCreated() {
    return !!this.textfield;
  }

  static update() {
    if (this.isCreated()) {
      if (this.messagesOnScreen > this.maxMessagesPerScreen) {
        const lines = this.text.split("\n");
        lines.shift();
        this.text = lines.join("\n");
        this.messagesOnScreen--;
      }
      this.textfield.text = this.headerText + this.text;
    }
  }
}

EDebugger.ERROR = 0;
EDebugger.WARNING = 1;
EDebugger.INFO = 2;
EDebugger.LASER = 3;
EDebugger.VERBOSE = 4;
EDebugger.logsObject = {};
EDebugger.fontSize = 12;
EDebugger.maxMessagesPerScreen = 40;
EDebugger.text = "";
EDebugger.lastRawMessage = "";
EDebugger.lastLevel = null;

exports.EDebugger = EDebugger;
