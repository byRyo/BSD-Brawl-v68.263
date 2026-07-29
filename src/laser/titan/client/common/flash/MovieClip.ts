// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg"),
  { Sprite } = require("./Sprite"),
  { EDebugger } = require("../../../../../suitcase/debug/EDebugger"),
  { DisplayObject } = require("./DisplayObject"),
  { TextField } = require("./TextField"),
  { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory"),
  { Logcat } = require("../../../../../suitcase/debug/Logcat"),
  { GUIContainer } = require("./GUIContainer"),
  { CustomButton } = require("./CustomButton");
const gotoFrame = new NativeFunction(Libg.offset(13317696, 12317752), "void", ["pointer", "int"]),
  interactive = new NativeFunction(Libg.offset(13319444, 12319404), "void", ["pointer", "int"]),
  O = { names: 128, children: 144, count: 152, frames: 190, exportName: 192 };
for (const k in O) O[k] = LogicMemory.offset(O[k]);
class MovieClip extends Sprite {
  getChildByName(name) {
    const i = MovieClip.findChildIndexByName(this.instance, name);
    if (i < 0) {
      EDebugger.addMessage(EDebugger.ERROR, `No child with this name! (${name})`);
      return null;
    }
    const p = this.getChildArray()
      .add(i * Process.pointerSize)
      .readPointer();
    return p.isNull() ? null : MovieClip.castInstanceToClass(p);
  }
  get exportName() {
    const p = this.instance.add(O.exportName).readPointer();
    return p.isNull() ? "" : p.readUtf8String();
  }
  get totalFramesAmount() {
    return this.instance.add(O.frames).readShort();
  }
  getNameOfChild(child) {
    const n = this.getChildCount();
    if (n <= 0) return "";
    const names = this.getChildNameList(),
      children = this.getChildArray();
    if (names.isNull() || children.isNull()) return "";
    for (let i = 0; i < n; i++)
      if (
        children
          .add(i * Process.pointerSize)
          .readPointer()
          .equals(child.instance)
      ) {
        const p = names.add(i * Process.pointerSize).readPointer();
        if (!p.isNull())
          try {
            return p.readUtf8String() || "";
          } catch {
            return "";
          }
      }
    return "";
  }
  static getMovieClipByName(instance, name) {
    const i = this.findChildIndexByName(instance, name);
    if (i < 0) return null;
    const list = instance.add(O.children).readPointer();
    if (list.isNull()) {
      EDebugger.addMessage(EDebugger.ERROR, "MovieClip List is null!");
      return null;
    }
    const p = list.add(i * Process.pointerSize).readPointer();
    if (p.isNull()) return null;
    return new MovieClip(p);
  }
  static getTextFieldByName(instance, name) {
    const i = this.findChildIndexByName(instance, name);
    if (i < 0) return null;
    const list = instance.add(O.children).readPointer();
    if (list.isNull()) {
      Logcat.logError("TextField List is null!");
      return null;
    }
    const p = list.add(i * Process.pointerSize).readPointer();
    if (p.isNull()) {
      Logcat.logError("TextField is null!");
      return null;
    }
    if (new DisplayObject(p).isTextField()) return new TextField(p);
    Logcat.logError("Not a TextField");
    return null;
  }
  static findChildIndexByName(instance, name) {
    const names = instance.add(O.names).readPointer();
    if (names.isNull()) {
      EDebugger.addMessage(EDebugger.ERROR, "Child Name List is null");
      return -1;
    }
    const count = instance.add(O.count).readS16();
    if (count <= 0) {
      EDebugger.addMessage(
        EDebugger.ERROR,
        count === 0 ? "Child count equals zero!" : "Child count is lower than zero!",
      );
      return -1;
    }
    name = name.toLowerCase();
    for (let i = 0; i < count; i++) {
      const p = names.add(i * Process.pointerSize).readPointer();
      if (!p.isNull()) {
        const n = p.readUtf8String();
        if (n !== null && n.toLowerCase() === name) return i;
      }
    }
    return -1;
  }
  getMovieClipByName(name) {
    return MovieClip.getMovieClipByName(this.instance, name);
  }
  getTextFieldByName(name) {
    return MovieClip.getTextFieldByName(this.instance, name);
  }
  getChildCount() {
    return this.instance.add(O.count).readS16();
  }
  getChildArray() {
    return this.instance.add(O.children).readPointer();
  }
  getChildNameList() {
    return this.instance.add(O.names).readPointer();
  }
  gotoAndStopFrameIndex(index) {
    gotoFrame(this.instance, index);
    return this;
  }
  setInteractiveRecursive(v) {
    return interactive(this.instance, v);
  }
  setText(name, text) {
    const tf = this.getTextFieldByName(name);
    if (tf !== null) tf.text = text;
    return this;
  }
  getChildById(id) {
    const p = this.getChildArray()
      .add(id * Process.pointerSize)
      .readPointer();
    if (p.isNull()) {
      EDebugger.addMessage(EDebugger.ERROR, "Child is null!");
      return null;
    }
    return MovieClip.castInstanceToClass(p);
  }
  static castInstanceToClass(p) {
    const o = new DisplayObject(p);
    switch (o.type) {
      case "MovieClip":
        return new MovieClip(p);
      case "TextField":
        return new TextField(p);
      case "Sprite":
        return new Sprite(p);
      case "CustomButton":
        return new CustomButton(p);
      case "GUIContainer":
        return new GUIContainer(p);
      default:
        return new DisplayObject(p);
    }
  }
}
module.exports = { MovieClip };
