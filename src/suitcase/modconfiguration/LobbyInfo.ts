// @ts-nocheck
"use strict";

const { StringTable } = require("../../laser/client/game/text/StringTable");
const { Config } = require("../config/Config");
const { Localisation } = require("../localisation/Localisation");
const { Latency } = require("../../laser/client/game/network/Latency");
const { HomeScreen } = require("../../laser/client/game/screen/home/HomeScreen");
const { BSDPlusManager } = require("../validation/BSDPlusManager");
const { ModProperties } = require("../config/ModProperties");
const { BlingTextField } = require("../../laser/titan/client/common/flash/BlingTextField");
const { LogicDataTables } = require("../../laser/client/logic/data/LogicDataTables");
const { GetBSDOnlineMessage } = require("../network/messaging/message/GetBSDOnlineMessage");

class LobbyInfo {
  constructor(homeScreen) {
    this.x = 120;
    this.y = 90;
    this.fontSize = 14;
    this.useFontOutline = true;
    this.color = 0xffffffff;

    const movieClip = StringTable.getMovieClip("sc/ui.sc", "popover_text_left");
    let textField = movieClip.getTextFieldByName("text");

    if (BSDPlusManager.isBSDPlusEnabled) {
      const gradient = LogicDataTables.getDataById(LogicDataTables.table.ColorGradients, 1);
      textField = BlingTextField.create(movieClip, "text", false, gradient);
    }

    this.textField = textField;
    this.textField.x = this.x;
    this.textField.y = this.y;
    this.textField.fontSize = this.fontSize;
    this.textField.fontOutline = this.useFontOutline;
    this.textField.color = this.color;
    this.textField.text = LobbyInfo.text;

    if (homeScreen) {
      homeScreen.getMovieClip().addChild(this.textField);
    } else {
      HomeScreen.getHomePage().getMovieClip().addChild(this.textField);
    }
  }

  toggle(visible) {
    this.textField.visibility = visible;
  }

  setText(text) {
    this.textField.text = text;
  }

  update() {
    if (!HomeScreen.lobbyInfo) return;

    this.toggle(!Config.config.HideHomeScreenText);
    const modName = BSDPlusManager.isBSDPlusEnabled ? "BSD Brawl+" : "BSD Brawl";

    if (Config.config.HideHomeScreenText) return;

    LobbyInfo.text = "".concat(
      modName,
      " v",
      ModProperties.version,
      " (",
      ModProperties.environment,
      ")\nTelegram: @bsdatamines\n",
      Localisation.getString("BestPing"),
      ": ",
      Latency.parseBestLatency(),
    );

    if (GetBSDOnlineMessage.lastOnline !== 0) {
      LobbyInfo.text += "\n".concat(
        Localisation.getString("CurrentModOnline"),
        ": ",
        GetBSDOnlineMessage.lastOnline,
      );
    }

    HomeScreen.lobbyInfo.setText(Config.config.HideHomeScreenText ? "" : LobbyInfo.text);
  }
}

LobbyInfo.text = "";

exports.LobbyInfo = LobbyInfo;
