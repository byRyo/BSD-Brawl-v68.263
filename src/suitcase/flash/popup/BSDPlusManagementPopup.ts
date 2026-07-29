// @ts-nocheck
const { PlayerInfo } = require("../../../laser/client/game/friends/PlayerInfo");
const { GUI } = require("../../../laser/client/game/gui/GUI");
const { StringTable } = require("../../../laser/client/game/text/StringTable");
const { LogicDataTables } = require("../../../laser/client/logic/data/LogicDataTables");
const { Application } = require("../../../laser/titan/client/application/Application");
const { BlingTextField } = require("../../../laser/titan/client/common/flash/BlingTextField");
const { CustomTextEncoder } = require("../../crypto/CustomTextEncoder");
const { TSChaCha20 } = require("../../crypto/TSChaCha20");
const { EDebugger } = require("../../debug/EDebugger");
const { LogicTime } = require("../../logic/LogicTime");
const { InputPopup, EInputPopupType } = require("../../modmenu/InputPopup");
const { BSDMessageManager } = require("../../network/messaging/BSDMessageManager");
const {
  UnlinkTelegramAccountMessage,
  EUnlinkStatus,
} = require("../../network/messaging/message/UnlinkTelegramAccountMessage");
const { BSDPlusManager } = require("../../validation/BSDPlusManager");
const { UniItem } = require("./button/UniItem");
const { ListContainerPopup } = require("./ListContainerPopup");

const EButton = { TELEGRAM: 0, PURCHASE_BSDP: 1 };

class BSDPlusManagementPopup extends ListContainerPopup {
  constructor() {
    super({ Title: "Управление BSD+", ExportName: "country_popup" });
    this.isBSDPlusButtonUpdated = false;
    this.currentButtons = [];
    this.adjustPopupHeaderButtons("bsdp_management");
    this.createItems();
  }

  createItems() {
    this.container.clearEntries();
    const template = StringTable.getMovieClip("sc/ui.sc", "popover_text_left");
    let status = this.getNewTextField();
    if (!BSDPlusManager.expired) {
      const gradient = LogicDataTables.getDataById(LogicDataTables.table.ColorGradients, 1);
      status = BlingTextField.create(template, "text", 0, gradient);
    }
    status.text = BSDPlusManager.expired ? "У вас нет BSD+!" : "У вас есть BSD+!";
    status.align = 2;
    status.x = -120;
    status.y = -170;
    status.fontSize = 32;
    status.fontOutline = true;
    status.visibility = true;
    this.haveBSDPlusTextField = status;
    this.addChild(status);

    if (!BSDPlusManager.expired) {
      const countdown = this.getNewTextField();
      countdown.text = "До окончания BSD+: " + LogicTime.humanizeTime(BSDPlusManager.expiresIn);
      countdown.align = 2;
      countdown.x = -120;
      countdown.y = -120;
      countdown.fontSize = 24;
      countdown.fontOutline = true;
      countdown.visibility = true;
      countdown.color = 4294967295;
      this.bsdPlusCountdownTextField = countdown;
      this.addChild(countdown);
    }

    const telegramStatus = this.getNewTextField();
    telegramStatus.text = BSDPlusManager.isTelegramLinked()
      ? "Аккаунт привязан к Telegram-профилю: ".concat(BSDPlusManager.telegramToString())
      : "Telegram-аккаунт не привязан.";
    telegramStatus.align = 34;
    telegramStatus.x = -120;
    telegramStatus.y = -80;
    telegramStatus.fontSize = 24;
    telegramStatus.fontOutline = true;
    telegramStatus.visibility = true;
    telegramStatus.color = 4281569516;
    this.addChild(telegramStatus);

    this.currentButtons = this.getButtons();
    this.currentButtons.forEach((button) => this.container.addEntry(button));
    const height = this.getNaviHeight();
    this.container.refreshEntryPositions(this.currentButtons.length, 4 * height, 0, 0, 0, 0, -1);
    this.container.refreshBounds(height);
  }

  getNewTextField() {
    return StringTable.getMovieClip("sc/ui.sc", "popover_text_left").getTextFieldByName("text");
  }

