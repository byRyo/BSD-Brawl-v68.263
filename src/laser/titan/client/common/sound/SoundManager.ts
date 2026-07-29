// @ts-nocheck
const { LogicDataTables } = require("../../../../client/logic/data/LogicDataTables"),
  { Libg } = require("../../../../../lib/Libg"),
  { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");
const managerAddress = Libg.offset(19848792, 18156304),
  playSoundNative = new NativeFunction(Libg.offset(10160700, 9541864), "void", [
    "pointer",
    "pointer",
    "float",
    "float",
    "int",
    "float",
    "int",
  ]),
  playMusicNative = new NativeFunction(Libg.offset(10162904, 9546676), "void", ["pointer"]),
  stopMusicNative = new NativeFunction(Libg.offset(10159124, 9543456), "void", [
    "pointer",
    "pointer",
  ]),
  stopAllNative = new NativeFunction(Libg.offset(10155068, 9540748), "void", ["pointer"]),
  pauseNative = new NativeFunction(Libg.offset(18501936, 1018644), "void", ["pointer", "bool"]),
  channelAddress = Libg.offset(19927632, 18171600),
  O = { volume: 160, fadeTarget: 184, fadeTime: 188, fadeMode: 192, groupA: 0, groupB: 196 };
for (const k in O) O[k] = LogicMemory.offset(O[k]);
class SoundManager {
  static getInstance() {
    return managerAddress.readPointer();
  }
  static playSound(name) {
    const s = LogicDataTables.getTableItemByName(LogicDataTables.table.Sounds, name);
    if (s) playSoundNative(this.getInstance(), s.instance, 1, 0, -1, 1, -1);
  }
  static playMusic(music) {
    playMusicNative(this.getInstance(), music.instance);
  }
  static stopMusic() {
    stopMusicNative(this.getInstance());
  }
  static stopAllSounds() {
    stopAllNative(this.getInstance());
  }
  static getCurrentMusicVolume() {
    return this.getInstance().add(O.volume).readFloat();
  }
  static fadeMusic(volume, time) {
    const p = this.getInstance();
    p.add(O.volume).writeFloat(this.getCurrentMusicVolume());
    p.add(O.fadeTarget).writeFloat(volume);
    p.add(O.fadeTime).writeFloat(time);
    p.add(O.fadeMode).writeInt(0);
  }
  static cycleMusicVolume() {
    const volumes = [0, 0.5, 1];
    this.musicVolumeStep = (this.musicVolumeStep + 1) % volumes.length;
    const v = volumes[this.musicVolumeStep];
    this.fadeMusic(v, 0.1);
    return v;
  }
  static getMusicChannelGroup() {
    const p = channelAddress.readPointer();
    return p.isNull() ? NULL : p.add(O.groupA).readPointer().add(O.groupB).readPointer();
  }
  static playMusicByName(name) {
    const m = LogicDataTables.getTableItemByName(LogicDataTables.table.Music, name);
    if (m !== null) this.playMusic(m);
  }
  static toggleBossMusic() {
    this.bossMusicActive = !this.bossMusicActive;
    this.playMusicByName(
      this.bossMusicActive ? this.BOSS_MUSIC_NAME : this.DEFAULT_BATTLE_MUSIC_NAME,
    );
    return this.bossMusicActive;
  }
  static toggleMusicPaused() {
    const group = this.getMusicChannelGroup();
    if (!group.isNull()) {
      this.musicPaused = !this.musicPaused;
      pauseNative(group, +this.musicPaused);
    }
    return this.musicPaused;
  }
  static patch() {}
}
SoundManager.musicVolumeStep = 2;
SoundManager.bossMusicActive = false;
SoundManager.BOSS_MUSIC_NAME = "30_sec_panic";
SoundManager.DEFAULT_BATTLE_MUSIC_NAME = "BattleMusic";
SoundManager.musicPaused = false;
module.exports = { SoundManager };
