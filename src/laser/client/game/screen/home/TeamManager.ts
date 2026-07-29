// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { PlayerInfo } = require("../../friends/PlayerInfo");
const { SoundManager } = require("../../../../titan/client/common/sound/SoundManager");

const teamManagerInstance = Libg.offset(19255200, 18154888);
const leaveRoom = new NativeFunction(Libg.offset(8061976, 7773392), "pointer", [
  "pointer",
  "pointer",
  "int",
]);
const joinRoom = new NativeFunction(Libg.offset(8064972, 7776236), "pointer", [
  "pointer",
  "pointer",
  "pointer",
]);
const roomJoinedAddress = Libg.offset(6363568, 6286424);
const roomLeftAddress = Libg.offset(6361640, 6284936);

class TeamManager {
  static getInstance() {
    const instance = teamManagerInstance.readPointer();
    if (instance.isNull()) return null;
    return instance;
  }

  static patch() {
    Interceptor.replace(
      leaveRoom,
      new NativeCallback(
        (self, arg1, arg2) => {
          leaveRoom(self, arg1, arg2);
          SoundManager.playSound("Leave_game_room");
          return self;
        },
        "pointer",
        ["pointer", "pointer", "int"],
      ),
    );

    Interceptor.replace(
      joinRoom,
      new NativeCallback(
        (self, arg1, arg2) => {
          joinRoom(self, arg1, arg2);
          SoundManager.playSound("Join_game_room");
          return self;
        },
        "pointer",
        ["pointer", "pointer", "pointer"],
      ),
    );

    Interceptor.attach(roomJoinedAddress, {
      onLeave() {
        PlayerInfo.isInGameroom = true;
      },
    });
    Interceptor.attach(roomLeftAddress, {
      onLeave() {
        PlayerInfo.isInGameroom = false;
        TeamManager.memberStatus = -1;
      },
    });
  }
}

exports.TeamManager = TeamManager;