  getButtons() {
    const buttons = [];
    const telegram = new UniItem(
      BSDPlusManager.isTelegramLinked() ? "Отвязать аккаунт" : "Привязать аккаунт",
    );
    if (BSDPlusManager.isTelegramLinked() && BSDPlusManager.telegramData?.unlinkingInProcess)
      telegram.setText("Отменить отвязку");
    telegram.id = EButton.TELEGRAM;
    telegram.setCustomButtonListener(this.onTelegramButtonPressed.bind(this));
    buttons.push(telegram);
    const purchase = new UniItem(BSDPlusManager.expired ? "Купить BSD+" : "Продлить BSD+");
    telegram.id = EButton.PURCHASE_BSDP;
    purchase.setCustomButtonListener(this.onPurchaseBSDPlusButtonPressed.bind(this));
    buttons.push(purchase);
    return buttons;
  }

  getTelegramButton() {
    return this.currentButtons.find((button) => button.id === EButton.TELEGRAM);
  }
  getPurchaseBSDPlusButton() {
    return this.currentButtons.find((button) => button.id === EButton.PURCHASE_BSDP);
  }

  onTelegramButtonPressed() {
    if (!BSDPlusManager.telegramData) {
      GUI.showPopup(new InputPopup(EInputPopupType.PLUS_LINK), true, true, true);
      return;
    }
    BSDMessageManager.sendMessage(
      new UnlinkTelegramAccountMessage(!BSDPlusManager.telegramData?.unlinkingInProcess),
    ).then((response) => {
      if (response.statusCode !== 200) {
        GUI.pushFloaterTextToQueue(
          BSDPlusManager.telegramData?.unlinkingInProcess
            ? "Не удалось остановить процесс привязки аккаунта от Telegram. Попробуй позже."
            : "Не удалось отвязать аккаунт от Telegram. Попробуй позже.",
        );
        EDebugger.addMessage(EDebugger.ERROR, "Status Code is ".concat(response.statusCode));
        return;
      }
      const cipher = new TSChaCha20(TSChaCha20.key, TSChaCha20.nonce);
      const decoded = CustomTextEncoder.decode(
        cipher.decrypt(new Uint8Array(BSDMessageManager.escapedStringToBytes(response.json.data))),
      );
      const message = JSON.parse(decoded);
      if (BSDMessageManager.validateMessage(message) && message.success) {
        switch (message.status) {
          case EUnlinkStatus.BEGAN:
            if (BSDPlusManager.telegramData) BSDPlusManager.telegramData.unlinkingInProcess = true;
            GUI.pushFloaterTextToQueue("Вы начали процесс отвязки аккаута от Telegram.");
            break;
          case EUnlinkStatus.UNLINKED:
            BSDPlusManager.telegramData = undefined;
            GUI.pushFloaterTextToQueue("Ваш аккаунт успешно был отвязан от Telegram.");
            break;
          case EUnlinkStatus.UNLINK_STOP:
            if (BSDPlusManager.telegramData) BSDPlusManager.telegramData.unlinkingInProcess = false;
            GUI.pushFloaterTextToQueue("Вы прервали процесс отвязки аккаунта от Telegram");
            break;
        }
        this.updateTelegramButton();
        return;
      }
      GUI.pushFloaterTextToQueue(
        BSDPlusManager.telegramData?.unlinkingInProcess
          ? "Не удалось остановить процесс привязки аккаунта от Telegram. Попробуй позже."
          : "Не удалось отвязать аккаунт от Telegram. Попробуй позже.",
      );
    });
  }

  onPurchaseBSDPlusButtonPressed() {
    const tag = PlayerInfo.tag || "";
    Application.openUrl("https://t.me/bsdbrawlbot?start=tag".concat(tag));
  }

  updateTelegramButton() {
    const button = this.getTelegramButton();
    if (!button) return;
    if (BSDPlusManager.telegramData) {
      if (BSDPlusManager.telegramData.unlinkingInProcess) {
        button.setText("Отменить отвязку");
        return;
      }
      if (BSDPlusManager.telegramData) {
        button.setText("Отвязать Telegram");
        return;
      }
      return;
    }
    button.setText("Привязать Telegram");
  }

  updateElements() {
    if (BSDPlusManager.expired) {
      if (this.bsdPlusCountdownTextField) this.bsdPlusCountdownTextField.text = "";
      if (!this.isBSDPlusButtonUpdated) {
        const button = this.getPurchaseBSDPlusButton();
        this.isBSDPlusButtonUpdated = true;
        button?.setText("Купить BSD+");
      }
      this.haveBSDPlusTextField.text = "У вас нет BSD+!";
      return;
    }
    if (this.bsdPlusCountdownTextField)
      this.bsdPlusCountdownTextField.text =
        "До окончания BSD+: " + LogicTime.humanizeTime(BSDPlusManager.expiresIn);
  }
}

module.exports = { BSDPlusManagementPopup };
