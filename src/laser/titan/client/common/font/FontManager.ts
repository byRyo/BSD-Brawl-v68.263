// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { LogicArrayList } = require("../../../../client/logic/data/LogicArrayList");
const { Font } = require("./Font");
const { StringObject } = require("../../native/StringObject");
const instanceAddress = Libg.offset(19857184, 18160376);
const setForcedFont = new NativeFunction(Libg.offset(13092352, 11992408), "void", [
  "pointer",
  "pointer",
]);
class FontManager {
  static getInstance() {
    return instanceAddress.readPointer();
  }
  static getFontCount() {
    return this.getInstance().add(12).readInt();
  }
  static getFontAt(index) {
    const p = new LogicArrayList(this.getInstance()).getElement(index);
    return p.isNull() ? null : new Font(p);
  }
  static setForcedFontName(name) {
    const instance = this.getInstance();
    if (!instance.isNull()) StringObject.with(name, (value) => setForcedFont(instance, value));
  }
}
FontManager.BSD_FONTS = [
  { name: "", localeName: "FontReset", fileName: "" },
  { name: "Pusia Bold", localeName: "FontPusia", fileName: "font/Pusia-Bold.otf" },
  { name: "Cocon-Regular", localeName: "FontCocon", fileName: "font/Cocon-Regular.otf" },
  { name: "ljk_Downcome", localeName: "FontDowncome", fileName: "font/Downcome.otf" },
  { name: "Impact", localeName: "FontImpact", fileName: "font/Impact.ttf" },
  { name: "SDK_SC_Web Heavy", localeName: "FontHYWenHei", fileName: "font/HYWenHei-85W.ttf" },
];
module.exports = { FontManager };
