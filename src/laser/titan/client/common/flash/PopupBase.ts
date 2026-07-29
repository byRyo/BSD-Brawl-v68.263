// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg"),
  { DropGUIContainer } = require("./DropGUIContainer"),
  { StringObject } = require("../../native/StringObject"),
  { Config } = require("../../../../../suitcase/config/Config"),
  { StaticTheme } = require("../../../../../suitcase/modmenu/StaticTheme"),
  { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory"),
  { GameButton } = require("../../../../client/game/gui/GameButton"),
  { LogicDataTables } = require("../../../../client/logic/data/LogicDataTables"),
  { Libc } = require("../../../../../lib/Libc"),
  { InputField } = require("./InputField"),
  { EDebugger } = require("../../../../../suitcase/debug/EDebugger"),
  { Logcat } = require("../../../../../suitcase/debug/Logcat"),
  { MovieClip } = require("./MovieClip"),
  { ThemeSelector } = require("../../../../../suitcase/modmenu/ThemeSelector");
const ctor = new NativeFunction(Libg.offset(7593136, 7373356), "pointer", [
    "pointer",
    "pointer",
    "pointer",
    "bool",
    "bool",
    "pointer",
    "pointer",
    "pointer",
    "pointer",
  ]),
  getNaviHeightNative = new NativeFunction(Libg.offset(7597944, 7378048), "float", ["pointer"]),
  updateNative = new NativeFunction(Libg.offset(7595644, 7375908), "int", ["pointer", "float"]),
  PopupBase_dtor = Libg.offset(7594044, 7374304),
  O = { background: 284, input: 336, list: 440, closeCb: 464, backCb: 528, homeCb: 536 };
for (const k in O) O[k] = LogicMemory.offset(O[k]);
class PopupBase extends DropGUIContainer {
  constructor(
    instanceOrName,
    exportName,
    isModal,
    showClose,
    title = "",
    header = "",
    button = "",
  ) {
    super(typeof instanceOrName === "string" ? Libc.malloc(664) : instanceOrName);
    if (typeof instanceOrName === "string") {
      if (!exportName) {
        const m = `PopupBase::ctor: ${exportName} is not defined!`;
        EDebugger.addMessage(EDebugger.ERROR, m);
        Logcat.logError(m);
        return;
      }
      StringObject.withMany(
        [instanceOrName, exportName, title ?? "", header ?? "", button ?? "", ""],
        (v) => ctor(this.instance, v[0], v[1], +isModal, +showClose, v[2], v[3], v[4], v[5]),
      );
    }
  }
  get backgroundClip() {
    const p = this.instance.add(O.background).readPointer();
    return p.isNull() ? null : new MovieClip(p);
  }
  getNaviHeight() {
    return getNaviHeightNative(this.instance);
  }
  _callback(offset) {
    new NativeFunction(this.instance.readPointer().add(offset).readPointer(), "void", ["pointer"])(
      this.instance,
    );
  }
  fadeOut() {
    this._callback(O.closeCb);
  }
  close() {
    this.fadeOut();
  }
  closeWithKeyboard() {
    const input = this.getInputField();
    if (input) {
      input.activate(false);
      input.destruct();
    }
    this._callback(O.closeCb);
  }
  goBack() {
    this._callback(O.backCb);
  }
  closeAllPopups() {
    this._callback(O.homeCb);
  }
  adjustPopupHeaderButtons(prefix) {
    new GameButton(
      this.instance.add(PopupBase.fields.ButtonBack).readPointer(),
    ).setCustomButtonListener(this.backButtonPressed.bind(this), `${prefix}_back_button`);
    new GameButton(
      this.instance.add(PopupBase.fields.ButtonHome).readPointer(),
    ).setCustomButtonListener(this.homeButtonPressed.bind(this), `${prefix}_home_button`);
  }
  closeButtonPressed() {
    this.fadeOut();
  }
  backButtonPressed() {
    this.goBack();
  }
  homeButtonPressed() {
    this.closeAllPopups();
  }
  onDestructed() {}
  update(delta) {
    if (!this.instance.isNull() && !this.isDestructed()) updateNative(this.instance, delta);
  }
  updateElements() {}
  setDisallowModalTap(v) {
    this.instance.add(O.background).writeU8(+v);
  }
  setInputField(input) {
    this.instance.add(O.input).writePointer(input.instance);
  }
  getInputField() {
    const p = this.instance.add(O.input).readPointer();
    if (!p.isNull()) return new InputField(p);
  }
  static patch() {
    Interceptor.attach(ctor, {
      onEnter(args) {
        this.popup = args[0];
        const popup = StringObject.read(args[2]);
        if (
          Config.config.SharedBackground &&
          !StringObject.read(args[5]) &&
          !StringObject.read(args[6]) &&
          !StaticTheme.restrictedPopupNames.includes(popup)
        ) {
          const theme = LogicDataTables.getDataById(
            LogicDataTables.table.Themes,
            Config.config.ThemeBackgroundID,
          );
          if (theme) {
            args[5] = StringObject.create(theme.getFileName());
            args[6] = StringObject.create(theme.getExportName());
          }
        }
        if (popup === "about_screen") {
          args[5] = StringObject.create("sc/ui.sc");
          args[6] = StringObject.create("bg_shape_01_atlasgenerator_texture_luminance_alpha");
        }
      },
      onLeave() {
        const background = new PopupBase(this.popup).backgroundClip;
        if (background && ThemeSelector.apply) ThemeSelector.apply(background);
      },
    });
  }
}
PopupBase.fields = {
  ButtonsCallback: 128,
  ButtonClose: 224,
  ButtonBack: 232,
  ButtonHome: 240,
  ListContainer: 440,
};
PopupBase.PopupBase_dtor = PopupBase_dtor;
PopupBase.closeButtonCallbackOffset = O.closeCb;
PopupBase.backButtonPressedCallbackOffset = O.backCb;
PopupBase.homeButtonPressedCallbackOffset = O.homeCb;
module.exports = {
  PopupBase,
  PopupBase_dtor,
  closeButtonCallbackOffset: O.closeCb,
  backButtonPressedCallbackOffset: O.backCb,
  homeButtonPressedCallbackOffset: O.homeCb,
};
