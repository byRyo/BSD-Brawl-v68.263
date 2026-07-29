// @ts-nocheck
const { Libg } = require("../../lib/Libg");
const { GUIContainer } = require("../../laser/titan/client/common/flash/GUIContainer");
const { MovieClip } = require("../../laser/titan/client/common/flash/MovieClip");
const { StringTable } = require("../../laser/client/game/text/StringTable");
const { GameButton } = require("../../laser/client/game/gui/GameButton");
const { SharedReplay } = require("./SharedReplay");
const addEntryAddress = Libg.offset(8001432, 8557960);
class BattleLogShareButton {
  static patch() {
    Interceptor.attach(addEntryAddress, {
      onEnter(args) {
        this.entry = args[0];
      },
      onLeave() {
        try {
          BattleLogShareButton.attachCopyButton(this.entry);
        } catch (error) {
          console.log(error);
        }
      },
    });
  }
  static attachCopyButton(entry) {
    if (entry.isNull()) return;
    const container = new GUIContainer(entry).getMovieClip();
    if (container.instance.isNull()) return;
    const replayButton = container.getChildByName("replay_button");
    if (!replayButton || !replayButton.visibility) return;
    const clip = StringTable.getMovieClip_safe("sc/ui.sc", "share_replay_button");
    if (!clip) return;
    const child = clip.getChildByName("battlelog_2v2_entry");
    if (!child) return;
    child.removeFromParent();
    child.setXY(0, 0);
    child.visibility = true;
    const button = new GameButton();
    button.setMovieClip(new MovieClip(child.instance), true);
    const tint = button.getMovieClip().getChildById(2).colorTransform;
    tint.c1r = tint.c2r = 215;
    tint.c1g = tint.c2g = 140;
    tint.c1b = tint.c2b = 30;
    tint.alpha = 255;
    button.setXY(replayButton.x - 98, replayButton.y);
    button.setCustomButtonListener(() => SharedReplay.copyLinkForBattleLogItem(entry));
    container.addChild(button.instance);
    const trophy = container.getChildByName("trophy_icon");
    if (trophy && trophy.visibility) {
      trophy.x -= button.width;
      container.getTextFieldByName("trophy_txt").x -= button.width;
    }
    this.keepAlive.push(button);
  }
}
BattleLogShareButton.keepAlive = [];
exports.BattleLogShareButton = BattleLogShareButton;
