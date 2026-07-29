// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { CustomButton } = require("../../../titan/client/common/flash/CustomButton");
const { DisplayObject } = require("../../../titan/client/common/flash/DisplayObject");
const { TextField } = require("../../../titan/client/common/flash/TextField");

const createHook = Libg.offset(6343844, 6269564);

class StreamItem {
  static patch() {
    Interceptor.attach(createHook, {
      onEnter(args) {
        this.item = new CustomButton(args[0]);
      },
      onLeave() {
        StreamItem.patchAllTextFields(this.item.getMovieClip());
      },
    });
  }

  static patchAllTextFields(movieClip) {
    const count = movieClip.getChildCount();
    if (count <= 0) return;
    const children = movieClip.getChildArray();
    if (children.isNull()) return;
    for (let index = 0; index < count; index++) {
      const child = children.add(index * Process.pointerSize).readPointer();
      if (child.isNull() || !new DisplayObject(child).isTextField()) continue;
      const textField = new TextField(child);
      textField.colorTag = true;
      textField.setTextScaleIfNecessary(textField.text);
    }
  }
}

exports.StreamItem = StreamItem;
