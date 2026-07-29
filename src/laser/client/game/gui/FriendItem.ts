// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { CustomButton } = require("../../../titan/client/common/flash/CustomButton");
const { Config } = require("../../../../suitcase/config/Config");

const FriendItem_ctor = Libg.offset(5321160, 5416456);

class FriendItem {
  static patch() {
    Interceptor.attach(FriendItem_ctor, {
      onEnter(args) {
        this.friendItem = new CustomButton(args[0]);
      },
      onLeave() {
        if (!Config.config.FriendListOptimization) return;
        const clip = this.friendItem.getMovieClip();
        const playerIcon = clip.getMovieClipByName("player_icon");
        const rankIcon = clip.getMovieClipByName("rank_icon");
        const friendPicture = clip.getTextFieldByName("friend_picture");
        if (playerIcon) playerIcon.visibility = true;
        if (rankIcon) rankIcon.removeFromParent();
        if (friendPicture) friendPicture.removeFromParent();
      },
    });
  }
}

module.exports = { FriendItem };
