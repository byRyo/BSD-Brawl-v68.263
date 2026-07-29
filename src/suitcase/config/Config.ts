// @ts-nocheck
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;

const ModProperties_1 = require("./ModProperties");
const FileManager_1 = require("../filesystem/FileManager");
const Json_1 = require("../filesystem/Json");
const EDebugger_1 = require("../debug/EDebugger");
const ThemeSelector_1 = require("../modmenu/ThemeSelector");
const Outline_1 = require("../../laser/client/game/renderer3d/Outline");
const Libc_1 = require("../../lib/Libc");
const TSChaCha20_1 = require("../crypto/TSChaCha20");
const { SkinSelector } = require("../feature/SkinSelector");
const INativeDialogListener_1 = require("../../laser/titan/client/native/INativeDialogListener");

class d {
  static init() {
    FileManager_1.FileManager.init();
    this.config = Object.assign({}, this.configStatic);
    if (ModProperties_1.ModProperties.environment !== "release") {
      this.modVersionInfo = "".concat(
        ModProperties_1.ModProperties.version,
        " (",
        ModProperties_1.ModProperties.environment,
        ")",
      );
    } else {
      this.modVersionInfo = ModProperties_1.ModProperties.version;
    }
    this._lobbyInfo = "BSD Brawl v".concat(this.modVersionInfo, "{jointModName}\n");
    this.useDebugLogging;

    const savedConfig = JSON.parse(
      FileManager_1.FileManager.readFile(FileManager_1.FileManager.modSaveFilePath, "r"),
    );
    for (const key in savedConfig) {
      if (!this.config.hasOwnProperty(key)) delete savedConfig[key];
    }
    FileManager_1.FileManager.writeToFile(
      FileManager_1.FileManager.modSaveFilePath,
      "w",
      Json_1.Json.formatJSONString(Object.assign(this.config, savedConfig)),
    );
    this.config = Object.assign(this.config, savedConfig);

    if (FileManager_1.FileManager.isFilepath(FileManager_1.FileManager.logFilePath)) {
      EDebugger_1.EDebugger.logsObject = JSON.parse(
        FileManager_1.FileManager.readFile(FileManager_1.FileManager.logFilePath, "r"),
      );
    }
    if (this.config.ThemeBackgroundID >= 0) {
      ThemeSelector_1.ThemeSelectorManager.themeID = this.config.ThemeBackgroundID;
    }
    Outline_1.Outline.outlineColor = this.config.OutlineColor;

    const doNotPatchData = FileManager_1.FileManager.readAAsset("bsd/doNotPatch.json", "r");
    if (doNotPatchData) {
      const doNotPatch = JSON.parse(doNotPatchData);
      for (const path of doNotPatch) {
        const filepath =
          Process.platform === "darwin"
            ? "".concat(FileManager_1.FileManager.rootDirPath, "/", path)
            : "".concat(FileManager_1.FileManager.rootDirPath, "/update/", path);
        if (FileManager_1.FileManager.isFilepath(filepath)) {
          Libc_1.Libc.unlink(Memory.allocUtf8String(filepath));
        }
      }
    }

    const cipher = new TSChaCha20_1.TSChaCha20(
      TSChaCha20_1.TSChaCha20.key,
      TSChaCha20_1.TSChaCha20.nonce,
    );
    const temporaryConfigPath = FileManager_1.FileManager.saveDirPath + "/config.json.temp";
    FileManager_1.FileManager.writeToFile(
      temporaryConfigPath,
      "wb",
      cipher.decrypt(
        new Uint8Array(FileManager_1.FileManager.readAAsset("bsd/internal/config.json.crypt", "rb"))
          .buffer,
      ),
    );
    SkinSelector.skinDataMap = {
      ShotgunGirl: {
        BanditGirlDefault: {
          a: [],
          p: [
            "ShotgunGirlProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
            "ShotgunGirlUltiProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        BanditGirlBandita: {
          a: [],
          p: [
            "ShotgunGirlProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
            "ShotgunGirlUltiProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        BanditGirlPrereg: {
          a: [],
          p: [
            "Shelly002Projectile",
            "ShotgunGirlOverchargedUltiProjectile",
            "Shelly002UltiProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShotgunGirlWitch: {
          a: [],
          p: [
            "Shelly003Projectile",
            "ShotgunGirlOverchargedUltiProjectile",
            "Shelly003UltiProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShotgunGirlFootball: {
          a: [],
          p: [
            "ShotgunGirlProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
            "ShotgunGirlUltiProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShotgunGirlGold: {
          a: [],
          p: [
            "ShotgunGirlProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
            "ShotgunGirlUltiProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShotgunGirlSilver: {
          a: [],
          p: [
            "ShotgunGirlProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
            "ShotgunGirlUltiProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShotgunGirlBocaJuniors: {
          a: [],
          p: [
            "ShotgunGirlProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
            "ShotgunGirlUltiProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShotgunGirlAmerica: {
          a: [],
          p: [
            "ShotgunGirlProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
            "ShotgunGirlUltiProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShotgunGirlUDeChile: {
          a: [],
          p: [
            "ShotgunGirlProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
            "ShotgunGirlUltiProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShotgunGirlPrincess: {
          a: [],
          p: [
            "Shelly005Projectile",
            "ShotgunGirlOverchargedUltiProjectile",
            "Shelly005UltiProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShotgunGirloldschool: {
          a: [],
          p: [
            "ShotgunGirlProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
            "ShotgunGirlUltiProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShotgunGirlBrawloween: {
          a: [],
          p: [
            "Shelly006Projectile",
            "ShotgunGirlOverchargedUltiProjectile",
            "Shelly006UltiProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShotgunGirlDancer: {
          a: [],
          p: [
            "Shelly007Projectile",
            "ShotgunGirlOverchargedUltiProjectile",
            "Shelly007UltiProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShotgunGirlDancerBlue: {
          a: [],
          p: [
            "Shelly007Projectile",
            "ShotgunGirlOverchargedUltiProjectile",
            "Shelly007UltiProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShotgunGirlDancerPurple: {
          a: [],
          p: [
            "Shelly007Projectile",
            "ShotgunGirlOverchargedUltiProjectile",
            "Shelly007UltiProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShotgunGirlSquad: {
          a: [],
          p: [
            "Shelly008Projectile",
            "ShotgunGirlOverchargedUltiProjectile",
            "Shelly008UltiProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        BanditGirlStar_remake: {
          a: [],
          p: [
            "Shelly009Projectile",
            "ShotgunGirlOverchargedUltiProjectile",
            "Shelly009UltiProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShotgunGirlClassic_white: {
          a: [],
          p: [
            "ShotgunGirlProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
            "ShotgunGirlUltiProjectile",
            "ShotgunGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      Gunslinger: {
        GunSlingerDefault: {
          a: [],
          p: [
            "GunslingerProjectile",
            "GunslingerOverchargedUltiProjectile",
            "GunslingerUltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunSlingerRockstar: {
          a: [],
          p: [
            "GunslingerProjectile",
            "GunslingerOverchargedUltiProjectile",
            "GunslingerUltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunSlingerHanbok: {
          a: [],
          p: [
            "Colt002Projectile",
            "GunslingerOverchargedUltiProjectile",
            "Colt002UltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunslingerOutlaw: {
          a: [],
          p: [
            "GunslingerProjectile",
            "GunslingerOverchargedUltiProjectile",
            "GunslingerUltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunslingerPirate: {
          a: [],
          p: [
            "Colt003Projectile",
            "GunslingerOverchargedUltiProjectile",
            "Colt003UltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunslingerPlayer: {
          a: [],
          p: [
            "Colt004Projectile",
            "GunslingerOverchargedUltiProjectile",
            "Colt004UltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunslingerBadass: {
          a: [],
          p: [
            "Colt006Projectile",
            "GunslingerOverchargedUltiProjectile",
            "Colt006UltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunSlingerRiverPlate: {
          a: [],
          p: [
            "GunslingerProjectile",
            "GunslingerOverchargedUltiProjectile",
            "GunslingerUltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunSlingerCerroPorteno: {
          a: [],
          p: [
            "GunslingerProjectile",
            "GunslingerOverchargedUltiProjectile",
            "GunslingerUltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunSlingerAtlNacional: {
          a: [],
          p: [
            "GunslingerProjectile",
            "GunslingerOverchargedUltiProjectile",
            "GunslingerUltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunslingerClubAmerica: {
          a: [],
          p: [
            "GunslingerProjectile",
            "GunslingerOverchargedUltiProjectile",
            "GunslingerUltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunslingerTrueGold: {
          a: [],
          p: [
            "GunslingerProjectile",
            "GunslingerOverchargedUltiProjectile",
            "GunslingerUltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunslingerTrueSilver: {
          a: [],
          p: [
            "GunslingerProjectile",
            "GunslingerOverchargedUltiProjectile",
            "GunslingerUltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunslingerHeist: {
          a: [],
          p: [
            "GunslingerProjectile",
            "GunslingerOverchargedUltiProjectile",
            "GunslingerUltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunslingerPaintball: {
          a: [],
          p: [
            "Colt005Projectile",
            "GunslingerOverchargedUltiProjectile",
            "Colt005UltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunslingerMonkey: {
          a: [],
          p: [
            "Colt007Projectile",
            "GunslingerOverchargedUltiProjectile",
            "Colt007UltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunslingerDarkAngel: {
          a: [],
          p: [
            "Colt008Projectile",
            "GunslingerOverchargedUltiProjectile",
            "Colt008UltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunslingerMecha: {
          a: [],
          p: [
            "Colt009Projectile",
            "GunslingerOverchargedUltiProjectile",
            "Colt009UltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunslingerMechaGold: {
          a: [],
          p: [
            "Colt009Projectile",
            "GunslingerOverchargedUltiProjectile",
            "Colt009UltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunslingerMechaPurple: {
          a: [],
          p: [
            "Colt009Projectile",
            "GunslingerOverchargedUltiProjectile",
            "Colt009UltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunslingerDarkAngelChroma: {
          a: [],
          p: [
            "Colt008Projectile",
            "GunslingerOverchargedUltiProjectile",
            "Colt008UltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunSlingerWoody: {
          a: [],
          p: [
            "Colt010Projectile",
            "GunslingerOverchargedUltiProjectile",
            "Colt010UltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunslingerRoyalAgent: {
          a: [],
          p: [
            "Colt002Projectile",
            "GunslingerOverchargedUltiProjectile",
            "Colt002UltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunSlinger2025RankedProgrsesionSkinLevel1: {
          a: [],
          p: [
            "GunslingerProjectile",
            "GunslingerOverchargedUltiProjectile",
            "GunslingerUltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunSlinger2025RankedProgrsesionSkinLevel2: {
          a: [],
          p: [
            "GunslingerProjectile",
            "GunslingerOverchargedUltiProjectile",
            "GunslingerUltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunSlinger2025RankedProgrsesionSkinLevel3: {
          a: [],
          p: [
            "Colt011Projectile",
            "GunslingerOverchargedUltiProjectile",
            "Colt011UltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunSlinger2025RankedProgrsesionSkinLevel4: {
          a: [],
          p: [
            "Colt011Projectile",
            "GunslingerOverchargedUltiProjectile",
            "Colt011UltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunSlinger2025RankedProgrsesionSkinLevel5: {
          a: [],
          p: [
            "Colt011Projectile",
            "GunslingerOverchargedUltiProjectile",
            "Colt011UltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunSlinger2025RankedProgrsesionSkinLevel6: {
          a: [],
          p: [
            "Colt011Projectile",
            "GunslingerOverchargedUltiProjectile",
            "Colt011UltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunSlinger2025RankedProgrsesionSkinLevel7: {
          a: [],
          p: [
            "Colt011Projectile",
            "GunslingerOverchargedUltiProjectile",
            "Colt011UltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunSlinger2025RankedProgrsesionSkinLevel8: {
          a: [],
          p: [
            "Colt011Projectile",
            "GunslingerOverchargedUltiProjectile",
            "Colt011UltiProjectile",
            "GunslingerOverchargedUltiProjectile",
          ],
          i: [],
        },
        GunSlinger2025RankedProgrsesionSkinLevel9: {
          a: [],
          p: [
            "Colt011Projectile",
            "Colt011UltiProjectile",
            "ColtRankedOverchargedUltiProjectile",
            "ColtRankedOverchargedBuddyProjectile",
          ],
          i: [],
        },
        GunSlinger2025RankedProgrsesionSkinLevel10: {
          a: [],
          p: [
            "Colt011Projectile",
            "Colt011UltiProjectile",
            "ColtRankedOverchargedUltiProjectile",
            "ColtRankedOverchargedBuddyProjectile",
          ],
          i: [],
        },
        GunSlinger2025RankedProgrsesionSkinLevel11: {
          a: [],
          p: [
            "Colt011Projectile",
            "Colt011UltiProjectile",
            "ColtRankedOverchargedUltiProjectile",
            "ColtRankedOverchargedBuddyProjectile",
          ],
          i: [],
        },
      },
      BullDude: {
        BullGuyDefault: { a: ["BullSlowArea"], p: ["BullDudeProjectile"], i: [] },
        BullGuyHair: { a: ["BullSlowArea_010"], p: ["Bull007Projectile"], i: [] },
        BullGuyFootbull: { a: ["BullSlowArea"], p: ["BullDudeProjectile"], i: [] },
        BullDudeFootbullBlue: { a: ["BullSlowArea"], p: ["BullDudeProjectile"], i: [] },
        BullDudeBarbking: { a: ["BullSlowArea_002"], p: ["Bull002Projectile"], i: [] },
        BullDudeGold: { a: ["BullSlowArea"], p: ["BullDudeProjectile"], i: [] },
        BullDudeSilver: { a: ["BullSlowArea"], p: ["BullDudeProjectile"], i: [] },
        BullDudeOx: { a: ["BullSlowArea_003"], p: ["Bull003Projectile"], i: [] },
        BullDudeTerminator: { a: ["BullSlowArea_004"], p: ["Bull004Projectile"], i: [] },
        BullDudeLion: { a: ["BullSlowArea_005"], p: ["Bull006Projectile"], i: [] },
        BullDudeMang: { a: ["BullSlowArea_006"], p: ["Bull005Projectile"], i: [] },
        BullDudeAlleycat: { a: ["BullSlowArea_007"], p: ["Bull008Projectile"], i: [] },
        BullDudeViking_remake_orange: { a: ["BullSlowArea_010"], p: ["Bull007Projectile"], i: [] },
        BullDudeGreek: { a: ["BullSlowArea_008"], p: ["Bull009Projectile"], i: [] },
        BullGuyRare: { a: ["BullSlowArea"], p: ["BullDudeProjectile"], i: [] },
        BullDudeDemon: { a: ["BullSlowArea_009"], p: ["Bull011Projectile"], i: [] },
        BullGuyStrange: { a: ["BullSlowArea_012"], p: ["Bull012Projectile"], i: [] },
      },
      RocketGirl: {
        RocketGirlDefault: {
          a: [],
          p: [
            "RocketGirlProjectile",
            "RocketGirlUltiOverchargedProjectile",
            "RocketGirlUltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlBeach: {
          a: [],
          p: [
            "Brock004Projectile",
            "RocketGirlUltiOverchargedProjectile",
            "Brock004UltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlBoombox: {
          a: [],
          p: [
            "RocketGirlProjectile",
            "RocketGirlUltiOverchargedProjectile",
            "RocketGirlUltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlCny: {
          a: [],
          p: [
            "Brock002Projectile",
            "RocketGirlUltiOverchargedProjectile",
            "Brock002UltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlHotrod: {
          a: [],
          p: [
            "Brock003Projectile",
            "RocketGirlUltiOverchargedProjectile",
            "Brock003UltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlRanger: {
          a: [],
          p: [
            "Brock005Projectile",
            "RocketGirlUltiOverchargedProjectile",
            "Brock005UltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlOg: {
          a: [],
          p: [
            "RocketGirlProjectile",
            "RocketGirlUltiOverchargedProjectile",
            "RocketGirlUltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlSilver: {
          a: [],
          p: [
            "RocketGirlProjectile",
            "RocketGirlUltiOverchargedProjectile",
            "RocketGirlUltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlGold: {
          a: [],
          p: [
            "RocketGirlProjectile",
            "RocketGirlUltiOverchargedProjectile",
            "RocketGirlUltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlDelivery: {
          a: [],
          p: [
            "Brock006Projectile",
            "RocketGirlUltiOverchargedProjectile",
            "Brock006UltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlGhost: {
          a: [],
          p: [
            "RocketGirlProjectile",
            "RocketGirlUltiOverchargedProjectile",
            "RocketGirlUltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlZeus: {
          a: [],
          p: [
            "Brock007Projectile",
            "RocketGirlUltiOverchargedProjectile",
            "Brock007UltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlBrown: {
          a: [],
          p: [
            "Brock008Projectile",
            "RocketGirlUltiOverchargedProjectile",
            "Brock008UltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlVirus: {
          a: [],
          p: [
            "Brock009Projectile",
            "RocketGirlUltiOverchargedProjectile",
            "Brock009UltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlRanger_red: {
          a: [],
          p: [
            "Brock010ProjectileRed",
            "RocketGirlUltiOverchargedProjectile",
            "Brock010UltiProjectileRed",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlRanger_blue: {
          a: [],
          p: [
            "Brock010ProjectileBlue",
            "RocketGirlUltiOverchargedProjectile",
            "Brock010UltiProjectileBlue",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlRanger_yellow: {
          a: [],
          p: [
            "Brock010ProjectileYellow",
            "RocketGirlUltiOverchargedProjectile",
            "Brock010UltiProjectileYellow",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlRanger_pink: {
          a: [],
          p: [
            "Brock010ProjectilePink",
            "RocketGirlUltiOverchargedProjectile",
            "Brock010UltiProjectilePink",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlRanger_black: {
          a: [],
          p: [
            "Brock010ProjectileBlack",
            "RocketGirlUltiOverchargedProjectile",
            "Brock010UltiProjectileBlack",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlVirusRGB: {
          a: [],
          p: [
            "Brock009Projectile",
            "RocketGirlUltiOverchargedProjectile",
            "Brock009UltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlVirusGold: {
          a: [],
          p: [
            "Brock009Projectile",
            "RocketGirlUltiOverchargedProjectile",
            "Brock009UltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlClassic_white: {
          a: [],
          p: [
            "RocketGirlProjectile",
            "RocketGirlUltiOverchargedProjectile",
            "RocketGirlUltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirl_Original: {
          a: [],
          p: [
            "RocketGirlProjectile",
            "RocketGirlUltiOverchargedProjectile",
            "RocketGirlUltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlOriginal_gold: {
          a: [],
          p: [
            "RocketGirlProjectile",
            "RocketGirlUltiOverchargedProjectile",
            "RocketGirlUltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlOriginal_silver: {
          a: [],
          p: [
            "RocketGirlProjectile",
            "RocketGirlUltiOverchargedProjectile",
            "RocketGirlUltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
        RocketGirlSteamPunk: {
          a: [],
          p: [
            "Brock011Projectile",
            "RocketGirlUltiOverchargedProjectile",
            "Brock011UltiProjectile",
            "RocketGirlUltiOverchargedProjectile",
          ],
          i: [],
        },
      },
      TntDude: {
        TntGuyDefault: {
          a: [],
          p: [
            "TntDudeProjectile",
            "TntDudeOverchargedUltiProjectile",
            "TntDudeUltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntGuySanta: {
          a: [],
          p: [
            "TntDudeSantaProjectile",
            "TntDudeOverchargedUltiProjectile",
            "TntDudeSantaUltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntGuyChef: {
          a: [],
          p: [
            "TntDudeChefProjectile",
            "TntDudeOverchargedUltiProjectile",
            "TntDudeChefUltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntDudeMecha: {
          a: [],
          p: [
            "Mike004Projectile",
            "TntDudeOverchargedUltiProjectile",
            "Mike004UltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntDudeFootball: {
          a: [],
          p: [
            "Mike005Projectile",
            "TntDudeOverchargedUltiProjectile",
            "Mike005UltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntDudeSnowtel: {
          a: [],
          p: [
            "Mike006Projectile",
            "TntDudeOverchargedUltiProjectile",
            "Mike006UltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntDudePsg: {
          a: [],
          p: [
            "Mike005Projectile",
            "TntDudeOverchargedUltiProjectile",
            "Mike005UltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntDudeFlamengo: {
          a: [],
          p: [
            "Mike005Projectile",
            "TntDudeOverchargedUltiProjectile",
            "Mike005UltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntDudeLduQuito: {
          a: [],
          p: [
            "Mike005Projectile",
            "TntDudeOverchargedUltiProjectile",
            "Mike005UltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntDudeChivas: {
          a: [],
          p: [
            "Mike005Projectile",
            "TntDudeOverchargedUltiProjectile",
            "Mike005UltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntDudeToxic: {
          a: [],
          p: [
            "Mike007Projectile",
            "TntDudeOverchargedUltiProjectile",
            "Mike007UltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntDudeGold: {
          a: [],
          p: [
            "TntDudeProjectile",
            "TntDudeOverchargedUltiProjectile",
            "TntDudeUltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntDudeSilver: {
          a: [],
          p: [
            "TntDudeProjectile",
            "TntDudeOverchargedUltiProjectile",
            "TntDudeUltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntDudeRetro: {
          a: [],
          p: [
            "TntDudeProjectile",
            "TntDudeOverchargedUltiProjectile",
            "TntDudeUltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntDudeTengu: {
          a: [],
          p: [
            "Mike008Projectile",
            "TntDudeOverchargedUltiProjectile",
            "Mike008UltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntDudeDynastic: {
          a: [],
          p: [
            "Mike009Projectile",
            "TntDudeOverchargedUltiProjectile",
            "Mike009UltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntDudeClassic_yellow: {
          a: [],
          p: [
            "TntDudeProjectile",
            "TntDudeOverchargedUltiProjectile",
            "TntDudeUltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntDudeZombie: {
          a: [],
          p: [
            "Mike010Projectile",
            "TntDudeOverchargedUltiProjectile",
            "Mike010UltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntGuyBrawlentine: {
          a: [],
          p: [
            "Mike011Projectile",
            "TntDudeOverchargedUltiProjectile",
            "Mike011UltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntDudeChristmas: {
          a: [],
          p: [
            "TntDudeSantaProjectile",
            "TntDudeOverchargedUltiProjectile",
            "TntDudeSantaUltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntGuyRare: {
          a: [],
          p: [
            "TntDudeProjectile",
            "TntDudeOverchargedUltiProjectile",
            "TntDudeUltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntGuyProgressionSkinLevel1: {
          a: [],
          p: [
            "TntDudeProjectile",
            "TntDudeOverchargedUltiProjectile",
            "TntDudeUltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntGuyProgressionSkinLevel2: {
          a: [],
          p: [
            "TntDudeProjectile",
            "TntDudeOverchargedUltiProjectile",
            "TntDudeUltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntGuyProgressionSkinLevel3: {
          a: [],
          p: [
            "Mike012Projectile",
            "TntDudeOverchargedUltiProjectile",
            "Mike012UltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntGuyProgressionSkinLevel4: {
          a: [],
          p: [
            "Mike012Projectile",
            "TntDudeOverchargedUltiProjectile",
            "Mike012UltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntGuyProgressionSkinLevel5: {
          a: [],
          p: [
            "Mike012Projectile",
            "TntDudeOverchargedUltiProjectile",
            "Mike012UltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntGuyProgressionSkinLevel6: {
          a: [],
          p: [
            "Mike012Projectile",
            "TntDudeOverchargedUltiProjectile",
            "Mike012UltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntGuyProgressionSkinLevel7: {
          a: [],
          p: [
            "Mike012Projectile",
            "TntDudeOverchargedUltiProjectile",
            "Mike012UltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntGuyProgressionSkinLevel8: {
          a: [],
          p: [
            "Mike012Projectile",
            "TntDudeOverchargedUltiProjectile",
            "Mike012UltiProjectile",
            "TntDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        TntGuyProgressionSkinLevel9: {
          a: [],
          p: [
            "Mike012Projectile",
            "Mike012UltiProjectile",
            "Mike012OverchargedUltiProjectile",
            "Mike012OverchargedUltiProjectile",
          ],
          i: [],
        },
        TntGuyProgressionSkinLevel10: {
          a: [],
          p: [
            "Mike012Projectile",
            "Mike012UltiProjectile",
            "Mike012OverchargedUltiProjectile",
            "Mike012OverchargedUltiProjectile",
          ],
          i: [],
        },
        TntGuyProgressionSkinLevel11: {
          a: [],
          p: [
            "Mike012Projectile",
            "Mike012UltiProjectile",
            "Mike012OverchargedUltiProjectile",
            "Mike012OverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      Luchador: {
        LuchadorDefault: { a: [], p: ["PrimoDefProjectile"], i: [] },
        LuchadorRudo: { a: [], p: ["Primo004Projectile"], i: [] },
        LuchadorRey: { a: [], p: ["Primo008Projectile"], i: [] },
        LuchadorBrown: { a: [], p: ["Primo003Projectile"], i: [] },
        LuchadorGold: { a: [], p: ["PrimoDefProjectile"], i: [] },
        LuchadorSilver: { a: [], p: ["PrimoDefProjectile"], i: [] },
        LuchadorAtomic: { a: [], p: ["PrimoDefProjectile"], i: [] },
        LuchadorUniversitario: { a: [], p: ["PrimoDefProjectile"], i: [] },
        LuchadorClubNacional: { a: [], p: ["PrimoDefProjectile"], i: [] },
        LuchadorCorinthians: { a: [], p: ["PrimoDefProjectile"], i: [] },
        LuchadorDragon: { a: [], p: ["Primo005Projectile"], i: [] },
        LuchadorDragonChroma: { a: [], p: ["Primo005Projectile"], i: [] },
        LuchadorTiger: { a: [], p: ["Primo006Projectile"], i: [] },
        LuchadorCorazon: { a: [], p: ["Primo007Projectile"], i: [] },
        LuchadorButler: { a: [], p: ["Primo009Projectile"], i: [] },
        LuchadorSuperbowl: { a: [], p: ["Primo010Projectile"], i: [] },
        LuchadorBabyShark: { a: [], p: ["Primo011Projectile"], i: [] },
        LuchadorSB: { a: [], p: ["Primo012Projectile"], i: [] },
        LuchadorVampire: { a: [], p: ["PrimoDefProjectile"], i: [] },
        LuchadorCarreta: { a: [], p: ["Primo013Projectile"], i: [] },
      },
      TrickshotDude: {
        TrickshotDefault: {
          a: [],
          p: [
            "TrickshotDudeProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
            "TrickshotDudeUltiProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
          ],
          i: [],
        },
        TrickshotGold: {
          a: [],
          p: [
            "Rico003Projectile",
            "TrickshotDudeUltiOverchargedProjectile",
            "Rico003UltiProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
          ],
          i: [],
        },
        TrickshotPopcorn: {
          a: [],
          p: [
            "Rico002Projectile",
            "TrickshotDudeUltiOverchargedProjectile",
            "Rico002UltiProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
          ],
          i: [],
        },
        TrickshotDudeTotal: {
          a: [],
          p: [
            "TrickshotDudeProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
            "TrickshotDudeUltiProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
          ],
          i: [],
        },
        TrickshotDudeBazaar: {
          a: [],
          p: [
            "Rico004Projectile",
            "TrickshotDudeUltiOverchargedProjectile",
            "Rico004UltiProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
          ],
          i: [],
        },
        TrickshotDudeTrueGold: {
          a: [],
          p: [
            "TrickshotDudeProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
            "TrickshotDudeUltiProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
          ],
          i: [],
        },
        TrickshotDudeSilver: {
          a: [],
          p: [
            "TrickshotDudeProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
            "TrickshotDudeUltiProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
          ],
          i: [],
        },
        TrickshotDudeChicken: {
          a: [],
          p: [
            "Rico005Projectile",
            "TrickshotDudeUltiOverchargedProjectile",
            "Rico005UltiProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
          ],
          i: [],
        },
        TrickshotDudeFirefly: {
          a: [],
          p: [
            "Rico006Projectile",
            "TrickshotDudeUltiOverchargedProjectile",
            "Rico006UltiProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
          ],
          i: [],
        },
        TrickshotDudeDevil: {
          a: [],
          p: [
            "Rico007Projectile",
            "TrickshotDudeUltiOverchargedProjectile",
            "Rico007UltiProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
          ],
          i: [],
        },
        TrickshotDudeClassic_red: {
          a: [],
          p: [
            "TrickshotDudeProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
            "TrickshotDudeUltiProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
          ],
          i: [],
        },
        TrickshotDudeKing_remake: {
          a: [],
          p: [
            "Rico008Projectile",
            "Rico008UltiProjectile",
            "Rico008lOverchargedUltiProjectile",
            "Rico008lOverchargedUltiProjectile",
          ],
          i: [],
        },
        TrickshotDudeKing_remakeBling: {
          a: [],
          p: [
            "Rico008Projectile",
            "Rico008UltiProjectile",
            "Rico008lOverchargedUltiProjectile",
            "Rico008lOverchargedUltiProjectile",
          ],
          i: [],
        },
        TrickshotDudeKing_remakePurple: {
          a: [],
          p: [
            "Rico008Projectile",
            "Rico008UltiProjectile",
            "Rico008lOverchargedUltiProjectile",
            "Rico008lOverchargedUltiProjectile",
          ],
          i: [],
        },
        TrickshotDudeRedjacket: {
          a: [],
          p: [
            "TrickshotDudeProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
            "TrickshotDudeUltiProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
          ],
          i: [],
        },
        TrickshotDudeAprilFools: {
          a: [],
          p: [
            "Rico009Projectile",
            "TrickshotDudeUltiOverchargedProjectile",
            "Rico009UltiProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
          ],
          i: [],
        },
        TrickshotBrawloween: {
          a: [],
          p: [
            "Rico010Projectile",
            "TrickshotDudeUltiOverchargedProjectile",
            "Rico010UltiProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
          ],
          i: [],
        },
        TrickshotBrawlentine: {
          a: [],
          p: [
            "Rico011Projectile",
            "TrickshotDudeUltiOverchargedProjectile",
            "Rico011UltiProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
          ],
          i: [],
        },
        TrickshotBrawlentineChroma1: {
          a: [],
          p: [
            "Rico011Projectile",
            "TrickshotDudeUltiOverchargedProjectile",
            "Rico011UltiProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
          ],
          i: [],
        },
        TrickshotBrawlentineChroma2: {
          a: [],
          p: [
            "Rico011Projectile",
            "TrickshotDudeUltiOverchargedProjectile",
            "Rico011UltiProjectile",
            "TrickshotDudeUltiOverchargedProjectile",
          ],
          i: [],
        },
      },
      Cactus: {
        CactusDefault: {
          a: [],
          p: [
            "CactusProjectile",
            "CactusOverchargedUltiProjectile",
            "CactusUltiProjectile",
            "CactusOverchargedUltiProjectile",
          ],
          i: [],
        },
        CactusPink: {
          a: [],
          p: [
            "Spike002Projectile",
            "CactusOverchargedUltiProjectile",
            "Spike002UltiProjectile",
            "CactusOverchargedUltiProjectile",
          ],
          i: [],
        },
        Cactusmecha: {
          a: [],
          p: [
            "Spike003Projectile",
            "CactusOverchargedUltiProjectile",
            "Spike003UltiProjectile",
            "CactusOverchargedUltiProjectile",
          ],
          i: [],
        },
        CactusMask: {
          a: [],
          p: [
            "CactusProjectile",
            "CactusOverchargedUltiProjectile",
            "CactusUltiProjectile",
            "CactusOverchargedUltiProjectile",
          ],
          i: [],
        },
        CactusLord: {
          a: [],
          p: [
            "Spike004Projectile",
            "CactusOverchargedUltiProjectile",
            "Spike004UltiProjectile",
            "CactusOverchargedUltiProjectile",
          ],
          i: [],
        },
        CactusGold: {
          a: [],
          p: [
            "CactusProjectile",
            "CactusOverchargedUltiProjectile",
            "CactusUltiProjectile",
            "CactusOverchargedUltiProjectile",
          ],
          i: [],
        },
        CactusSilver: {
          a: [],
          p: [
            "CactusProjectile",
            "CactusOverchargedUltiProjectile",
            "CactusUltiProjectile",
            "CactusOverchargedUltiProjectile",
          ],
          i: [],
        },
        CactusLog: {
          a: [],
          p: [
            "Spike005Projectile",
            "CactusOverchargedUltiProjectile",
            "Spike005UltiProjectile",
            "CactusOverchargedUltiProjectile",
          ],
          i: [],
        },
        CactusFireproof: {
          a: [],
          p: [
            "Spike006Projectile",
            "CactusOverchargedUltiProjectile",
            "Spike006UltiProjectile",
            "CactusOverchargedUltiProjectile",
          ],
          i: [],
        },
        Cactuscartoon: {
          a: [],
          p: [
            "Spike007Projectile",
            "CactusOverchargedUltiProjectile",
            "Spike007UltiProjectile",
            "CactusOverchargedUltiProjectile",
          ],
          i: [],
        },
        CactusPoop: {
          a: [],
          p: [
            "Spike008Projectile",
            "CactusOverchargedUltiProjectile",
            "Spike008UltiProjectile",
            "CactusOverchargedUltiProjectile",
          ],
          i: [],
        },
        CactusCarreta: {
          a: [],
          p: [
            "Spike009Projectile",
            "CactusOverchargedUltiProjectile",
            "Spike009UltiProjectile",
            "CactusOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      Barkeep: {
        BarkeepDefault: {
          a: [],
          p: [
            "BarkeepProjectile",
            "BarkeepOverchargedUltiProjectile",
            "BarkeepUltiProjectile",
            "BarkeepOverchargedUltiProjectile",
          ],
          i: [],
        },
        BarkeepGold: {
          a: [],
          p: [
            "Barley003Projectile",
            "BarkeepOverchargedUltiProjectile",
            "Barley003UltiProjectile",
            "BarkeepOverchargedUltiProjectile",
          ],
          i: [],
        },
        BarkeepWizard: {
          a: [],
          p: [
            "Barley002Projectile",
            "BarkeepOverchargedUltiProjectile",
            "Barley002UltiProjectile",
            "BarkeepOverchargedUltiProjectile",
          ],
          i: [],
        },
        BarkeepMs: {
          a: [],
          p: [
            "Barley005Projectile",
            "BarkeepOverchargedUltiProjectile",
            "Barley005UltiProjectile",
            "BarkeepOverchargedUltiProjectile",
          ],
          i: [],
        },
        BarkeepMaple: {
          a: [],
          p: [
            "Barley004Projectile",
            "BarkeepOverchargedUltiProjectile",
            "Barley004UltiProjectile",
            "BarkeepOverchargedUltiProjectile",
          ],
          i: [],
        },
        BarkeepWizardRed: {
          a: [],
          p: [
            "Barley002Projectile",
            "BarkeepOverchargedUltiProjectile",
            "Barley002UltiProjectile",
            "BarkeepOverchargedUltiProjectile",
          ],
          i: [],
        },
        BarkeepTrueGold: {
          a: [],
          p: [
            "BarkeepProjectile",
            "BarkeepOverchargedUltiProjectile",
            "BarkeepUltiProjectile",
            "BarkeepOverchargedUltiProjectile",
          ],
          i: [],
        },
        BarkeepTrueSilver: {
          a: [],
          p: [
            "BarkeepProjectile",
            "BarkeepOverchargedUltiProjectile",
            "BarkeepUltiProjectile",
            "BarkeepOverchargedUltiProjectile",
          ],
          i: [],
        },
        BarkeepUnicorn: {
          a: [],
          p: [
            "Barley006Projectile",
            "BarkeepOverchargedUltiProjectile",
            "Barley006UltiProjectile",
            "BarkeepOverchargedUltiProjectile",
          ],
          i: [],
        },
        BarkeepDrunken: {
          a: [],
          p: [
            "Barley007Projectile",
            "BarkeepOverchargedUltiProjectile",
            "Barley007UltiProjectile",
            "BarkeepOverchargedUltiProjectile",
          ],
          i: [],
        },
        BarkeepPirate: {
          a: [],
          p: [
            "Barley008Projectile",
            "BarkeepOverchargedUltiProjectile",
            "Barley008UltiProjectile",
            "BarkeepOverchargedUltiProjectile",
          ],
          i: [],
        },
        BarkeepBrawlAcademy: {
          a: [],
          p: [
            "Barley009Projectile",
            "BarkeepOverchargedUltiProjectile",
            "Barley009UltiProjectile",
            "BarkeepOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      Mechanic: {
        MechanicDefault: {
          a: [],
          p: [
            "MechanicProjectile1",
            "MechanicOverchargedUltiProjectile",
            "MechanicUltiProjectile",
            "MechanicOverchargedUltiProjectile",
            "MechanicTurretProjectile",
            "TurretElecProj",
            "MechanicOverchargedTurretElecProj",
          ],
          i: [],
        },
        MechanicKnight: {
          a: [],
          p: [
            "Jessie003Projectile1",
            "MechanicOverchargedUltiProjectile",
            "Jessie003UltiProjectile",
            "MechanicOverchargedUltiProjectile",
            "MechanicTurretProjectile",
            "TurretElecProj",
            "MechanicOverchargedTurretElecProj",
          ],
          i: [],
        },
        MechanicSummer: {
          a: [],
          p: [
            "Jessie002Projectile1",
            "MechanicOverchargedUltiProjectile",
            "Jessie002UltiProjectile",
            "MechanicOverchargedUltiProjectile",
            "MechanicTurretProjectile",
            "TurretElecProj",
            "MechanicOverchargedTurretElecProj",
          ],
          i: [],
        },
        MechanicKnightDark: {
          a: [],
          p: [
            "Jessie004Projectile1",
            "MechanicOverchargedUltiProjectile",
            "Jessie004UltiProjectile",
            "MechanicOverchargedUltiProjectile",
            "MechanicTurretProjectile",
            "TurretElecProj",
            "MechanicOverchargedTurretElecProj",
          ],
          i: [],
        },
        MechanicTanuki: {
          a: [],
          p: [
            "Jessie005Projectile1",
            "MechanicOverchargedUltiProjectile",
            "Jessie005UltiProjectile",
            "MechanicOverchargedUltiProjectile",
            "MechanicTurretProjectile",
            "TurretElecProj",
            "MechanicOverchargedTurretElecProj",
          ],
          i: [],
        },
        MechanicRedDragon: {
          a: [],
          p: [
            "MechanicProjectile1",
            "MechanicOverchargedUltiProjectile",
            "MechanicUltiProjectile",
            "MechanicOverchargedUltiProjectile",
            "MechanicTurretProjectile",
            "TurretElecProj",
            "MechanicOverchargedTurretElecProj",
          ],
          i: [],
        },
        MechanicGold: {
          a: [],
          p: [
            "MechanicProjectile1",
            "MechanicOverchargedUltiProjectile",
            "MechanicUltiProjectile",
            "MechanicOverchargedUltiProjectile",
            "MechanicTurretProjectile",
            "TurretElecProj",
            "MechanicOverchargedTurretElecProj",
          ],
          i: [],
        },
        MechanicSilver: {
          a: [],
          p: [
            "MechanicProjectile1",
            "MechanicOverchargedUltiProjectile",
            "MechanicUltiProjectile",
            "MechanicOverchargedUltiProjectile",
            "MechanicTurretProjectile",
            "TurretElecProj",
            "MechanicOverchargedTurretElecProj",
          ],
          i: [],
        },
        MechanicThief: {
          a: [],
          p: [
            "Jessie006Projectile1",
            "MechanicOverchargedUltiProjectile",
            "Jessie006UltiProjectile",
            "MechanicOverchargedUltiProjectile",
            "MechanicTurretProjectile",
            "TurretElecProj",
            "MechanicOverchargedTurretElecProj",
          ],
          i: [],
        },
        MechanicDoll: {
          a: [],
          p: [
            "MechanicProjectile1",
            "MechanicOverchargedUltiProjectile",
            "MechanicUltiProjectile",
            "MechanicOverchargedUltiProjectile",
            "MechanicTurretProjectile",
            "TurretElecProj",
            "MechanicOverchargedTurretElecProj",
          ],
          i: [],
        },
        MechanicSkadi: {
          a: [],
          p: [
            "Jessie007Projectile1",
            "MechanicOverchargedUltiProjectile",
            "Jessie007UltiProjectile",
            "MechanicOverchargedUltiProjectile",
            "MechanicTurretProjectile",
            "TurretElecProj",
            "MechanicOverchargedTurretElecProj",
          ],
          i: [],
        },
        MechanicSB: {
          a: [],
          p: [
            "Jessie008Projectile1",
            "MechanicOverchargedUltiProjectile",
            "Jessie008UltiProjectile",
            "MechanicOverchargedUltiProjectile",
            "MechanicTurretProjectile",
            "TurretElecProj",
            "MechanicOverchargedTurretElecProj",
          ],
          i: [],
        },
        MechanicJessie: {
          a: [],
          p: [
            "Jessie009Projectile1",
            "MechanicOverchargedUltiProjectile",
            "Jessie009UltiProjectile",
            "MechanicOverchargedUltiProjectile",
            "MechanicTurretProjectile",
            "TurretElecProj",
            "MechanicOverchargedTurretElecProj",
          ],
          i: [],
        },
        MechanicSCStore: {
          a: [],
          p: [
            "Jessie010Projectile1",
            "MechanicOverchargedUltiProjectile",
            "Jessie010UltiProjectile",
            "MechanicOverchargedUltiProjectile",
            "MechanicTurretProjectile",
            "TurretElecProj",
            "MechanicOverchargedTurretElecProj",
          ],
          i: [],
        },
        MechanicMecha: {
          a: [],
          p: [
            "Jessie011Projectile1",
            "MechanicOverchargedUltiProjectile",
            "Jessie011UltiProjectile",
            "MechanicOverchargedUltiProjectile",
            "MechanicTurretProjectile",
            "TurretElecProj",
            "MechanicOverchargedTurretElecProj",
          ],
          i: [],
        },
        MechanicMechaChromaOrange: {
          a: [],
          p: [
            "Jessie011Projectile1",
            "MechanicOverchargedUltiProjectile",
            "Jessie011UltiProjectile",
            "MechanicOverchargedUltiProjectile",
            "MechanicTurretProjectile",
            "TurretElecProj",
            "MechanicOverchargedTurretElecProj",
          ],
          i: [],
        },
        MechanicMechaChromaPink: {
          a: [],
          p: [
            "Jessie011Projectile1",
            "MechanicOverchargedUltiProjectile",
            "Jessie011UltiProjectile",
            "MechanicOverchargedUltiProjectile",
            "MechanicTurretProjectile",
            "TurretElecProj",
            "MechanicOverchargedTurretElecProj",
          ],
          i: [],
        },
      },
      Shaman: {
        ShamanDefault: {
          a: [],
          p: [
            "ShamanProjectile",
            "ShamanOverChargedUltiProjectile",
            "ShamanUltiProjectile",
            "ShamanOverChargedUltiProjectile",
          ],
          i: [],
        },
        ShamanPanda: {
          a: [],
          p: [
            "ShamanProjectile",
            "ShamanOverChargedUltiProjectile",
            "ShamanUltiProjectile",
            "ShamanOverChargedUltiProjectile",
          ],
          i: [],
        },
        ShamanReindeer: {
          a: [],
          p: [
            "Shaman007Projectile",
            "ShamanOverChargedUltiProjectile",
            "Shaman007UltiProjectile",
            "ShamanOverChargedUltiProjectile",
          ],
          i: [],
        },
        ShamanShiba: {
          a: [],
          p: [
            "ShamanProjectile",
            "ShamanOverChargedUltiProjectile",
            "ShamanUltiProjectile",
            "ShamanOverChargedUltiProjectile",
          ],
          i: [],
        },
        ShamanKoala: {
          a: [],
          p: [
            "ShamanProjectile",
            "ShamanOverChargedUltiProjectile",
            "ShamanUltiProjectile",
            "ShamanOverChargedUltiProjectile",
          ],
          i: [],
        },
        ShamanGold: {
          a: [],
          p: [
            "ShamanProjectile",
            "ShamanOverChargedUltiProjectile",
            "ShamanUltiProjectile",
            "ShamanOverChargedUltiProjectile",
          ],
          i: [],
        },
        ShamanSilver: {
          a: [],
          p: [
            "ShamanProjectile",
            "ShamanOverChargedUltiProjectile",
            "ShamanUltiProjectile",
            "ShamanOverChargedUltiProjectile",
          ],
          i: [],
        },
        ShamanSummer: {
          a: [],
          p: [
            "Shaman004Projectile",
            "ShamanOverChargedUltiProjectile",
            "Shaman004UltiProjectile",
            "ShamanOverChargedUltiProjectile",
          ],
          i: [],
        },
        ShamanDragon: {
          a: [],
          p: [
            "Shaman005Projectile",
            "ShamanOverChargedUltiProjectile",
            "Shaman005UltiProjectile",
            "ShamanOverChargedUltiProjectile",
          ],
          i: [],
        },
        ShamanGummybear: {
          a: [],
          p: [
            "Shaman006Projectile",
            "ShamanOverChargedUltiProjectile",
            "Shaman006UltiProjectile",
            "ShamanOverChargedUltiProjectile",
          ],
          i: [],
        },
        ShamanDarkcircus: {
          a: [],
          p: [
            "Shaman008Projectile",
            "ShamanOverChargedUltiProjectile",
            "Shaman008UltiProjectile",
            "ShamanOverChargedUltiProjectile",
          ],
          i: [],
        },
        ShamanGodzilla: {
          a: [],
          p: [
            "Shaman009Projectile",
            "ShamanOverChargedUltiProjectile",
            "Shaman009UltiProjectile",
            "ShamanOverChargedUltiProjectile",
          ],
          i: [],
        },
        ShamanDragon_black: {
          a: [],
          p: [
            "Shaman005Projectile",
            "ShamanOverChargedUltiProjectile",
            "Shaman005UltiProjectile",
            "ShamanOverChargedUltiProjectile",
          ],
          i: [],
        },
        ShamanStarrForce: {
          a: [],
          p: [
            "Shaman011Projectile",
            "ShamanOverChargedUltiProjectile",
            "Shaman011UltiProjectile",
            "ShamanOverChargedUltiProjectile",
          ],
          i: [],
        },
        ShamanChristmas: {
          a: [],
          p: [
            "Shaman007Projectile",
            "ShamanOverChargedUltiProjectile",
            "Shaman007UltiProjectile",
            "ShamanOverChargedUltiProjectile",
          ],
          i: [],
        },
        ShamanStrangeOvercharge: {
          a: [],
          p: [
            "Shaman012Projectile",
            "Shaman012UltiProjectile",
            "Shaman012OverChargedUltiProjectile",
            "Shaman012OverChargedProjectile",
          ],
          i: [],
        },
        ShamanStrangeOverchargeChroma1: {
          a: [],
          p: [
            "Shaman012Projectile",
            "Shaman012UltiProjectile",
            "Shaman012OverChargedUltiProjectile",
            "Shaman012OverChargedProjectile",
          ],
          i: [],
        },
        ShamanStrangeOverchargeChroma2: {
          a: [],
          p: [
            "Shaman012Projectile",
            "Shaman012UltiProjectile",
            "Shaman012OverChargedUltiProjectile",
            "Shaman012OverChargedProjectile",
          ],
          i: [],
        },
        ShamanAprilFools: {
          a: [],
          p: [
            "Shaman013Projectile",
            "ShamanOverChargedUltiProjectile",
            "Shaman013UltiProjectile",
            "ShamanOverChargedUltiProjectile",
          ],
          i: [],
        },
      },
      Undertaker: {
        UndertakerDefault: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "UndertakerUltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
        UndertakerGreaser: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "UndertakerUltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
        UndertakerHat: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "UndertakerUltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
        UndertakerNightwitch: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "UndertakerUltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
        UndertakerBazaar: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "Mortis003UltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
        UndertakerHatGold: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "UndertakerUltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
        UndertakerGold: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "UndertakerUltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
        UndertakerHatSilver: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "UndertakerUltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
        UndertakerSilver: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "UndertakerUltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
        UndertakerBeach: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "UndertakerUltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
        UndertakerMecha: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "Mortis005UltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
        UndertakerChromaLight: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "Mortis005UltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
        UndertakerChromaDark: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "Mortis005UltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
        UndertakerUndertakerHockey: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "Mortis006UltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
        UndertakerGala: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "UndertakerUltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
        UndertakerSB: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "Mortis007UltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
        UndertakerSBPink: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "Mortis007UltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
        UndertakerSBBlue: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "Mortis007UltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
        UndertakerDemon: {
          a: ["Mortis008OverchargedBulletSpawner"],
          p: [
            "Mortis008UltiProjectile",
            "Mortis008OverchargedUltiProjectile",
            "Mortis008AfterChargeOverchargedProjectile",
          ],
          i: [],
        },
        UndertakerDemonChroma1: {
          a: ["Mortis008OverchargedBulletSpawner"],
          p: [
            "Mortis008UltiProjectile",
            "Mortis008OverchargedUltiProjectile",
            "Mortis008AfterChargeOverchargedProjectile",
          ],
          i: [],
        },
        UndertakerDemonChroma2: {
          a: ["Mortis008OverchargedBulletSpawner"],
          p: [
            "Mortis008UltiProjectile",
            "Mortis008OverchargedUltiProjectile",
            "Mortis008AfterChargeOverchargedProjectile",
          ],
          i: [],
        },
        UndertakerGreekGod: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "Mortis009UltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
        UndertakerGreekGodChroma1: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "Mortis009UltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
        UndertakerGreekGodChroma2: {
          a: ["MortisOverchargedBulletSpawner"],
          p: [
            "UndertakerOverchargedUltiProjectile",
            "Mortis009UltiProjectile",
            "UndertakerOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      Crow: {
        CrowDefault: {
          a: ["CrowUltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["CrowProjectile"],
          i: [],
        },
        CrowWhite: {
          a: ["Crow003UltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["Crow003Projectile"],
          i: [],
        },
        CrowPheonix: {
          a: ["Crow006UltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["Crow006Projectile"],
          i: [],
        },
        CrowMecha: {
          a: ["Crow002UltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["Crow002Projectile"],
          i: [],
        },
        CrowMechaGold: {
          a: ["Crow002UltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["Crow002Projectile"],
          i: [],
        },
        CrowMechaNight: {
          a: ["Crow002UltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["Crow002Projectile"],
          i: [],
        },
        CrowGold: {
          a: ["CrowUltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["CrowProjectile"],
          i: [],
        },
        CrowSilver: {
          a: ["CrowUltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["CrowProjectile"],
          i: [],
        },
        CrowSuper: {
          a: ["Crow004UltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["Crow004Projectile"],
          i: [],
        },
        CrowVulture: {
          a: ["Crow005UltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["Crow005Projectile"],
          i: [],
        },
        CrowHarvest: {
          a: ["Crow007UltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["Crow007Projectile"],
          i: [],
        },
        CrowMaverick: {
          a: ["CrowUltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["CrowProjectile"],
          i: [],
        },
        CrowBrawloween: {
          a: ["Crow009UltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["Crow009Projectile"],
          i: [],
        },
        CrowBrawloweenRed: {
          a: ["Crow009UltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["Crow009Projectile"],
          i: [],
        },
        CrowBrawloweenWhite: {
          a: ["Crow009UltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["Crow009Projectile"],
          i: [],
        },
        CrowRankedProgrsesionSkinLevel1: {
          a: ["CrowUltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["CrowProjectile"],
          i: [],
        },
        CrowRankedProgrsesionSkinLevel2: {
          a: ["CrowUltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["CrowProjectile"],
          i: [],
        },
        CrowRankedProgrsesionSkinLevel3: {
          a: ["Crow010UltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["Crow010Projectile"],
          i: [],
        },
        CrowRankedProgrsesionSkinLevel4: {
          a: ["Crow010UltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["Crow010Projectile"],
          i: [],
        },
        CrowRankedProgrsesionSkinLevel5: {
          a: ["Crow010UltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["Crow010Projectile"],
          i: [],
        },
        CrowRankedProgrsesionSkinLevel6: {
          a: ["Crow010UltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["Crow010Projectile"],
          i: [],
        },
        CrowRankedProgrsesionSkinLevel7: {
          a: ["Crow010UltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["Crow010Projectile"],
          i: [],
        },
        CrowRankedProgrsesionSkinLevel8: {
          a: ["Crow010UltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["Crow010Projectile"],
          i: [],
        },
        CrowRankedProgrsesionSkinLevel9: {
          a: ["Crow010UltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["Crow010Projectile"],
          i: [],
        },
        CrowRankedProgrsesionSkinLevel10: {
          a: ["Crow010UltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["Crow010Projectile"],
          i: [],
        },
        CrowRankedProgrsesionSkinLevel11: {
          a: ["Crow010UltiKnifes", "CrowOverchargedUltiKnifes"],
          p: ["Crow010Projectile"],
          i: [],
        },
      },
      DeadMariachi: {
        DeadMariachiDefault: {
          a: [],
          p: [
            "DeadMariachiProjectile",
            "DeadMariachiOverchargedUltiProjectile",
            "DeadMariachiUltiProjectile",
            "DeadMariachiOverchargedUltiProjectile",
          ],
          i: [],
        },
        PocoValentine: {
          a: [],
          p: [
            "Poco002Projectile",
            "DeadMariachiOverchargedUltiProjectile",
            "Poco002UltiProjectile",
            "DeadMariachiOverchargedUltiProjectile",
          ],
          i: [],
        },
        PocoPirate: {
          a: [],
          p: [
            "Poco003Projectile",
            "DeadMariachiOverchargedUltiProjectile",
            "Poco003UltiProjectile",
            "DeadMariachiOverchargedUltiProjectile",
          ],
          i: [],
        },
        PocoStarr: {
          a: [],
          p: [
            "Poco005Projectile",
            "DeadMariachiOverchargedUltiProjectile",
            "Poco005UltiProjectile",
            "DeadMariachiOverchargedUltiProjectile",
          ],
          i: [],
        },
        DeadMariachiPunk: {
          a: [],
          p: [
            "Poco004Projectile",
            "DeadMariachiOverchargedUltiProjectile",
            "Poco004UltiProjectile",
            "DeadMariachiOverchargedUltiProjectile",
          ],
          i: [],
        },
        DeadMariachiGold: {
          a: [],
          p: [
            "DeadMariachiProjectile",
            "DeadMariachiOverchargedUltiProjectile",
            "DeadMariachiUltiProjectile",
            "DeadMariachiOverchargedUltiProjectile",
          ],
          i: [],
        },
        DeadMariachiSilver: {
          a: [],
          p: [
            "DeadMariachiProjectile",
            "DeadMariachiOverchargedUltiProjectile",
            "DeadMariachiUltiProjectile",
            "DeadMariachiOverchargedUltiProjectile",
          ],
          i: [],
        },
        DeadMariachiOutlaw: {
          a: [],
          p: [
            "Poco006Projectile",
            "DeadMariachiOverchargedUltiProjectile",
            "Poco006UltiProjectile",
            "DeadMariachiOverchargedUltiProjectile",
          ],
          i: [],
        },
        DeadMariachiorigins: {
          a: [],
          p: [
            "Poco007Projectile",
            "DeadMariachiOverchargedUltiProjectile",
            "Poco007UltiProjectile",
            "DeadMariachiOverchargedUltiProjectile",
          ],
          i: [],
        },
        DeadMariachiOnceupon: {
          a: [],
          p: [
            "Poco008Projectile",
            "DeadMariachiOverchargedUltiProjectile",
            "Poco008UltiProjectile",
            "DeadMariachiOverchargedUltiProjectile",
          ],
          i: [],
        },
        DeadMariachiGoodRandoms: {
          a: [],
          p: [
            "Poco009Projectile",
            "DeadMariachiOverchargedUltiProjectile",
            "Poco009UltiProjectile",
            "DeadMariachiOverchargedUltiProjectile",
          ],
          i: [],
        },
        DeadMariachiRare: {
          a: [],
          p: [
            "DeadMariachiProjectile",
            "DeadMariachiOverchargedUltiProjectile",
            "DeadMariachiUltiProjectile",
            "DeadMariachiOverchargedUltiProjectile",
          ],
          i: [],
        },
        PocoSurferOvercharge: {
          a: [],
          p: [
            "Poco010Projectile",
            "DeadMariachiOverchargedUltiProjectile",
            "Poco010UltiProjectile",
            "DeadMariachiOverchargedUltiProjectile",
          ],
          i: [],
        },
        PocoSurferOverchargeChromaBlue: {
          a: [],
          p: [
            "Poco010Projectile",
            "DeadMariachiOverchargedUltiProjectile",
            "Poco010UltiProjectile",
            "DeadMariachiOverchargedUltiProjectile",
          ],
          i: [],
        },
        PocoSurferOverchargeChromaYellow: {
          a: [],
          p: [
            "Poco010Projectile",
            "DeadMariachiOverchargedUltiProjectile",
            "Poco010UltiProjectile",
            "DeadMariachiOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      BowDude: {
        BowDudeDefault: {
          a: [],
          p: [
            "BowDudeProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
            "BowDudeSpawnMineProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
          ],
          i: ["Mine"],
        },
        BoMecha: {
          a: [],
          p: [
            "Bow002Projectile",
            "BowDudeSpawnOverchargedMineProjectile",
            "Bow002UltiProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
          ],
          i: ["MineMecha"],
        },
        BowDudeMechaWhite: {
          a: [],
          p: [
            "Bow002Projectile",
            "BowDudeSpawnOverchargedMineProjectile",
            "Bow002UltiProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
          ],
          i: ["MineMecha"],
        },
        BowDudeMechaGold: {
          a: [],
          p: [
            "Bow002Projectile",
            "BowDudeSpawnOverchargedMineProjectile",
            "Bow002UltiProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
          ],
          i: ["MineMecha"],
        },
        BowDudeHorus: {
          a: [],
          p: [
            "Bo003Projectile",
            "BowDudeSpawnOverchargedMineProjectile",
            "Bo003UltiProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
          ],
          i: ["MineHorus"],
        },
        BowDudeDemonic: {
          a: [],
          p: [
            "Bo004Projectile",
            "BowDudeSpawnOverchargedMineProjectile",
            "Bo004UltiProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
          ],
          i: ["MineDemon"],
        },
        BowDudeWarrior: {
          a: [],
          p: [
            "BowDudeProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
            "BowDudeSpawnMineProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
          ],
          i: ["Mine"],
        },
        BowDudeGold: {
          a: [],
          p: [
            "BowDudeProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
            "BowDudeSpawnMineProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
          ],
          i: ["Mine"],
        },
        BowDudeSilver: {
          a: [],
          p: [
            "BowDudeProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
            "BowDudeSpawnMineProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
          ],
          i: ["Mine"],
        },
        BowDudeSanta: {
          a: [],
          p: [
            "Bo005Projectile",
            "BowDudeSpawnOverchargedMineProjectile",
            "Bo005UltiProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
          ],
          i: ["MineGift"],
        },
        BowDudeWasp: {
          a: [],
          p: [
            "Bo006Projectile",
            "BowDudeSpawnOverchargedMineProjectile",
            "Bo006UltiProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
          ],
          i: ["MineWasp"],
        },
        BowDudeHindu: {
          a: [],
          p: [
            "Bo007Projectile",
            "BowDudeSpawnOverchargedMineProjectile",
            "Bo007UltiProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
          ],
          i: ["MineLotus"],
        },
        BowDudeHinduChroma: {
          a: [],
          p: [
            "Bo007Projectile",
            "BowDudeSpawnOverchargedMineProjectile",
            "Bo007UltiProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
          ],
          i: ["MineLotus"],
        },
        BowDudeBrawlentine: {
          a: [],
          p: [
            "Bo008Projectile",
            "BowDudeSpawnOverchargedMineProjectile",
            "Bo008UltiProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
          ],
          i: ["MineChoco"],
        },
        BowDudeFantasy: {
          a: [],
          p: [
            "Bo009Projectile",
            "BowDudeSpawnOverchargedMineProjectile",
            "Bo009UltiProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
          ],
          i: ["MineHelmet"],
        },
        BowDudeFantasyChroma1: {
          a: [],
          p: [
            "Bo009Projectile",
            "BowDudeSpawnOverchargedMineProjectile",
            "Bo009UltiProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
          ],
          i: ["MineHelmet"],
        },
        BowDudeFantasyChroma2: {
          a: [],
          p: [
            "Bo009Projectile",
            "BowDudeSpawnOverchargedMineProjectile",
            "Bo009UltiProjectile",
            "BowDudeSpawnOverchargedMineProjectile",
          ],
          i: ["MineHelmet"],
        },
      },
      Sniper: {
        SniperDefault: { a: ["Piper_def_ulti"], p: ["SniperProjectile"], i: ["PiperdefBomb"] },
        SniperPink: { a: ["Piper_def_ulti"], p: ["SniperProjectile"], i: ["PiperdefBomb"] },
        Sniperrose: { a: ["Piper_def_ulti"], p: ["Piper005Projectile"], i: ["Piper005Bomb"] },
        SniperValentines: { a: ["Piper_def_ulti"], p: ["Piper002Projectile"], i: ["Piper002Bomb"] },
        SniperGold: { a: ["Piper_def_ulti"], p: ["SniperProjectile"], i: ["PiperdefBomb"] },
        SniperSilver: { a: ["Piper_def_ulti"], p: ["SniperProjectile"], i: ["PiperdefBomb"] },
        SniperLine: { a: ["Piper_def_ulti"], p: ["SniperProjectile"], i: ["PiperdefBomb"] },
        SniperMoon: { a: ["Piper_def_ulti"], p: ["Piper004Projectile"], i: ["Piper004Bomb"] },
        SniperMariposa: { a: ["Piper_def_ulti"], p: ["Piper006Projectile"], i: ["Piper006Bomb"] },
        SniperCarnival: { a: ["Piper_def_ulti"], p: ["Piper007Projectile"], i: ["Piper007Bomb"] },
        SniperGreek: { a: ["Piper_def_ulti"], p: ["Piper008Projectile"], i: ["Piper008Bomb"] },
        SniperJapan: { a: ["Piper_009_ulti"], p: ["Piper009Projectile"], i: ["Piper009Bomb"] },
        SniperJapanChromaBlue: {
          a: ["Piper_009_ulti"],
          p: ["Piper009Projectile"],
          i: ["Piper009Bomb"],
        },
        SniperJapanChromaGreen: {
          a: ["Piper_009_ulti"],
          p: ["Piper009Projectile"],
          i: ["Piper009Bomb"],
        },
        SniperMechaOvercharge: {
          a: ["Piper_def_ulti"],
          p: ["Piper010Projectile"],
          i: ["Piper010Bomb"],
        },
        SniperMechaOverchargeRed: {
          a: ["Piper_def_ulti"],
          p: ["Piper010Projectile"],
          i: ["Piper010Bomb"],
        },
        SniperMechaOverchargePink: {
          a: ["Piper_def_ulti"],
          p: ["Piper010Projectile"],
          i: ["Piper010Bomb"],
        },
      },
      MinigunDude: {
        MinigunDudeDefault: {
          a: ["HealingStationHeal"],
          p: [
            "MinigunDudeProjectile",
            "MinigunDudeOverchargedUltiProjectile",
            "MinigunDudeUltiProjectile",
            "MinigunDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        MinigunDudeSummer: {
          a: ["HealingStationHeal"],
          p: [
            "Pam002Projectile",
            "MinigunDudeOverchargedUltiProjectile",
            "Pam002UltiProjectile",
            "MinigunDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        MinigunDudeQueen: {
          a: ["HealingStationHeal2"],
          p: [
            "Pam003Projectile",
            "MinigunDudeOverchargedUltiProjectile",
            "Pam003UltiProjectile",
            "MinigunDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        MinigunDudeGold: {
          a: ["HealingStationHeal"],
          p: [
            "MinigunDudeProjectile",
            "MinigunDudeOverchargedUltiProjectile",
            "MinigunDudeUltiProjectile",
            "MinigunDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        MinigunDudeSilver: {
          a: ["HealingStationHeal"],
          p: [
            "MinigunDudeProjectile",
            "MinigunDudeOverchargedUltiProjectile",
            "MinigunDudeUltiProjectile",
            "MinigunDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        MinigunDudeBroker: {
          a: ["HealingStationHeal3"],
          p: [
            "Pam006Projectile",
            "MinigunDudeOverchargedUltiProjectile",
            "Pam006UltiProjectile",
            "MinigunDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        MinigunDudeZombie: {
          a: ["HealingStationHeal4"],
          p: [
            "Pam007Projectile",
            "MinigunDudeOverchargedUltiProjectile",
            "Pam007UltiProjectile",
            "MinigunDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        MinigunDudeAprilFools: {
          a: ["HealingStationHeal"],
          p: [
            "Pam008Projectile",
            "MinigunDudeOverchargedUltiProjectile",
            "Pam008UltiProjectile",
            "MinigunDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      BlackHole: {
        BlackholeDefault: {
          a: [],
          p: [
            "BlackHoleProjectile",
            "BlackHoleOverchargedUltiProjectile",
            "BlackHoleUltiProjectile",
            "BlackHoleOverchargedUltiProjectile",
          ],
          i: [],
        },
        BlackHoleBlue: {
          a: [],
          p: [
            "BlackHoleProjectile",
            "BlackHoleOverchargedUltiProjectile",
            "BlackHoleUltiProjectile",
            "BlackHoleOverchargedUltiProjectile",
          ],
          i: [],
        },
        BlackHoleStreetNinja: {
          a: [],
          p: [
            "Tara002Projectile",
            "BlackHoleOverchargedUltiProjectile",
            "Tara002UltiProjectile",
            "BlackHoleOverchargedUltiProjectile",
          ],
          i: [],
        },
        BlackHoleGold: {
          a: [],
          p: [
            "BlackHoleProjectile",
            "BlackHoleOverchargedUltiProjectile",
            "BlackHoleUltiProjectile",
            "BlackHoleOverchargedUltiProjectile",
          ],
          i: [],
        },
        BlackHoleSilver: {
          a: [],
          p: [
            "BlackHoleProjectile",
            "BlackHoleOverchargedUltiProjectile",
            "BlackHoleUltiProjectile",
            "BlackHoleOverchargedUltiProjectile",
          ],
          i: [],
        },
        BlackHoleMisfortune: {
          a: [],
          p: [
            "Tara003Projectile",
            "BlackHoleOverchargedUltiProjectile",
            "Tara003UltiProjectile",
            "BlackHoleOverchargedUltiProjectile",
          ],
          i: [],
        },
        BlackHoleDevious: {
          a: [],
          p: [
            "Tara004Projectile",
            "BlackHoleOverchargedUltiProjectile",
            "Tara004UltiProjectile",
            "BlackHoleOverchargedUltiProjectile",
          ],
          i: [],
        },
        BlackHoleWorldfinal: {
          a: [],
          p: [
            "Tara005Projectile",
            "BlackHoleOverchargedUltiProjectile",
            "Tara005UltiProjectile",
            "BlackHoleOverchargedUltiProjectile",
          ],
          i: [],
        },
        BlackHoleStreetNinja_remake: {
          a: [],
          p: [
            "Tara006Projectile",
            "BlackHoleOverchargedUltiProjectile",
            "Tara006UltiProjectile",
            "BlackHoleOverchargedUltiProjectile",
          ],
          i: [],
        },
        BlackHoleJapan: {
          a: [],
          p: [
            "Tara007Projectile",
            "BlackHoleOverchargedUltiProjectile",
            "Tara007UltiProjectile",
            "BlackHoleOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      BarrelBot: {
        BarrelbotDefault: {
          a: ["BarrelBotOverchargeChargeArea"],
          p: ["BarrelBotProjectile"],
          i: [],
        },
        BarrelbotCny: { a: ["BarrelBotOverchargeChargeArea"], p: ["Darryl002Projectile"], i: [] },
        BarrelBotFootball: {
          a: ["BarrelBotOverchargeChargeArea"],
          p: ["Darryl003Projectile"],
          i: [],
        },
        BarrelBotGold: { a: ["BarrelBotOverchargeChargeArea"], p: ["BarrelBotProjectile"], i: [] },
        BarrelBotSilver: {
          a: ["BarrelBotOverchargeChargeArea"],
          p: ["BarrelBotProjectile"],
          i: [],
        },
        BarrelBotLaser: { a: ["BarrelBotOverchargeChargeArea"], p: ["Darryl004Projectile"], i: [] },
        BarrelBotMegabox: {
          a: ["BarrelBotOverchargeChargeArea"],
          p: ["BarrelBotProjectile"],
          i: [],
        },
        BarrelBotCrash: { a: ["BarrelBotOverchargeChargeArea"], p: ["Darryl005Projectile"], i: [] },
        BarrelBotOmegabox: {
          a: ["BarrelBotOverchargeChargeArea"],
          p: ["Darryl006Projectile"],
          i: [],
        },
        BarrelBotCupcake: {
          a: ["BarrelBotOverchargeChargeArea"],
          p: ["Darryl007Projectile"],
          i: [],
        },
        BarrelBotSB: { a: ["BarrelBotOverchargeChargeArea"], p: ["Darryl008Projectile"], i: [] },
        BarrelbotToy: { a: ["BarrelBotOverchargeChargeArea"], p: ["BarrelBotProjectile"], i: [] },
        BarrelBotGreekGod: {
          a: ["BarrelBotOverchargeChargeArea"],
          p: ["Darryl009Projectile"],
          i: [],
        },
      },
      ArtilleryDude: {
        ArtilleryGalDefault: {
          a: [],
          p: [
            "ArtilleryDudeProjectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "ArtilleryDudeUltiProjectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "ArtilleryDudeTurretProjectile",
          ],
          i: [],
        },
        ArtilleryGalElf: {
          a: [],
          p: [
            "Penny002Projectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "Penny002UltiProjectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "ArtilleryDudeTurretProjectile",
          ],
          i: [],
        },
        ArtilleryGalBunny: {
          a: [],
          p: [
            "Penny003Projectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "Penny003UltiProjectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "ArtilleryDudeTurretProjectile",
          ],
          i: [],
        },
        ArtilleryDudeDarkBunny: {
          a: [],
          p: [
            "Penny004Projectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "Penny004UltiProjectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "ArtilleryDudeTurretProjectile",
          ],
          i: [],
        },
        ArtilleryDudeSmuggler: {
          a: [],
          p: [
            "Penny005Projectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "Penny005UltiProjectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "ArtilleryDudeTurretProjectile",
          ],
          i: [],
        },
        ArtilleryDudeGold: {
          a: [],
          p: [
            "ArtilleryDudeProjectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "ArtilleryDudeUltiProjectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "ArtilleryDudeTurretProjectile",
          ],
          i: [],
        },
        ArtilleryDudeSilver: {
          a: [],
          p: [
            "ArtilleryDudeProjectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "ArtilleryDudeUltiProjectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "ArtilleryDudeTurretProjectile",
          ],
          i: [],
        },
        ArtilleryDudeZombie: {
          a: [],
          p: [
            "Penny006Projectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "Penny006UltiProjectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "ArtilleryDudeTurretProjectile",
          ],
          i: [],
        },
        ArtilleryDudeSmuggler_orange: {
          a: [],
          p: [
            "Penny005Projectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "Penny005UltiProjectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "ArtilleryDudeTurretProjectile",
          ],
          i: [],
        },
        ArtilleryGalCyber: {
          a: [],
          p: [
            "ArtilleryDudeProjectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "ArtilleryDudeUltiProjectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "ArtilleryDudeTurretProjectile",
          ],
          i: [],
        },
        ArtilleryGalToy: {
          a: [],
          p: [
            "Penny007Projectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "Penny007UltiProjectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "ArtilleryDudeTurretProjectile",
          ],
          i: [],
        },
        ArtilleryGalBrawlAcademy: {
          a: [],
          p: [
            "Penny008Projectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "Penny008UltiProjectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "ArtilleryDudeTurretProjectile",
          ],
          i: [],
        },
        ArtilleryGalSPC: {
          a: [],
          p: [
            "Penny009Projectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "Penny009UltiProjectile",
            "ArtilleryDudeOverchargedUltiProjectile",
            "ArtilleryDudeTurretProjectile",
          ],
          i: [],
        },
      },
      HammerDude: {
        FrankDefault: {
          a: [],
          p: [
            "HammerDudeProjectile",
            "HammerDudeOverchargedUltiProjectile",
            "HammerDudeUltiProjectile",
            "HammerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        FrankCaveman: {
          a: [],
          p: [
            "Frank007Projectile",
            "HammerDudeOverchargedUltiProjectile",
            "Frank007UltiProjectile",
            "HammerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        HammerDudeDJ: {
          a: [],
          p: [
            "Frank002Projectile",
            "HammerDudeOverchargedUltiProjectile",
            "Frank002UltiProjectile",
            "HammerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        HammerDudeGold: {
          a: [],
          p: [
            "HammerDudeProjectile",
            "HammerDudeOverchargedUltiProjectile",
            "HammerDudeUltiProjectile",
            "HammerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        HammerDudeSilver: {
          a: [],
          p: [
            "HammerDudeProjectile",
            "HammerDudeOverchargedUltiProjectile",
            "HammerDudeUltiProjectile",
            "HammerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        HammerDudeXmas: {
          a: [],
          p: [
            "HammerDudeProjectile",
            "HammerDudeOverchargedUltiProjectile",
            "HammerDudeUltiProjectile",
            "HammerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        HammerDudeknight: {
          a: [],
          p: [
            "Frank004Projectile",
            "HammerDudeOverchargedUltiProjectile",
            "Frank004UltiProjectile",
            "HammerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        HammerDudeHindu: {
          a: [],
          p: [
            "Frank005Projectile",
            "HammerDudeOverchargedUltiProjectile",
            "Frank005UltiProjectile",
            "HammerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        HammerDudeClashKingChromaRed: {
          a: [],
          p: [
            "Frank006Projectile",
            "HammerDudeOverchargedUltiProjectile",
            "Frank006UltiProjectile",
            "HammerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        HammerDudeClashKingChromaBlue: {
          a: [],
          p: [
            "Frank006Projectile",
            "HammerDudeOverchargedUltiProjectile",
            "Frank006UltiProjectile",
            "HammerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        HammerDudeVacation: {
          a: [],
          p: [
            "HammerDudeProjectile",
            "HammerDudeOverchargedUltiProjectile",
            "HammerDudeUltiProjectile",
            "HammerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        FrankCavemanRed: {
          a: [],
          p: [
            "Frank007Projectile",
            "HammerDudeOverchargedUltiProjectile",
            "Frank007UltiProjectile",
            "HammerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        HammerDudeSandsOfTimes: {
          a: [],
          p: [
            "Frank008Projectile",
            "HammerDudeOverchargedUltiProjectile",
            "Frank008UltiProjectile",
            "HammerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        HammerDudeSandsOfTimesDark: {
          a: [],
          p: [
            "Frank008Projectile",
            "HammerDudeOverchargedUltiProjectile",
            "Frank008UltiProjectile",
            "HammerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        HammerDudeSandsOfTimesLight: {
          a: [],
          p: [
            "Frank008Projectile",
            "HammerDudeOverchargedUltiProjectile",
            "Frank008UltiProjectile",
            "HammerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        FrankFairies: {
          a: [],
          p: [
            "Frank009Projectile",
            "HammerDudeOverchargedUltiProjectile",
            "Frank009UltiProjectile",
            "HammerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      HookDude: {
        HookDefault: {
          a: [],
          p: [
            "HookProjectile",
            "HookUltiOverchargedProjectile",
            "HookUltiProjectile",
            "HookUltiOverchargedProjectile",
          ],
          i: [],
        },
        HookPirate: {
          a: [],
          p: [
            "Gene002Projectile",
            "HookUltiOverchargedProjectile",
            "Gene002UltiProjectile",
            "HookUltiOverchargedProjectile",
          ],
          i: [],
        },
        HookDudeBazaar: {
          a: [],
          p: [
            "Gene003Projectile",
            "HookUltiOverchargedProjectile",
            "Gene003UltiProjectile",
            "HookUltiOverchargedProjectile",
          ],
          i: [],
        },
        HookDudeGold: {
          a: [],
          p: [
            "HookProjectile",
            "HookUltiOverchargedProjectile",
            "HookUltiProjectile",
            "HookUltiOverchargedProjectile",
          ],
          i: [],
        },
        HookDudeSilver: {
          a: [],
          p: [
            "HookProjectile",
            "HookUltiOverchargedProjectile",
            "HookUltiProjectile",
            "HookUltiOverchargedProjectile",
          ],
          i: [],
        },
        HookDudeSwamp: {
          a: [],
          p: [
            "Gene004Projectile",
            "HookUltiOverchargedProjectile",
            "Gene004UltiProjectile",
            "HookUltiOverchargedProjectile",
          ],
          i: [],
        },
        HookDudeMake: {
          a: [],
          p: [
            "Gene005Projectile",
            "HookUltiOverchargedProjectile",
            "Gene005UltiProjectile",
            "HookUltiOverchargedProjectile",
          ],
          i: [],
        },
        HookDudeAngel: {
          a: [],
          p: [
            "Gene006Projectile",
            "HookUltiOverchargedProjectile",
            "Gene006UltiProjectile",
            "HookUltiOverchargedProjectile",
          ],
          i: [],
        },
        HookDudeMonkey: {
          a: [],
          p: [
            "HookProjectile",
            "HookUltiOverchargedProjectile",
            "HookUltiProjectile",
            "HookUltiOverchargedProjectile",
          ],
          i: [],
        },
      },
      Whirlwind: {
        WhirlwindDefault: { a: [], p: ["WhirlwindProjectile"], i: [] },
        WhirlwindRR: { a: [], p: ["Carl002Projectile"], i: [] },
        WhirlwindHogrider: { a: [], p: ["Carl003Projectile"], i: [] },
        WhirlwindLeonard: { a: [], p: ["Carl004Projectile"], i: [] },
        WhirlwindPirate: { a: [], p: ["Carl005Projectile"], i: [] },
        WhirlwindDarkTide: { a: [], p: ["Carl005Projectile"], i: [] },
        WhirlwindSurfer: { a: [], p: ["Carl006Projectile"], i: [] },
        WhirlwindGold: { a: [], p: ["WhirlwindProjectile"], i: [] },
        WhirlwindSilver: { a: [], p: ["WhirlwindProjectile"], i: [] },
        WhirlwindBiker: { a: [], p: ["Carl007Projectile"], i: [] },
        WhirlwindRamadan: { a: [], p: ["Carl008Projectile"], i: [] },
        WhirlwindGoblin: { a: [], p: ["WhirlwindProjectile"], i: [] },
        WhirlwindSupercellMake: { a: [], p: ["Carl009Projectile"], i: [] },
        WhirlwindCarreta: { a: [], p: ["Carl010Projectile"], i: [] },
      },
      Rosa: {
        RosaDefault: { a: ["RosaOverchargedUltiArea"], p: ["RosaProjectile"], i: [] },
        RosaRosaBrawloween: { a: ["RosaOverchargedUltiArea"], p: ["Rosa002Projectile"], i: [] },
        RosaCoco: { a: ["RosaOverchargedUltiArea"], p: ["Rosa003Projectile"], i: [] },
        RosaBP: { a: ["RosaOverchargedUltiArea"], p: ["Rosa004Projectile"], i: [] },
        RosaGold: { a: ["RosaOverchargedUltiArea"], p: ["RosaProjectile"], i: [] },
        RosaSilver: { a: ["RosaOverchargedUltiArea"], p: ["RosaProjectile"], i: [] },
        RosaMantis: { a: ["RosaOverchargedUltiArea"], p: ["Rosa005Projectile"], i: [] },
        RosaUniversity: { a: ["RosaOverchargedUltiArea"], p: ["Rosa006Projectile"], i: [] },
        RosaToon: { a: ["RosaOverchargedUltiArea"], p: ["Rosa007Projectile"], i: [] },
        RosaRare: { a: ["RosaOverchargedUltiArea"], p: ["RosaProjectile"], i: [] },
      },
      Baseball: {
        BaseballDefault: {
          a: [],
          p: [
            "BaseballOverchargedUltiProjectile",
            "BaseballUltiProjectile",
            "BaseballOverchargedUltiProjectile",
          ],
          i: [],
        },
        BaseballGamer: {
          a: [],
          p: [
            "BaseballOverchargedUltiProjectile",
            "Bibi002UltiProjectile",
            "BaseballOverchargedUltiProjectile",
          ],
          i: [],
        },
        BaseballZombibi: {
          a: [],
          p: [
            "BaseballOverchargedUltiProjectile",
            "Bibi003UltiProjectile",
            "BaseballOverchargedUltiProjectile",
          ],
          i: [],
        },
        BaseballVigilante: {
          a: [],
          p: [
            "BaseballOverchargedUltiProjectile",
            "BaseballUltiProjectile",
            "BaseballOverchargedUltiProjectile",
          ],
          i: [],
        },
        BaseballWarrior: {
          a: [],
          p: [
            "BaseballOverchargedUltiProjectile",
            "BaseballUltiProjectile",
            "BaseballOverchargedUltiProjectile",
          ],
          i: [],
        },
        BaseballGold: {
          a: [],
          p: [
            "BaseballOverchargedUltiProjectile",
            "BaseballUltiProjectile",
            "BaseballOverchargedUltiProjectile",
          ],
          i: [],
        },
        BaseballSilver: {
          a: [],
          p: [
            "BaseballOverchargedUltiProjectile",
            "BaseballUltiProjectile",
            "BaseballOverchargedUltiProjectile",
          ],
          i: [],
        },
        BaseballRj: {
          a: [],
          p: [
            "BaseballOverchargedUltiProjectile",
            "Bibi005UltiProjectile",
            "BaseballOverchargedUltiProjectile",
          ],
          i: [],
        },
        BaseballBubblegum: {
          a: [],
          p: [
            "BaseballOverchargedUltiProjectile",
            "BaseballUltiProjectile",
            "BaseballOverchargedUltiProjectile",
          ],
          i: [],
        },
        BaseballPirate: {
          a: [],
          p: [
            "BaseballOverchargedUltiProjectile",
            "Bibi006UltiProjectile",
            "BaseballOverchargedUltiProjectile",
          ],
          i: [],
        },
        BaseballThor: {
          a: [],
          p: [
            "BaseballOverchargedUltiProjectile",
            "Bibi007UltiProjectile",
            "BaseballOverchargedUltiProjectile",
          ],
          i: [],
        },
        BaseballGamer_remake: {
          a: [],
          p: [
            "BaseballOverchargedUltiProjectile",
            "Bibi008UltiProjectile",
            "BaseballOverchargedUltiProjectile",
          ],
          i: [],
        },
        BaseballBopeep: {
          a: [],
          p: [
            "BaseballOverchargedUltiProjectile",
            "Bibi009UltiProjectile",
            "BaseballOverchargedUltiProjectile",
          ],
          i: [],
        },
        BaseballVillain: {
          a: [],
          p: [
            "BaseballOverchargedUltiProjectile",
            "Bibi010UltiProjectile",
            "BaseballOverchargedUltiProjectile",
          ],
          i: [],
        },
        BaseballVillainChromaPink: {
          a: [],
          p: [
            "BaseballOverchargedUltiProjectile",
            "Bibi010UltiProjectile",
            "BaseballOverchargedUltiProjectile",
          ],
          i: [],
        },
        BaseballVillainChromaBlue: {
          a: [],
          p: [
            "BaseballOverchargedUltiProjectile",
            "Bibi010UltiProjectile",
            "BaseballOverchargedUltiProjectile",
          ],
          i: [],
        },
        BaseballSandsOfTime: {
          a: [],
          p: [
            "BaseballOverchargedUltiProjectile",
            "Bibi011UltiProjectile",
            "BaseballOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      ClusterBombDude: {
        ClusterBombDefault: {
          a: [],
          p: [
            "ClusterBombProjectile",
            "ClusterBombOverchargedSummonProjectile",
            "ClusterBombSummonProjectile",
            "ClusterBombOverchargedSummonProjectile",
          ],
          i: ["ClusterMine"],
        },
        ClusterBombMonster: {
          a: [],
          p: [
            "Tick002Projectile",
            "ClusterBombOverchargedSummonProjectile",
            "Tick002UltiProjectile",
            "ClusterBombOverchargedSummonProjectile",
          ],
          i: ["Tick002Mine"],
        },
        ClusterBombDudeSnowman: {
          a: [],
          p: [
            "Tick003Projectile",
            "ClusterBombOverchargedSummonProjectile",
            "Tick003UltiProjectile",
            "ClusterBombOverchargedSummonProjectile",
          ],
          i: ["Tick003Mine"],
        },
        ClusterBombDudeGold: {
          a: [],
          p: [
            "TickGoldUltiProjectile",
            "ClusterBombOverchargedSummonProjectile",
            "ClusterBombSummonProjectile",
            "ClusterBombOverchargedSummonProjectile",
          ],
          i: ["ClusterMine"],
        },
        ClusterBombDudeSilver: {
          a: [],
          p: [
            "TickSilverUltiProjectile",
            "ClusterBombOverchargedSummonProjectile",
            "ClusterBombSummonProjectile",
            "ClusterBombOverchargedSummonProjectile",
          ],
          i: ["ClusterMine"],
        },
        ClusterBombDudeShooky: {
          a: [],
          p: [
            "Tick004Projectile",
            "ClusterBombOverchargedSummonProjectile",
            "Tick004UltiProjectile",
            "ClusterBombOverchargedSummonProjectile",
          ],
          i: ["Tick002Mine"],
        },
        ClusterBombDudeCerberus: {
          a: [],
          p: [
            "Tick005Projectile",
            "ClusterBombOverchargedSummonProjectile",
            "Tick005UltiProjectile",
            "ClusterBombOverchargedSummonProjectile",
          ],
          i: ["Tick005Mine"],
        },
        ClusterBombDudeGodzilla: {
          a: [],
          p: [
            "Tick006Projectile",
            "ClusterBombOverchargedSummonProjectile",
            "Tick006UltiProjectile",
            "ClusterBombOverchargedSummonProjectile",
          ],
          i: ["Tick006Mine"],
        },
        ClusterBombDudeGodzillaDark: {
          a: [],
          p: [
            "Tick006Projectile",
            "ClusterBombOverchargedSummonProjectile",
            "Tick006UltiProjectile",
            "ClusterBombOverchargedSummonProjectile",
          ],
          i: ["Tick006Mine"],
        },
        ClusterBombDudeGodzillaGold: {
          a: [],
          p: [
            "Tick006Projectile",
            "ClusterBombOverchargedSummonProjectile",
            "Tick006UltiProjectile",
            "ClusterBombOverchargedSummonProjectile",
          ],
          i: ["Tick006Mine"],
        },
        ClusterBombDudeSB: {
          a: [],
          p: [
            "Tick007Projectile",
            "ClusterBombOverchargedSummonProjectile",
            "Tick007UltiProjectile",
            "ClusterBombOverchargedSummonProjectile",
          ],
          i: ["ClusterMine"],
        },
        ClusterBombDudeRare: {
          a: [],
          p: [
            "Tick008UltiProjectile",
            "ClusterBombOverchargedSummonProjectile",
            "ClusterBombSummonProjectile",
            "ClusterBombOverchargedSummonProjectile",
          ],
          i: ["ClusterMine"],
        },
        ClusterBombBrawloween: {
          a: [],
          p: [
            "Tick009Projectile",
            "ClusterBombOverchargedSummonProjectile",
            "Tick009UltiProjectile",
            "ClusterBombOverchargedSummonProjectile",
          ],
          i: ["Tick009Mine"],
        },
      },
      Arcade: {
        ArcadeDefault: {
          a: ["DamageBoost", "DamageBoost_larger", "DamageBoostPlugIn"],
          p: [
            "ArcadeProjectile",
            "ArcadeUltiOverchargedProjectile",
            "ArcadeUltiProjectile",
            "ArcadeUltiOverchargedProjectile",
          ],
          i: [],
        },
        ArcadeClassic: {
          a: ["DamageBoost", "DamageBoost_larger", "DamageBoostPlugIn"],
          p: [
            "ArcadeProjectile",
            "ArcadeUltiOverchargedProjectile",
            "ArcadeUltiProjectile",
            "ArcadeUltiOverchargedProjectile",
          ],
          i: [],
        },
        ArcadeVirus: {
          a: ["Arcade002Ulti", "Arcade002Ulti_larger", "DamageBoostPlugIn002"],
          p: [
            "Arcade002Projectile",
            "ArcadeUltiOverchargedProjectile",
            "Arcade002UltiProjectile",
            "ArcadeUltiOverchargedProjectile",
          ],
          i: [],
        },
        ArcadePiano: {
          a: ["Arcade003Ulti", "Arcade003Ulti_larger", "DamageBoostPlugIn003"],
          p: [
            "Arcade003Projectile",
            "ArcadeUltiOverchargedProjectile",
            "Arcade003UltiProjectile",
            "ArcadeUltiOverchargedProjectile",
          ],
          i: [],
        },
        ArcadeSilver: {
          a: ["DamageBoost", "DamageBoost_larger", "DamageBoostPlugIn"],
          p: [
            "ArcadeProjectile",
            "ArcadeUltiOverchargedProjectile",
            "ArcadeUltiProjectile",
            "ArcadeUltiOverchargedProjectile",
          ],
          i: [],
        },
        ArcadeGold: {
          a: ["DamageBoost", "DamageBoost_larger", "DamageBoostPlugIn"],
          p: [
            "ArcadeProjectile",
            "ArcadeUltiOverchargedProjectile",
            "ArcadeUltiProjectile",
            "ArcadeUltiOverchargedProjectile",
          ],
          i: [],
        },
        ArcadeRetropolis: {
          a: ["Arcade004Ulti", "Arcade004Ulti_larger", "DamageBoostPlugIn004"],
          p: [
            "Arcade004Projectile",
            "ArcadeUltiOverchargedProjectile",
            "Arcade004UltiProjectile",
            "ArcadeUltiOverchargedProjectile",
          ],
          i: [],
        },
        ArcadeHauntedHouse: {
          a: ["Arcade005Ulti", "Arcade005Ulti_larger", "DamageBoostPlugIn005"],
          p: [
            "Arcade005Projectile",
            "ArcadeUltiOverchargedProjectile",
            "Arcade005UltiProjectile",
            "ArcadeUltiOverchargedProjectile",
          ],
          i: [],
        },
        ArcadeVirusChroma: {
          a: ["Arcade002Ulti", "Arcade002Ulti_larger", "DamageBoostPlugIn002"],
          p: [
            "Arcade002Projectile",
            "ArcadeUltiOverchargedProjectile",
            "Arcade002UltiProjectile",
            "ArcadeUltiOverchargedProjectile",
          ],
          i: [],
        },
        ArcadePiano_black: {
          a: ["Arcade003Ulti", "Arcade003Ulti_larger", "DamageBoostPlugIn003"],
          p: [
            "Arcade003Projectile",
            "ArcadeUltiOverchargedProjectile",
            "Arcade003UltiProjectile",
            "ArcadeUltiOverchargedProjectile",
          ],
          i: [],
        },
        ArcadeAngel: {
          a: ["Arcade006Ulti", "Arcade006Ulti_larger", "DamageBoostPlugIn006"],
          p: [
            "Arcade006Projectile",
            "ArcadeUltiOverchargedProjectile",
            "Arcade006UltiProjectile",
            "ArcadeUltiOverchargedProjectile",
          ],
          i: [],
        },
        ArcadeSandsOfTime: {
          a: ["Arcade007Ulti", "Arcade007Ulti_larger", "DamageBoostPlugIn007"],
          p: [
            "Arcade007Projectile",
            "ArcadeUltiOverchargedProjectile",
            "Arcade007UltiProjectile",
            "ArcadeUltiOverchargedProjectile",
          ],
          i: [],
        },
      },
      Sandstorm: {
        SandstormDefault: {
          a: [],
          p: [
            "SandstormProjectile",
            "SandstormOverchargedUltiProjectile",
            "SandstormUltiProjectile",
            "SandstormOverchargedUltiProjectile",
          ],
          i: [],
        },
        Sandstormsleepy: {
          a: [],
          p: [
            "SandstormProjectile",
            "SandstormOverchargedUltiProjectile",
            "SandstormUltiProjectile",
            "SandstormOverchargedUltiProjectile",
          ],
          i: [],
        },
        SandstormGiftShop: {
          a: [],
          p: [
            "Sandy002Projectile",
            "SandstormOverchargedUltiProjectile",
            "Sandy002UltiProjectile",
            "SandstormOverchargedUltiProjectile",
          ],
          i: [],
        },
        SandstormLantern: {
          a: [],
          p: [
            "Sandy003Projectile",
            "SandstormOverchargedUltiProjectile",
            "Sandy003UltiProjectile",
            "SandstormOverchargedUltiProjectile",
          ],
          i: [],
        },
        SandstormGold: {
          a: [],
          p: [
            "SandstormProjectile",
            "SandstormOverchargedUltiProjectile",
            "SandstormUltiProjectile",
            "SandstormOverchargedUltiProjectile",
          ],
          i: [],
        },
        SandstormSilver: {
          a: [],
          p: [
            "SandstormProjectile",
            "SandstormOverchargedUltiProjectile",
            "SandstormUltiProjectile",
            "SandstormOverchargedUltiProjectile",
          ],
          i: [],
        },
        SandstormKoya: {
          a: [],
          p: [
            "Sandy004Projectile",
            "SandstormOverchargedUltiProjectile",
            "Sandy004UltiProjectile",
            "SandstormOverchargedUltiProjectile",
          ],
          i: [],
        },
        SandstormMake: {
          a: [],
          p: [
            "Sandy005Projectile",
            "SandstormOverchargedUltiProjectile",
            "Sandy005UltiProjectile",
            "SandstormOverchargedUltiProjectile",
          ],
          i: [],
        },
        SandstormDeepsea: {
          a: [],
          p: [
            "Sandy006Projectile",
            "SandstormOverchargedUltiProjectile",
            "Sandy006UltiProjectile",
            "SandstormOverchargedUltiProjectile",
          ],
          i: [],
        },
        SandstormDeepseaPurple: {
          a: [],
          p: [
            "Sandy006Projectile",
            "SandstormOverchargedUltiProjectile",
            "Sandy006UltiProjectile",
            "SandstormOverchargedUltiProjectile",
          ],
          i: [],
        },
        SandstormDeepseaYellow: {
          a: [],
          p: [
            "Sandy006Projectile",
            "SandstormOverchargedUltiProjectile",
            "Sandy006UltiProjectile",
            "SandstormOverchargedUltiProjectile",
          ],
          i: [],
        },
        SandstormGreekGod: {
          a: [],
          p: [
            "Sandy007Projectile",
            "SandstormOverchargedUltiProjectile",
            "Sandy007UltiProjectile",
            "SandstormOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      BeeSniper: {
        BeeSniperDefault: {
          a: [],
          p: [
            "BeaOverchargedUltiProjectile",
            "BeeSniperUltiProjectile",
            "BeaOverchargedUltiProjectile",
          ],
          i: [],
        },
        BeeSniperLadyBug: {
          a: [],
          p: [
            "BeaOverchargedUltiProjectile",
            "BeeSniperUltiProjectile",
            "BeaOverchargedUltiProjectile",
          ],
          i: [],
        },
        BeeSniperMonster: {
          a: [],
          p: ["Bea002Projectile", "Bea002ChargedProjectile", "Bea002UltiProjectile"],
          i: [],
        },
        BeeSniperCat: {
          a: [],
          p: ["Bea003Projectile", "Bea003ChargedProjectile", "Bea003UltiProjectile"],
          i: [],
        },
        BeeSniperCatGold: {
          a: [],
          p: ["Bea004Projectile", "Bea004ChargedProjectile", "Bea004UltiProjectile"],
          i: [],
        },
        BeeSniperArchvillain: {
          a: [],
          p: ["Bea005Projectile", "Bea005ChargedProjectile", "Bea005UltiProjectile"],
          i: [],
        },
        BeeSniperGold: {
          a: [],
          p: [
            "BeaOverchargedUltiProjectile",
            "BeeSniperUltiProjectile",
            "BeaOverchargedUltiProjectile",
          ],
          i: [],
        },
        BeeSniperSilver: {
          a: [],
          p: [
            "BeaOverchargedUltiProjectile",
            "BeeSniperUltiProjectile",
            "BeaOverchargedUltiProjectile",
          ],
          i: [],
        },
        BeeSniperVirus: {
          a: [],
          p: ["Bea006Projectile", "Bea006ChargedProjectile", "Bea006UltiProjectile"],
          i: [],
        },
        BeeSniperBrawloween: {
          a: [],
          p: ["Bea007Projectile", "Bea007ChargedProjectile", "Bea007UltiProjectile"],
          i: [],
        },
      },
      Mummy: {
        MummyDefault: {
          a: ["MummyUltiArea", "MummyOverchargedUltiArea", "MummyOverchargedUltiAreaPushBack"],
          p: ["MummyProjectile"],
          i: [],
        },
        MummyCollege: {
          a: ["MummyUltiArea", "MummyOverchargedUltiArea", "MummyOverchargedUltiAreaPushBack"],
          p: ["MummyProjectile"],
          i: [],
        },
        MummyGold: {
          a: ["MummyUltiArea", "MummyOverchargedUltiArea", "MummyOverchargedUltiAreaPushBack"],
          p: ["MummyProjectile"],
          i: [],
        },
        MummySilver: {
          a: ["MummyUltiArea", "MummyOverchargedUltiArea", "MummyOverchargedUltiAreaPushBack"],
          p: ["MummyProjectile"],
          i: [],
        },
        MummyGiftShop: {
          a: ["Emz_002_Ulti", "MummyOverchargedUltiArea", "MummyOverchargedUltiAreaPushBack"],
          p: ["Emz002Projectile"],
          i: [],
        },
        MummyDj: {
          a: ["Emz_003_Ulti", "MummyOverchargedUltiArea", "MummyOverchargedUltiAreaPushBack"],
          p: ["Emz003Projectile"],
          i: [],
        },
        MummyHarajuku: {
          a: ["Emz_004_Ulti", "MummyOverchargedUltiArea", "MummyOverchargedUltiAreaPushBack"],
          p: ["Emz004Projectile"],
          i: [],
        },
        MummyGreek: {
          a: ["Emz_005_Ulti", "MummyOverchargedUltiArea", "MummyOverchargedUltiAreaPushBack"],
          p: ["Emz005Projectile"],
          i: [],
        },
        MummyGreekRed: {
          a: ["Emz_005_Ulti", "MummyOverchargedUltiArea", "MummyOverchargedUltiAreaPushBack"],
          p: ["Emz005Projectile"],
          i: [],
        },
        MummyGreekBlue: {
          a: ["Emz_005_Ulti", "MummyOverchargedUltiArea", "MummyOverchargedUltiAreaPushBack"],
          p: ["Emz005Projectile"],
          i: [],
        },
        MummyDemon: {
          a: ["Emz_006_Ulti", "MummyOverchargedUltiArea", "MummyOverchargedUltiAreaPushBack"],
          p: ["Emz006Projectile"],
          i: [],
        },
        MummySurfer: {
          a: ["Emz_007_Ulti", "MummyOverchargedUltiArea", "MummyOverchargedUltiAreaPushBack"],
          p: ["Emz007Projectile"],
          i: [],
        },
        MummySurferChroma1: {
          a: ["Emz_007_Ulti", "MummyOverchargedUltiArea", "MummyOverchargedUltiAreaPushBack"],
          p: ["Emz007Projectile"],
          i: [],
        },
        MummySurferChroma2: {
          a: ["Emz_007_Ulti", "MummyOverchargedUltiArea", "MummyOverchargedUltiAreaPushBack"],
          p: ["Emz007Projectile"],
          i: [],
        },
      },
      SpawnerDude: {
        SpawnerDudeDefault: {
          a: [],
          p: [
            "SpawnerDudeProjectile",
            "SpawnerDudeOverchargedUltiProjectile",
            "SpawnerDudeUltiProjectile",
            "SpawnerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        SpawnerDudeAgentP: {
          a: [],
          p: [
            "SpawnerDudeProjectile",
            "SpawnerDudeOverchargedUltiProjectile",
            "SpawnerDudeUltiProjectile",
            "SpawnerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        SpawnerDudeTrueGold: {
          a: [],
          p: [
            "SpawnerDudeProjectile",
            "SpawnerDudeOverchargedUltiProjectile",
            "SpawnerDudeUltiProjectile",
            "SpawnerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        SpawnerDudeTrueSilver: {
          a: [],
          p: [
            "SpawnerDudeProjectile",
            "SpawnerDudeOverchargedUltiProjectile",
            "SpawnerDudeUltiProjectile",
            "SpawnerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        SpawnerDudeDracula: {
          a: [],
          p: [
            "SpawnerDude002Projectile",
            "SpawnerDudeOverchargedUltiProjectile",
            "SpawnerDude002UltiProjectile",
            "SpawnerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        SpawnerDudeFly: {
          a: [],
          p: [
            "SpawnerDude003Projectile",
            "SpawnerDudeOverchargedUltiProjectile",
            "SpawnerDude003UltiProjectile",
            "SpawnerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        SpawnerDudeDaruma: {
          a: [],
          p: [
            "SpawnerDude004Projectile",
            "SpawnerDudeOverchargedUltiProjectile",
            "SpawnerDude004UltiProjectile",
            "SpawnerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        SpawnerDudeMake: {
          a: [],
          p: [
            "SpawnerDude005Projectile",
            "SpawnerDudeOverchargedUltiProjectile",
            "SpawnerDude005UltiProjectile",
            "SpawnerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        SpawnerDudeGym: {
          a: [],
          p: [
            "SpawnerDude006Projectile",
            "SpawnerDudeOverchargedUltiProjectile",
            "SpawnerDude006UltiProjectile",
            "SpawnerDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      Speedy: {
        SpeedyDefault: {
          a: ["SpeedyUltiArea", "SpeedyUltiOverchargedArea"],
          p: ["SpeedyProjectile"],
          i: [],
        },
        SpeedyGT: {
          a: ["SpeedyUltiArea", "SpeedyUltiOverchargedArea"],
          p: ["SpeedyProjectile"],
          i: [],
        },
        SpeedyTracksuit: {
          a: ["SpeedyUltiArea", "SpeedyUltiOverchargedArea"],
          p: ["SpeedyProjectile"],
          i: [],
        },
        SpeedyLine: {
          a: ["SpeedyUltiArea", "SpeedyUltiOverchargedArea"],
          p: ["Max002Projectile"],
          i: [],
        },
        SpeedyHermes: {
          a: ["Max003UltiArea", "SpeedyUltiOverchargedArea"],
          p: ["Max003Projectile"],
          i: [],
        },
        SpeedySilver: {
          a: ["SpeedyUltiArea", "SpeedyUltiOverchargedArea"],
          p: ["SpeedyProjectile"],
          i: [],
        },
        SpeedyGold: {
          a: ["SpeedyUltiArea", "SpeedyUltiOverchargedArea"],
          p: ["SpeedyProjectile"],
          i: [],
        },
        SpeedyLeopard: {
          a: ["Max004UltiArea", "SpeedyUltiOverchargedArea"],
          p: ["Max004Projectile"],
          i: [],
        },
        SpeedyBlackPanther: {
          a: ["Max004UltiArea", "SpeedyUltiOverchargedArea"],
          p: ["Max004Projectile"],
          i: [],
        },
        SpeedyAngel: {
          a: ["Max005UltiArea", "SpeedyUltiOverchargedArea"],
          p: ["Max005Projectile"],
          i: [],
        },
        SpeedyEsports: {
          a: ["Max006UltiArea", "SpeedyUltiOverchargedArea"],
          p: ["Max006Projectile"],
          i: [],
        },
      },
      Driller: {
        DrillerDefault: {
          a: ["DrillerDamageArea", "DrillerUltiArea", "DrillerOverchargedUltiArea"],
          p: [],
          i: [],
        },
        DrillerConstructor: {
          a: ["DrillerDamageArea", "DrillerUltiArea", "DrillerOverchargedUltiArea"],
          p: [],
          i: [],
        },
        DrillerMonster: {
          a: ["Driller_002_atk", "DrillerUltiArea", "DrillerOverchargedUltiArea"],
          p: [],
          i: [],
        },
        DrillerJetski: {
          a: ["Driller_003_atk", "Driller_003_ulti", "DrillerOverchargedUltiArea"],
          p: [],
          i: [],
        },
        DrillerGift: {
          a: ["Driller_004_atk", "Driller_004_ulti", "DrillerOverchargedUltiArea"],
          p: [],
          i: [],
        },
        DrillerGold: {
          a: ["DrillerDamageArea", "DrillerUltiArea", "DrillerOverchargedUltiArea"],
          p: [],
          i: [],
        },
        DrillerSilver: {
          a: ["DrillerDamageArea", "DrillerUltiArea", "DrillerOverchargedUltiArea"],
          p: [],
          i: [],
        },
        DrillerCooky: {
          a: ["Driller_005_atk", "Driller_005_ulti", "DrillerOverchargedUltiArea"],
          p: [],
          i: [],
        },
        DrillerJetski_purple: {
          a: ["Driller_003_atk", "Driller_003_ulti", "DrillerOverchargedUltiArea"],
          p: [],
          i: [],
        },
        DrillerDeepsea: {
          a: ["Driller_006_atk", "Driller_006_ulti", "DrillerOverchargedUltiArea"],
          p: [],
          i: [],
        },
        DrillerFantasy: {
          a: ["Driller_007_atk", "Driller_007_ulti", "DrillerOverchargedUltiArea"],
          p: [],
          i: [],
        },
      },
      Blower: {
        BlowerDefault: {
          a: [],
          p: [
            "BlowerProjectile",
            "BlowerUltiOverchargedProjectile",
            "BlowerUltiProjectile",
            "BlowerUltiOverchargedProjectile",
          ],
          i: [],
        },
        BlowerTrader: {
          a: [],
          p: [
            "Gale002Projectile",
            "BlowerUltiOverchargedProjectile",
            "Gale002UltiProjectile",
            "BlowerUltiOverchargedProjectile",
          ],
          i: [],
        },
        BlowerNutcracker: {
          a: [],
          p: [
            "Gale003Projectile",
            "BlowerUltiOverchargedProjectile",
            "Gale003UltiProjectile",
            "BlowerUltiOverchargedProjectile",
          ],
          i: [],
        },
        BlowerSilver: {
          a: [],
          p: [
            "BlowerProjectile",
            "BlowerUltiOverchargedProjectile",
            "BlowerUltiProjectile",
            "BlowerUltiOverchargedProjectile",
          ],
          i: [],
        },
        BlowerGold: {
          a: [],
          p: [
            "BlowerProjectile",
            "BlowerUltiOverchargedProjectile",
            "BlowerUltiProjectile",
            "BlowerUltiOverchargedProjectile",
          ],
          i: [],
        },
        BlowerBusters: {
          a: [],
          p: [
            "Gale004Projectile",
            "BlowerUltiOverchargedProjectile",
            "Gale004UltiProjectile",
            "BlowerUltiOverchargedProjectile",
          ],
          i: [],
        },
        BlowerDeepsea: {
          a: [],
          p: [
            "Gale005Projectile",
            "BlowerUltiOverchargedProjectile",
            "Gale005UltiProjectile",
            "BlowerUltiOverchargedProjectile",
          ],
          i: [],
        },
        BlowerAstronaut: {
          a: [],
          p: [
            "BlowerProjectile",
            "BlowerUltiOverchargedProjectile",
            "BlowerUltiProjectile",
            "BlowerUltiOverchargedProjectile",
          ],
          i: [],
        },
        BlowerSteamPunk: {
          a: [],
          p: [
            "Gale006Projectile",
            "BlowerUltiOverchargedProjectile",
            "Gale006UltiProjectile",
            "BlowerUltiOverchargedProjectile",
          ],
          i: [],
        },
        BlowerSteamPunkChroma1: {
          a: [],
          p: [
            "Gale006Projectile",
            "BlowerUltiOverchargedProjectile",
            "Gale006UltiProjectile",
            "BlowerUltiOverchargedProjectile",
          ],
          i: [],
        },
        BlowerSteamPunkChroma2: {
          a: [],
          p: [
            "Gale006Projectile",
            "BlowerUltiOverchargedProjectile",
            "Gale006UltiProjectile",
            "BlowerUltiOverchargedProjectile",
          ],
          i: [],
        },
      },
      Controller: {
        ControllerDefault: {
          a: [],
          p: [
            "ControllerProjectile",
            "ControllerUltiOverchargedProjectile",
            "ControllerUltiProjectile",
            "ControllerUltiOverchargedProjectile",
          ],
          i: [],
        },
        ControllerRetro: {
          a: [],
          p: [
            "Nani002UltiProjectile",
            "ControllerUltiOverchargedProjectile",
            "ControllerUltiProjectile",
            "ControllerUltiOverchargedProjectile",
          ],
          i: [],
        },
        ControllerLine: {
          a: [],
          p: [
            "Nani003Projectile",
            "ControllerUltiOverchargedProjectile",
            "Nani003UltiProjectile",
            "ControllerUltiOverchargedProjectile",
          ],
          i: [],
        },
        ControllerGold: {
          a: [],
          p: [
            "NaniGoldUltiProjectile",
            "ControllerUltiOverchargedProjectile",
            "ControllerUltiProjectile",
            "ControllerUltiOverchargedProjectile",
          ],
          i: [],
        },
        ControllerSilver: {
          a: [],
          p: [
            "NaniSilverUltiProjectile",
            "ControllerUltiOverchargedProjectile",
            "ControllerUltiProjectile",
            "ControllerUltiOverchargedProjectile",
          ],
          i: [],
        },
        ControllerEaster: {
          a: [],
          p: [
            "Nani004Projectile",
            "ControllerUltiOverchargedProjectile",
            "Nani004UltiProjectile",
            "ControllerUltiOverchargedProjectile",
          ],
          i: [],
        },
        ControllerAres: {
          a: [],
          p: [
            "Nani005Projectile",
            "ControllerUltiOverchargedProjectile",
            "Nani005UltiProjectile",
            "ControllerUltiOverchargedProjectile",
          ],
          i: [],
        },
        ControllerOnceupon: {
          a: [],
          p: [
            "Nani006Projectile",
            "ControllerUltiOverchargedProjectile",
            "Nani006UltiProjectile",
            "ControllerUltiOverchargedProjectile",
          ],
          i: [],
        },
        ControllerXmas: {
          a: [],
          p: [
            "Nani007Projectile",
            "ControllerUltiOverchargedProjectile",
            "Nani007UltiProjectile",
            "ControllerUltiOverchargedProjectile",
          ],
          i: [],
        },
      },
      Wally: {
        WallyDefault: {
          a: ["WallyExplosionBig"],
          p: [
            "WallyProjectile",
            "WallyOverchargedUltiProjectile",
            "WallyUltiProjectile",
            "WallyOverchargedUltiProjectile",
          ],
          i: [],
        },
        WallyHawaii: {
          a: ["WallyExplosionBig"],
          p: [
            "WallyProjectile",
            "WallyOverchargedUltiProjectile",
            "WallyUltiProjectile",
            "WallyOverchargedUltiProjectile",
          ],
          i: [],
        },
        WallyMoon: {
          a: ["Sprout_002_sp1"],
          p: [
            "Sprout002Projectile",
            "Sprout002SecondaryProjectile",
            "Sprout002UltiProjectile",
            "Sprout002UltiProjectile",
          ],
          i: [],
        },
        WallyPrince: {
          a: ["Sprout_003_atk"],
          p: [
            "Sprout003Projectile",
            "Sprout003SecondaryProjectile",
            "Sprout003UltiProjectile",
            "Sprout003UltiProjectile",
          ],
          i: [],
        },
        WallyPrinceChroma: {
          a: ["Sprout_003_atk"],
          p: [
            "Sprout003Projectile",
            "Sprout003SecondaryProjectile",
            "Sprout003ChromaUltiProjectile",
            "Sprout003ChromaUltiProjectile",
          ],
          i: [],
        },
        WallyWeirdPlant: {
          a: ["Sprout_004_sp"],
          p: [
            "Sprout004Projectile",
            "Sprout004SecondaryProjectile",
            "Sprout004UltiProjectile",
            "Sprout004UltiProjectile",
          ],
          i: [],
        },
        Wallygold: {
          a: ["WallyExplosionBig"],
          p: [
            "WallyProjectile",
            "WallyOverchargedUltiProjectile",
            "WallyUltiProjectile",
            "WallyOverchargedUltiProjectile",
          ],
          i: [],
        },
        Wallysilver: {
          a: ["WallyExplosionBig"],
          p: [
            "WallyProjectile",
            "WallyOverchargedUltiProjectile",
            "WallyUltiProjectile",
            "WallyOverchargedUltiProjectile",
          ],
          i: [],
        },
        WallyDeepsea: {
          a: ["Sprout_005_sp"],
          p: [
            "Sprout005Projectile",
            "Sprout005SecondaryProjectile",
            "Sprout005UltiProjectile",
            "Sprout005UltiProjectile",
          ],
          i: [],
        },
        WallyJapan: {
          a: ["Sprout_006_sp"],
          p: [
            "Sprout006Projectile",
            "Sprout006SecondaryProjectile",
            "Sprout006UltiProjectile",
            "Sprout006UltiProjectile",
          ],
          i: [],
        },
      },
      PowerLeveler: {
        PowerLevelerDefault: { a: [], p: ["PowerLevelerProjectile"], i: [] },
        PowerLevelerKnight: { a: [], p: ["Surge004Projectile"], i: [] },
        PowerLevelerDIY: { a: [], p: ["Surge002Projectile"], i: [] },
        PowerLevelerKong: { a: [], p: ["Surge003Projectile"], i: [] },
        PowerLevelerGold: { a: [], p: ["PowerLevelerProjectile"], i: [] },
        PowerLevelerSilver: { a: [], p: ["PowerLevelerProjectile"], i: [] },
        PowerLevelerKraken: { a: [], p: ["Surge005Projectile"], i: [] },
        PowerLevelerGenie: { a: [], p: ["Surge006Projectile"], i: [] },
        PowerLevelerKnight_red: { a: [], p: ["Surge004Projectile"], i: [] },
        PowerLevelerOnceupon: { a: [], p: ["Surge007Projectile"], i: [] },
        PowerLevelerOnceupon_Red: { a: [], p: ["Surge007Projectile"], i: [] },
        PowerLevelerOnceupon_Gold: { a: [], p: ["Surge007Projectile"], i: [] },
        PowerLevelerBuzz: { a: [], p: ["Surge008Projectile"], i: [] },
        PowerLevelerRare: { a: [], p: ["PowerLevelerProjectile"], i: [] },
        PowerLevelerPorcelain: { a: [], p: ["Surge010Projectile_k2"], i: [] },
      },
      Percenter: {
        PercenterDefault: { a: [], p: ["PercenterProjectile", "MechanicTurretProjectile"], i: [] },
        PercenterTrixie: { a: [], p: ["Colette002Projectile", "MechanicTurretProjectile"], i: [] },
        PercenterCrew: { a: [], p: ["Colette003Projectile", "MechanicTurretProjectile"], i: [] },
        PercenterGladiator: {
          a: [],
          p: ["Colette004Projectile", "MechanicTurretProjectile"],
          i: [],
        },
        PercenterGold: { a: [], p: ["PercenterProjectile", "MechanicTurretProjectile"], i: [] },
        PercenterSilver: { a: [], p: ["PercenterProjectile", "MechanicTurretProjectile"], i: [] },
        PercenterInspector: {
          a: [],
          p: ["Colette005Projectile", "MechanicTurretProjectile"],
          i: [],
        },
        Percenteranime: { a: [], p: ["Colette006Projectile", "MechanicTurretProjectile"], i: [] },
        PercenteranimeChromaGreen: {
          a: [],
          p: ["Colette006Projectile", "MechanicTurretProjectile"],
          i: [],
        },
        PercenteranimeChromaYellow: {
          a: [],
          p: ["Colette006Projectile", "MechanicTurretProjectile"],
          i: [],
        },
        PercenterCony: { a: [], p: ["Colette007Projectile", "MechanicTurretProjectile"], i: [] },
        PercenterCursed: { a: [], p: ["PercenterProjectile", "MechanicTurretProjectile"], i: [] },
        PercenterChromaDemonRed: {
          a: [],
          p: ["Colette002Projectile", "MechanicTurretProjectile"],
          i: [],
        },
        PercenterKaiju: { a: [], p: ["Colette008Projectile", "MechanicTurretProjectile"], i: [] },
      },
      FireDude: {
        FireDudeDefault: {
          a: ["PetrolFire"],
          p: [
            "FireDudeProjectile",
            "FireDudeOverchargedUltiProjectile",
            "FireDudeUltiProjectile",
            "FireDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        FireDudeMasked: {
          a: ["PetrolFire002"],
          p: [
            "FireDude002Projectile",
            "FireDudeOverchargedUltiProjectile",
            "FireDude002UltiProjectile",
            "FireDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        FireDudeGold: {
          a: ["PetrolFire"],
          p: [
            "FireDudeProjectile",
            "FireDudeOverchargedUltiProjectile",
            "FireDudeUltiProjectile",
            "FireDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        FireDudeSilver: {
          a: ["PetrolFire"],
          p: [
            "FireDudeProjectile",
            "FireDudeOverchargedUltiProjectile",
            "FireDudeUltiProjectile",
            "FireDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        FireDudeFrost: {
          a: ["PetrolFire003"],
          p: [
            "FireDude003Projectile",
            "FireDudeOverchargedUltiProjectile",
            "FireDude003UltiProjectile",
            "FireDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        FireDudeMake: {
          a: ["PetrolFire004"],
          p: [
            "FireDude004Projectile",
            "FireDudeOverchargedUltiProjectile",
            "FireDude004UltiProjectile",
            "FireDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        FireDudeRare: {
          a: ["PetrolFire"],
          p: [
            "FireDudeProjectile",
            "FireDudeOverchargedUltiProjectile",
            "FireDudeUltiProjectile",
            "FireDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        FireDudeFantasy: {
          a: ["PetrolFire005"],
          p: [
            "FireDude005Projectile",
            "FireDudeOverchargedUltiProjectile",
            "FireDude005UltiProjectile",
            "FireDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      IceDude: {
        IceDudeDefault: {
          a: [],
          p: [
            "IceDudeProjectile",
            "IceDudeOverchargedUltiProjectile",
            "IceDudeUltiProjectile",
            "IceDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        IceDudeKing: {
          a: [],
          p: [
            "Lou002Projectile",
            "IceDudeOverchargedUltiProjectile",
            "Lou002UltiProjectile",
            "IceDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        IceDudeCrooner: {
          a: [],
          p: [
            "Lou003Projectile",
            "IceDudeOverchargedUltiProjectile",
            "Lou003UltiProjectile",
            "IceDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        IceDudeBurger: {
          a: [],
          p: [
            "Lou004Projectile",
            "IceDudeOverchargedUltiProjectile",
            "Lou004UltiProjectile",
            "IceDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        IceDudeGold: {
          a: [],
          p: [
            "IceDudeProjectile",
            "IceDudeOverchargedUltiProjectile",
            "IceDudeUltiProjectile",
            "IceDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        IceDudeSilver: {
          a: [],
          p: [
            "IceDudeProjectile",
            "IceDudeOverchargedUltiProjectile",
            "IceDudeUltiProjectile",
            "IceDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        IceDudeStonetroll: {
          a: [],
          p: [
            "Lou005Projectile",
            "IceDudeOverchargedUltiProjectile",
            "Lou005UltiProjectile",
            "IceDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        IceDudeToon: {
          a: [],
          p: [
            "Lou006Projectile",
            "IceDudeOverchargedUltiProjectile",
            "Lou006UltiProjectile",
            "IceDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        IceDudeRare: {
          a: [],
          p: [
            "IceDudeProjectile",
            "IceDudeOverchargedUltiProjectile",
            "IceDudeUltiProjectile",
            "IceDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      SnakeOil: {
        SnakeOilDefault: {
          a: [],
          p: [
            "SnakeOilProjectile",
            "SnakeOilHyperUltiProjectile",
            "SnakeOilUltiProjectile",
            "SnakeOilHyperUltiProjectile",
          ],
          i: [],
        },
        SnakeOilWizard: {
          a: [],
          p: [
            "Byron002Projectile",
            "SnakeOilHyperUltiProjectile",
            "Byron002UltiProjectile",
            "SnakeOilHyperUltiProjectile",
          ],
          i: [],
        },
        SnakeOilVillain: {
          a: [],
          p: [
            "Byron003Projectile",
            "SnakeOilHyperUltiProjectile",
            "Byroon003UltiProjectile",
            "SnakeOilHyperUltiProjectile",
          ],
          i: [],
        },
        SnakeOilGold: {
          a: [],
          p: [
            "SnakeOilProjectile",
            "SnakeOilHyperUltiProjectile",
            "SnakeOilUltiProjectile",
            "SnakeOilHyperUltiProjectile",
          ],
          i: [],
        },
        SnakeOilSilver: {
          a: [],
          p: [
            "SnakeOilProjectile",
            "SnakeOilHyperUltiProjectile",
            "SnakeOilUltiProjectile",
            "SnakeOilHyperUltiProjectile",
          ],
          i: [],
        },
        SnakeOilDarkcircus: {
          a: [],
          p: [
            "Byron004Projectile",
            "SnakeOilHyperUltiProjectile",
            "Byron004UltiProjectile",
            "SnakeOilHyperUltiProjectile",
          ],
          i: [],
        },
        SnakeOilTropical: {
          a: [],
          p: [
            "SnakeOilProjectile",
            "SnakeOilHyperUltiProjectile",
            "SnakeOilUltiProjectile",
            "SnakeOilHyperUltiProjectile",
          ],
          i: [],
        },
        SnakeOilWizard_white: {
          a: [],
          p: [
            "Byron002Projectile",
            "SnakeOilHyperUltiProjectile",
            "Byron002UltiProjectile",
            "SnakeOilHyperUltiProjectile",
          ],
          i: [],
        },
        SnakeOilSurfer: {
          a: [],
          p: [
            "Byron005Projectile",
            "SnakeOilHyperUltiProjectile",
            "Byron005UltiProjectile",
            "SnakeOilHyperUltiProjectile",
          ],
          i: [],
        },
      },
      Enrager: {
        EnragerDefault: {
          a: [
            "EnragerUltiSpeed",
            "EnragerOverchargedUlti",
            "EnragerUltiSpeed",
            "EnragerStarPowerDamage",
          ],
          p: ["EnragerProjectile"],
          i: [],
        },
        EnragerDuel: {
          a: [
            "EnragerUltiSpeed",
            "EnragerOverchargedUlti",
            "EnragerUltiSpeed",
            "EnragerStarPowerDamage",
          ],
          p: ["Enrager002Projectile"],
          i: [],
        },
        EnragerSnake: {
          a: [
            "EnragerUltiSpeed",
            "EnragerOverchargedUlti",
            "EnragerUltiSpeed",
            "EnragerStarPowerDamage",
          ],
          p: ["Enrager003Projectile"],
          i: [],
        },
        EnragerVine: {
          a: [
            "EnragerUltiSpeed",
            "EnragerOverchargedUlti",
            "EnragerUltiSpeed",
            "EnragerStarPowerDamage",
          ],
          p: ["Enrager004Projectile"],
          i: [],
        },
        EnragerTata: {
          a: [
            "EnragerUltiSpeed",
            "EnragerOverchargedUlti",
            "EnragerUltiSpeed",
            "EnragerStarPowerDamage",
          ],
          p: ["Enrager005Projectile"],
          i: [],
        },
        EnragerGold: {
          a: [
            "EnragerUltiSpeed",
            "EnragerOverchargedUlti",
            "EnragerUltiSpeed",
            "EnragerStarPowerDamage",
          ],
          p: ["EnragerProjectile"],
          i: [],
        },
        EnragerSilver: {
          a: [
            "EnragerUltiSpeed",
            "EnragerOverchargedUlti",
            "EnragerUltiSpeed",
            "EnragerStarPowerDamage",
          ],
          p: ["EnragerProjectile"],
          i: [],
        },
        EnragerVigilante: {
          a: [
            "EnragerUltiSpeed",
            "EnragerOverchargedUlti",
            "EnragerUltiSpeed",
            "EnragerStarPowerDamage",
          ],
          p: ["EnragerProjectile"],
          i: [],
        },
        EnragerMecha: {
          a: [
            "EnragerUltiSpeed",
            "EnragerOverchargedUlti",
            "EnragerUltiSpeed",
            "EnragerStarPowerDamage",
          ],
          p: ["Enrager006Projectile"],
          i: [],
        },
        EnragerEnragerMecha01: {
          a: [
            "EnragerUltiSpeed",
            "EnragerOverchargedUlti",
            "EnragerUltiSpeed",
            "EnragerStarPowerDamage",
          ],
          p: ["Enrager006Projectile"],
          i: [],
        },
        EnragerEnragerMecha00: {
          a: [
            "EnragerUltiSpeed",
            "EnragerOverchargedUlti",
            "EnragerUltiSpeed",
            "EnragerStarPowerDamage",
          ],
          p: ["Enrager006Projectile"],
          i: [],
        },
        EnragerThief: {
          a: [
            "EnragerUltiSpeed",
            "EnragerOverchargedUlti",
            "EnragerUltiSpeed",
            "EnragerStarPowerDamage",
          ],
          p: ["Enrager007Projectile"],
          i: [],
        },
        EnragerAngel: {
          a: [
            "EnragerUltiSpeed",
            "EnragerOverchargedUlti",
            "EnragerUltiSpeed",
            "Enrager008OverchargedStarPowerDamage",
          ],
          p: ["Enrager008Projectile"],
          i: [],
        },
        EnragerAngelChroma1: {
          a: [
            "EnragerUltiSpeed",
            "EnragerOverchargedUlti",
            "EnragerUltiSpeed",
            "Enrager008OverchargedStarPowerDamage",
          ],
          p: ["Enrager008Projectile"],
          i: [],
        },
        EnragerAngelChroma2: {
          a: [
            "EnragerUltiSpeed",
            "EnragerOverchargedUlti",
            "EnragerUltiSpeed",
            "Enrager008OverchargedStarPowerDamage",
          ],
          p: ["Enrager008Projectile"],
          i: [],
        },
        EnragerKaiju: {
          a: [
            "EnragerUltiSpeed",
            "EnragerOverchargedUlti",
            "EnragerUltiSpeed",
            "EnragerStarPowerDamage",
          ],
          p: ["Enrager009Projectile"],
          i: [],
        },
        EnragerKaijuChroma1: {
          a: [
            "EnragerUltiSpeed",
            "EnragerOverchargedUlti",
            "EnragerUltiSpeed",
            "EnragerStarPowerDamage",
          ],
          p: ["Enrager009Projectile"],
          i: [],
        },
        EnragerKaijuChroma2: {
          a: [
            "EnragerUltiSpeed",
            "EnragerOverchargedUlti",
            "EnragerUltiSpeed",
            "EnragerStarPowerDamage",
          ],
          p: ["Enrager009Projectile"],
          i: [],
        },
      },
      Ruffs: {
        RuffsDefault: {
          a: [],
          p: [
            "RuffsProjectile",
            "RuffsOverchargedUltiProjectile",
            "RuffsUltiProjectile",
            "RuffsOverchargedUltiProjectile",
          ],
          i: [],
        },
        RuffsRonin: {
          a: [],
          p: [
            "Ruffs002Projectile",
            "RuffsOverchargedUltiProjectile",
            "Ruffs002UltiProjectile",
            "RuffsOverchargedUltiProjectile",
          ],
          i: [],
        },
        RuffsMarshall: {
          a: [],
          p: [
            "Ruffs003Projectile",
            "RuffsOverchargedUltiProjectile",
            "Ruffs003UltiProjectile",
            "RuffsOverchargedUltiProjectile",
          ],
          i: [],
        },
        RuffsGold: {
          a: [],
          p: [
            "RuffsProjectile",
            "RuffsOverchargedUltiProjectile",
            "RuffsUltiProjectile",
            "RuffsOverchargedUltiProjectile",
          ],
          i: [],
        },
        RuffsSilver: {
          a: [],
          p: [
            "RuffsProjectile",
            "RuffsOverchargedUltiProjectile",
            "RuffsUltiProjectile",
            "RuffsOverchargedUltiProjectile",
          ],
          i: [],
        },
        RuffsChimmy: {
          a: [],
          p: [
            "Ruffs004Projectile",
            "RuffsOverchargedUltiProjectile",
            "Ruffs004UltiProjectile",
            "RuffsOverchargedUltiProjectile",
          ],
          i: [],
        },
        RuffsPirate: {
          a: [],
          p: [
            "Ruffs005Projectile",
            "RuffsOverchargedUltiProjectile",
            "Ruffs005UltiProjectile",
            "RuffsOverchargedUltiProjectile",
          ],
          i: [],
        },
        RuffsCoock: {
          a: [],
          p: [
            "RuffsProjectile",
            "RuffsOverchargedUltiProjectile",
            "RuffsUltiProjectile",
            "RuffsOverchargedUltiProjectile",
          ],
          i: [],
        },
        RuffsSandsOfTimes: {
          a: [],
          p: [
            "Ruffs006Projectile",
            "RuffsOverchargedUltiProjectile",
            "Ruffs006UltiProjectile",
            "RuffsOverchargedUltiProjectile",
          ],
          i: [],
        },
        RuffsBrawloween: {
          a: [],
          p: [
            "Ruffs007Projectile",
            "RuffsOverchargedUltiProjectile",
            "Ruffs007UltiProjectile",
            "RuffsOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      Roller: {
        RollerDefault: {
          a: ["RollerFire", "RollerOverchargedFire"],
          p: ["RollerProjectile"],
          i: [],
        },
        RollerWhite: { a: ["RollerFire", "RollerOverchargedFire"], p: ["RollerProjectile"], i: [] },
        RollerPunk: { a: ["RollerFire", "RollerOverchargedFire"], p: ["RollerProjectile"], i: [] },
        RollerHeadless: {
          a: ["Roller002Fire", "RollerOverchargedFire"],
          p: ["Roller002Projectile"],
          i: [],
        },
        RollerGold: { a: ["RollerFire", "RollerOverchargedFire"], p: ["RollerProjectile"], i: [] },
        RollerSilver: {
          a: ["RollerFire", "RollerOverchargedFire"],
          p: ["RollerProjectile"],
          i: [],
        },
        RollerUniversity: {
          a: ["Roller003Fire", "RollerOverchargedFire"],
          p: ["Roller003Projectile"],
          i: [],
        },
        RollerChristmas: {
          a: ["Roller004Fire", "RollerOverchargedFire"],
          p: ["Roller004Projectile"],
          i: [],
        },
        RollerGoodRandoms: {
          a: ["Roller005Fire", "RollerOverchargedFire"],
          p: ["Roller005Projectile"],
          i: [],
        },
        RollerGraffitiSpecial: {
          a: ["RollerFire", "RollerOverchargedFire"],
          p: ["RollerProjectile"],
          i: [],
        },
        RollerSteamPunk: {
          a: ["Roller006Fire", "RollerOverchargedFire"],
          p: ["Roller006Projectile"],
          i: [],
        },
        RollerSteamPunkChroma1: {
          a: ["Roller006Fire", "RollerOverchargedFire"],
          p: ["Roller006Projectile"],
          i: [],
        },
        RollerSteamPunkChroma2: {
          a: ["Roller006Fire", "RollerOverchargedFire"],
          p: ["Roller006Projectile"],
          i: [],
        },
      },
      ElectroSniper: {
        ElectroSniperDefault: {
          a: [],
          p: [
            "ElectroSniperProjectile",
            "ElectroSniperSecondaryProjectile_001",
            "ElectroSniperOverchargedUltiProjectile",
            "ElectroSniperUltiProjectile",
            "ElectroSniperOverchargedUltiProjectile",
          ],
          i: [],
        },
        ElectroSniperBoss: {
          a: [],
          p: [
            "Belle002Projectile",
            "ElectroSniperSecondaryProjectile_002",
            "ElectroSniperOverchargedUltiProjectile",
            "Belle002UltiProjectile",
            "ElectroSniperOverchargedUltiProjectile",
          ],
          i: [],
        },
        ElectroSniperPlanthunter: {
          a: [],
          p: [
            "Belle003Projectile",
            "ElectroSniperSecondaryProjectile_003",
            "ElectroSniperOverchargedUltiProjectile",
            "Belle003UltiProjectile",
            "ElectroSniperOverchargedUltiProjectile",
          ],
          i: [],
        },
        ElectroSniperCoral: {
          a: [],
          p: [
            "Belle004Projectile",
            "ElectroSniperSecondaryProjectile_004",
            "ElectroSniperOverchargedUltiProjectile",
            "Belle004UltiProjectile",
            "ElectroSniperOverchargedUltiProjectile",
          ],
          i: [],
        },
        ElectroSniperSCmake: {
          a: [],
          p: [
            "Belle005Projectile",
            "ElectroSniperSecondaryProjectile_005",
            "ElectroSniperOverchargedUltiProjectile",
            "Belle005UltiProjectile",
            "ElectroSniperOverchargedUltiProjectile",
          ],
          i: [],
        },
        ElectroSniperFantasy: {
          a: [],
          p: [
            "Belle006Projectile",
            "ElectroSniperSecondaryProjectile_006",
            "ElectroSniperOverchargedUltiProjectile",
            "Belle006UltiProjectile",
            "ElectroSniperOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      StickyBomb: {
        StickyBombDefault: {
          a: [],
          p: [
            "StickyBombProjectile",
            "StickyBombOverchargedUltiProjectile",
            "StickyBombUltiProjectile",
            "StickyBombOverchargedUltiProjectile",
          ],
          i: ["StickyBomb", "StickyBombUlti"],
        },
        StickyBombVeteran: {
          a: [],
          p: [
            "Squeak002Projectile",
            "StickyBombOverchargedUltiProjectile",
            "Squeak002UltiProjectile",
            "StickyBombOverchargedUltiProjectile",
          ],
          i: ["Sticky002Bomb", "Sticky002BombUlti"],
        },
        StickyBombPotato: {
          a: [],
          p: [
            "Squeak003Projectile",
            "StickyBombOverchargedUltiProjectile",
            "Squeak003UltiProjectile",
            "StickyBombOverchargedUltiProjectile",
          ],
          i: ["Sticky003Bomb", "Sticky003BombUlti"],
        },
        StickyBombGhost: {
          a: [],
          p: [
            "Squeak004Projectile",
            "StickyBombOverchargedUltiProjectile",
            "Squeak004UltiProjectile",
            "StickyBombOverchargedUltiProjectile",
          ],
          i: ["Sticky004Bomb", "Sticky004BombUlti"],
        },
        StickyBombRabbit: {
          a: [],
          p: [
            "Squeak005Projectile",
            "StickyBombOverchargedUltiProjectile",
            "Squeak005UltiProjectile",
            "StickyBombOverchargedUltiProjectile",
          ],
          i: ["Sticky005Bomb", "Sticky005BombUlti"],
        },
        StickyBombGold: {
          a: [],
          p: [
            "StickyBombProjectile",
            "StickyBombOverchargedUltiProjectile",
            "StickyBombUltiProjectile",
            "StickyBombOverchargedUltiProjectile",
          ],
          i: ["StickyBomb", "StickyBombUlti"],
        },
        StickyBombSilver: {
          a: [],
          p: [
            "StickyBombProjectile",
            "StickyBombOverchargedUltiProjectile",
            "StickyBombUltiProjectile",
            "StickyBombOverchargedUltiProjectile",
          ],
          i: ["StickyBomb", "StickyBombUlti"],
        },
        StickyBombUniversity: {
          a: [],
          p: [
            "Squeak006Projectile",
            "StickyBombOverchargedUltiProjectile",
            "Squeak006UltiProjectile",
            "StickyBombOverchargedUltiProjectile",
          ],
          i: ["Sticky006Bomb", "Sticky006BombUlti"],
        },
        StickyBombOffice: {
          a: [],
          p: [
            "StickyBombProjectile",
            "StickyBombOverchargedUltiProjectile",
            "StickyBombUltiProjectile",
            "StickyBombOverchargedUltiProjectile",
          ],
          i: ["StickyBomb", "StickyBombUlti"],
        },
        StickyBombSandsOfTimes: {
          a: [],
          p: [
            "Squeak007Projectile",
            "StickyBombOverchargedUltiProjectile",
            "Squeak007UltiProjectile",
            "StickyBombOverchargedUltiProjectile",
          ],
          i: ["Sticky007Bomb", "Sticky007BombUlti"],
        },
        StickyBombBrawlentine: {
          a: [],
          p: [
            "Squeak008Projectile",
            "StickyBombOverchargedUltiProjectile",
            "Squeak008UltiProjectile",
            "StickyBombOverchargedUltiProjectile",
          ],
          i: ["Sticky008Bomb", "Sticky008BombUlti"],
        },
      },
      CrossBomber: {
        CrossBomberDefault: {
          a: [],
          p: [
            "CrossBomberProjectile",
            "OverchargedCrossBomberUltiProjectile",
            "CrossBomberUltiProjectile",
            "OverchargedCrossBomberUltiProjectile",
          ],
          i: [],
        },
        CrossBomberEaster: {
          a: [],
          p: [
            "Grom002Projectile",
            "OverchargedCrossBomberUltiProjectile",
            "Grom002UltiProjectile",
            "OverchargedCrossBomberUltiProjectile",
          ],
          i: [],
        },
        CrossBomberGold: {
          a: [],
          p: [
            "CrossBomberProjectile",
            "OverchargedCrossBomberUltiProjectile",
            "CrossBomberUltiProjectile",
            "OverchargedCrossBomberUltiProjectile",
          ],
          i: [],
        },
        CrossBomberSilver: {
          a: [],
          p: [
            "CrossBomberProjectile",
            "OverchargedCrossBomberUltiProjectile",
            "CrossBomberUltiProjectile",
            "OverchargedCrossBomberUltiProjectile",
          ],
          i: [],
        },
        CrossBomberFranken: {
          a: [],
          p: [
            "Grom003Projectile",
            "OverchargedCrossBomberUltiProjectile",
            "Grom003UltiProjectile",
            "OverchargedCrossBomberUltiProjectile",
          ],
          i: [],
        },
        CrossBomberHindu: {
          a: [],
          p: [
            "Grom004Projectile",
            "OverchargedCrossBomberUltiProjectile",
            "Grom004UltiProjectile",
            "OverchargedCrossBomberUltiProjectile",
          ],
          i: [],
        },
        CrossBomberSupercellMake: {
          a: [],
          p: [
            "Grom005Projectile",
            "OverchargedCrossBomberUltiProjectile",
            "Grom005UltiProjectile",
            "OverchargedCrossBomberUltiProjectile",
          ],
          i: [],
        },
        CrossBomberRare: {
          a: [],
          p: [
            "CrossBomberProjectile",
            "OverchargedCrossBomberUltiProjectile",
            "CrossBomberUltiProjectile",
            "OverchargedCrossBomberUltiProjectile",
          ],
          i: [],
        },
        CrossBomberDragon: {
          a: [],
          p: [
            "Grom006Projectile",
            "OverchargedCrossBomberUltiProjectile",
            "Grom006UltiProjectile",
            "OverchargedCrossBomberUltiProjectile",
          ],
          i: [],
        },
      },
      RopeDude: {
        RopeDudeDefault: {
          a: [],
          p: [
            "RopeDudeProjectile",
            "RopeDudeOverchargedUltiProjectile",
            "RopeDudeUltiProjectile",
            "RopeDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        RopeDudePunk: {
          a: [],
          p: [
            "Buzz002Projectile",
            "RopeDudeOverchargedUltiProjectile",
            "Buzz002UltiProjectile",
            "RopeDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        RopeDudeDirector: {
          a: [],
          p: [
            "Buzz003Projectile",
            "RopeDudeOverchargedUltiProjectile",
            "Buzz003UltiProjectile",
            "RopeDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        RopeDudeGold: {
          a: [],
          p: [
            "RopeDudeProjectile",
            "RopeDudeOverchargedUltiProjectile",
            "RopeDudeUltiProjectile",
            "RopeDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        RopeDudeSilver: {
          a: [],
          p: [
            "RopeDudeProjectile",
            "RopeDudeOverchargedUltiProjectile",
            "RopeDudeUltiProjectile",
            "RopeDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        RopeDudeLollipop: {
          a: [],
          p: [
            "Buzz005Projectile",
            "RopeDudeOverchargedUltiProjectile",
            "Buzz005UltiProjectile",
            "RopeDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        RopeDudeKaiju: {
          a: [],
          p: [
            "RopeDudeProjectile",
            "RopeDudeOverchargedUltiProjectile",
            "RopeDudeUltiProjectile",
            "RopeDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        RopeDudeFenrir: {
          a: [],
          p: [
            "Buzz006Projectile",
            "RopeDudeOverchargedUltiProjectile",
            "Buzz006UltiProjectile",
            "RopeDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        RopeDudeFenrirRed: {
          a: [],
          p: [
            "Buzz006Projectile",
            "RopeDudeOverchargedUltiProjectile",
            "Buzz006UltiProjectile",
            "RopeDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        RopeDudeFenrirBlack: {
          a: [],
          p: [
            "Buzz006Projectile",
            "RopeDudeOverchargedUltiProjectile",
            "Buzz006UltiProjectile",
            "RopeDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        RopeDudeGodzilla: {
          a: [],
          p: [
            "Buzz007Projectile",
            "Buzz007UltiProjectile",
            "Buzz007OverchargedUltiProjectile",
            "Buzz007OverchargedUltiProjectile",
          ],
          i: [],
        },
        RopeDudeDirector_blue: {
          a: [],
          p: [
            "Buzz003Projectile",
            "RopeDudeOverchargedUltiProjectile",
            "Buzz003UltiProjectile",
            "RopeDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        RopeDudeGodzillaRed: {
          a: [],
          p: [
            "Buzz007Projectile",
            "Buzz007UltiProjectile",
            "Buzz007OverchargedUltiProjectile",
            "Buzz007OverchargedUltiProjectile",
          ],
          i: [],
        },
        RopeDudeGodzillaBlack: {
          a: [],
          p: [
            "Buzz007Projectile",
            "Buzz007UltiProjectile",
            "Buzz007OverchargedUltiProjectile",
            "Buzz007OverchargedUltiProjectile",
          ],
          i: [],
        },
        RopeDudeSB: {
          a: [],
          p: [
            "Buzz008Projectile",
            "RopeDudeOverchargedUltiProjectile",
            "Buzz008UltiProjectile",
            "RopeDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        RopeDudeGoodRandoms: {
          a: [],
          p: [
            "Buzz009Projectile",
            "RopeDudeOverchargedUltiProjectile",
            "Buzz009UltiProjectile",
            "RopeDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
        RopeDudeSpc: {
          a: [],
          p: [
            "Buzz010Projectile",
            "RopeDudeOverchargedUltiProjectile",
            "Buzz010UltiProjectile",
            "RopeDudeOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      AssaultShotgun: {
        AssaultShotgunDefault: {
          a: [],
          p: [
            "AssaultShotgunProjectile",
            "AssaultShotgunOverchargedUltiProjectile",
            "AssaultShotgunUltiProjectile",
            "AssaultShotgunOverchargedUltiProjectile",
          ],
          i: [],
        },
        AssaultShotgunSled: {
          a: [],
          p: [
            "Griff002Projectile",
            "AssaultShotgunOverchargedUltiProjectile",
            "Griff002UltiProjectile",
            "AssaultShotgunOverchargedUltiProjectile",
          ],
          i: [],
        },
        AssaultShotgunGold: {
          a: [],
          p: [
            "AssaultShotgunProjectile",
            "AssaultShotgunOverchargedUltiProjectile",
            "AssaultShotgunUltiProjectile",
            "AssaultShotgunOverchargedUltiProjectile",
          ],
          i: [],
        },
        AssaultShotgunSilver: {
          a: [],
          p: [
            "AssaultShotgunProjectile",
            "AssaultShotgunOverchargedUltiProjectile",
            "AssaultShotgunUltiProjectile",
            "AssaultShotgunOverchargedUltiProjectile",
          ],
          i: [],
        },
        AssaultShotgunArcade: {
          a: [],
          p: [
            "Griff003Projectile",
            "AssaultShotgunOverchargedUltiProjectile",
            "Griff003UltiProjectile",
            "AssaultShotgunOverchargedUltiProjectile",
          ],
          i: [],
        },
        AssaultShotgunTreasure: {
          a: [],
          p: [
            "Griff004Projectile",
            "AssaultShotgunOverchargedUltiProjectile",
            "Griff004UltiProjectile",
            "AssaultShotgunOverchargedUltiProjectile",
          ],
          i: [],
        },
        AssaultShotgunKaiju: {
          a: [],
          p: [
            "Griff005Projectile",
            "AssaultShotgunOverchargedUltiProjectile",
            "Griff005UltiProjectile",
            "AssaultShotgunOverchargedUltiProjectile",
          ],
          i: [],
        },
        AssaultShotgun29gem: {
          a: [],
          p: [
            "AssaultShotgunProjectile",
            "AssaultShotgunOverchargedUltiProjectile",
            "AssaultShotgunUltiProjectile",
            "AssaultShotgunOverchargedUltiProjectile",
          ],
          i: [],
        },
        AssaultShotgunDragon: {
          a: [],
          p: [
            "Griff006Projectile",
            "AssaultShotgunOverchargedUltiProjectile",
            "Griff006UltiProjectile",
            "AssaultShotgunOverchargedUltiProjectile",
          ],
          i: [],
        },
        AssaultShotgunDragonChroma1: {
          a: [],
          p: [
            "Griff006Projectile",
            "AssaultShotgunOverchargedUltiProjectile",
            "Griff006UltiProjectile",
            "AssaultShotgunOverchargedUltiProjectile",
          ],
          i: [],
        },
        AssaultShotgunDragonChroma2: {
          a: [],
          p: [
            "Griff006Projectile",
            "AssaultShotgunOverchargedUltiProjectile",
            "Griff006UltiProjectile",
            "AssaultShotgunOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      Knight: {
        KnightDefault: {
          a: [],
          p: [
            "KnightProjectile1",
            "KnightOverchargedUltiProjectile",
            "KnightUltiProjectile",
            "KnightOverchargedUltiProjectile",
          ],
          i: [],
        },
        KnightNinja: {
          a: [],
          p: [
            "Ash002Projectile1",
            "KnightOverchargedUltiProjectile",
            "Ash002UltiProjectile",
            "KnightOverchargedUltiProjectile",
          ],
          i: [],
        },
        KnightGold: {
          a: [],
          p: [
            "KnightProjectile1",
            "KnightOverchargedUltiProjectile",
            "KnightUltiProjectile",
            "KnightOverchargedUltiProjectile",
          ],
          i: [],
        },
        KnightSilver: {
          a: [],
          p: [
            "KnightProjectile1",
            "KnightOverchargedUltiProjectile",
            "KnightUltiProjectile",
            "KnightOverchargedUltiProjectile",
          ],
          i: [],
        },
        KnightPizza: {
          a: [],
          p: [
            "Ash003Projectile1",
            "KnightOverchargedUltiProjectile",
            "Ash003UltiProjectile",
            "KnightOverchargedUltiProjectile",
          ],
          i: [],
        },
        KnightPinata: {
          a: [],
          p: [
            "Ash005Projectile1",
            "KnightOverchargedUltiProjectile",
            "Ash005UltiProjectile",
            "KnightOverchargedUltiProjectile",
          ],
          i: [],
        },
        KnightKrampus: {
          a: [],
          p: [
            "Ash004Projectile1",
            "KnightOverchargedUltiProjectile",
            "Ash004UltiProjectile",
            "KnightOverchargedUltiProjectile",
          ],
          i: [],
        },
        KnightToon: {
          a: [],
          p: [
            "Ash006Projectile1",
            "KnightOverchargedUltiProjectile",
            "Ash006UltiProjectile",
            "KnightOverchargedUltiProjectile",
          ],
          i: [],
        },
        KnightSupercellStore: {
          a: [],
          p: [
            "Ash007Projectile1",
            "KnightOverchargedUltiProjectile",
            "Ash007UltiProjectile",
            "KnightOverchargedUltiProjectile",
          ],
          i: [],
        },
        KnightRare: {
          a: [],
          p: [
            "KnightProjectile1",
            "KnightOverchargedUltiProjectile",
            "KnightUltiProjectile",
            "KnightOverchargedUltiProjectile",
          ],
          i: [],
        },
        KnightJapan: {
          a: [],
          p: [
            "Ash002Projectile1",
            "KnightOverchargedUltiProjectile",
            "Ash002UltiProjectile",
            "KnightOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      MechaDude: {
        MechaDudeDefault: { a: [], p: ["MechaDudeProjectile", "MechaDudeBigProjectile"], i: [] },
        MechaDudeRhino: { a: [], p: ["Mecha002Projectile", "Mecha002UltiProjectile"], i: [] },
        MechaDudeMonsterTruck: {
          a: [],
          p: ["Mecha003Projectile", "Mecha003UltiProjectile"],
          i: [],
        },
        MechaDudeGold: { a: [], p: ["MechaDudeProjectile", "MechaDudeBigProjectile"], i: [] },
        MechaDudeSilver: { a: [], p: ["MechaDudeProjectile", "MechaDudeBigProjectile"], i: [] },
        MechaDudeJaguar: { a: [], p: ["Mecha004Projectile", "Mecha004UltiProjectile"], i: [] },
        MechaDudePirate: { a: [], p: ["Mecha005Projectile", "Mecha005UltiProjectile"], i: [] },
        MechaDudeRare: { a: [], p: ["MechaDudeProjectile", "MechaDudeBigProjectile"], i: [] },
        MechaDudeAngel: { a: [], p: ["Mecha006Projectile", "Mecha006UltiProjectile"], i: [] },
      },
      KickerDude: {
        KickerDudeDefault: { a: [], p: ["KickerDudeProjectile"], i: [] },
        KickerDudeFurious: { a: [], p: ["KickerDude002Projectile"], i: [] },
        KickerDudeOcto: { a: [], p: ["Fang003Projectile"], i: [] },
        KickerDudeGold: { a: [], p: ["KickerDudeProjectile"], i: [] },
        KickerDudeSilver: { a: [], p: ["KickerDudeProjectile"], i: [] },
        KickerDudeMake: { a: [], p: ["Fang004Projectile"], i: [] },
        KickerDudeFuriousChroma: { a: [], p: ["KickerDude002Projectile"], i: [] },
        KickerDudeBaseballRed: { a: [], p: ["Fang005Projectile"], i: [] },
        KickerDudeBaseballBlue: { a: [], p: ["Fang005Projectile"], i: [] },
        KickerDudeVirus: { a: [], p: ["Fang006Projectile"], i: [] },
        KickerDudeWorldfinal: { a: [], p: ["Fang007Projectile"], i: [] },
        KickerDudeRare: { a: [], p: ["KickerDudeProjectile"], i: [] },
        KickerDudeDemon: { a: [], p: ["Fang008Projectile"], i: [] },
      },
      Flea: {
        FleaDefault: {
          a: [],
          p: [
            "FleaOverchargedSpawnProjectile",
            "FleaUltiProjectile",
            "FleaOverchargedSpawnProjectile",
            "FleaSpawnProjectile",
          ],
          i: [],
        },
        FleaSpaceCactus: {
          a: [],
          p: [
            "Flea002Projectile1",
            "Flea002Projectile2",
            "Flea002Projectile3",
            "FleaSpawnProjectile",
          ],
          i: [],
        },
        FleaGold: {
          a: [],
          p: [
            "FleaOverchargedSpawnProjectile",
            "FleaUltiProjectile",
            "FleaOverchargedSpawnProjectile",
            "FleaSpawnProjectile",
          ],
          i: [],
        },
        FleaSilver: {
          a: [],
          p: [
            "FleaOverchargedSpawnProjectile",
            "FleaUltiProjectile",
            "FleaOverchargedSpawnProjectile",
            "FleaSpawnProjectile",
          ],
          i: [],
        },
        FleaBiker: {
          a: [],
          p: [
            "Flea003Projectile1",
            "Flea003Projectile2",
            "Flea003Projectile3",
            "FleaSpawnProjectile",
          ],
          i: [],
        },
        FleaGodzilla: {
          a: [],
          p: [
            "Flea004Projectile1",
            "Flea004Projectile2",
            "Flea004Projectile3",
            "FleaSpawnProjectile",
          ],
          i: [],
        },
        FleaStarrForce: {
          a: [],
          p: [
            "Flea005Projectile1",
            "Flea005Projectile2",
            "Flea005Projectile3",
            "FleaSpawnProjectile",
          ],
          i: [],
        },
        FleaRare: {
          a: [],
          p: [
            "FleaOverchargedSpawnProjectile",
            "FleaUltiProjectile",
            "FleaOverchargedSpawnProjectile",
            "FleaSpawnProjectile",
          ],
          i: [],
        },
      },
      JetpackGirl: {
        JetpackGirlDefault: {
          a: [],
          p: [
            "JetpackGirlProjectile",
            "JetpackGirlOverchargedUltiProjectile",
            "JetpackGirlUltiProjectile",
            "JetpackGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        JetpackGirlValkyrie: {
          a: [],
          p: [
            "JetpackGirl002Projectile",
            "JetpackGirlOverchargedUltiProjectile",
            "JetpackGirl002UltiProjectile",
            "JetpackGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        JetpackGirlGold: {
          a: [],
          p: [
            "JetpackGirlProjectile",
            "JetpackGirlOverchargedUltiProjectile",
            "JetpackGirlUltiProjectile",
            "JetpackGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        JetpackGirlSilver: {
          a: [],
          p: [
            "JetpackGirlProjectile",
            "JetpackGirlOverchargedUltiProjectile",
            "JetpackGirlUltiProjectile",
            "JetpackGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        JetpackGirlTopgun: {
          a: [],
          p: [
            "JetpackGirlProjectile",
            "JetpackGirlOverchargedUltiProjectile",
            "JetpackGirlUltiProjectile",
            "JetpackGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        JetpackGirlPopstar: {
          a: [],
          p: [
            "JetpackGirl003Projectile",
            "JetpackGirlOverchargedUltiProjectile",
            "JetpackGirl003UltiProjectile",
            "JetpackGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        JetpackGirlDarkFairy: {
          a: [],
          p: [
            "JetpackGirl004Projectile",
            "JetpackGirlOverchargedUltiProjectile",
            "JetpackGirl004UltiProjectile",
            "JetpackGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        JetpackGirlMoon: {
          a: [],
          p: [
            "JetpackGirl005Projectile",
            "JetpackGirlOverchargedUltiProjectile",
            "JetpackGirl005UltiProjectile",
            "JetpackGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        JetpackGirlChristmas: {
          a: [],
          p: [
            "JetpackGirl006Projectile",
            "JetpackGirlOverchargedUltiProjectile",
            "JetpackGirl006UltiProjectile",
            "JetpackGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        JetpackGirlSupercellMake: {
          a: [],
          p: [
            "JetpackGirl007Projectile",
            "JetpackGirlOverchargedUltiProjectile",
            "JetpackGirl007UltiProjectile",
            "JetpackGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
        JetpackGirlSurfer: {
          a: [],
          p: [
            "JetpackGirl008Projectile",
            "JetpackGirlOverchargedUltiProjectile",
            "JetpackGirl008UltiProjectile",
            "JetpackGirlOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      CannonGirl: {
        CannonGirlDefault: {
          a: ["CannonGirlExplosion", "CannonGirlExplosionOvercharged"],
          p: ["CannonGirlProjectile"],
          i: [],
        },
        CannonGirlVillain: {
          a: ["Bonnie002GirlExplosion", "CannonGirlExplosionOvercharged"],
          p: ["Bonnie002Projectile"],
          i: [],
        },
        CannonGirlGold: {
          a: ["CannonGirlExplosion", "CannonGirlExplosionOvercharged"],
          p: ["CannonGirlProjectile"],
          i: [],
        },
        CannonGirlSilver: {
          a: ["CannonGirlExplosion", "CannonGirlExplosionOvercharged"],
          p: ["CannonGirlProjectile"],
          i: [],
        },
        CannonGirlUnicorn: {
          a: ["CannonGirlExplosion", "CannonGirlExplosionOvercharged"],
          p: ["CannonGirlProjectile"],
          i: [],
        },
        CannonGirlSoccer: {
          a: ["CannonGirlExplosion", "CannonGirlExplosionOvercharged"],
          p: ["CannonGirlProjectile"],
          i: [],
        },
        CannonGirlDeepsea: {
          a: ["Bonnie003GirlExplosion", "CannonGirlExplosionOvercharged"],
          p: ["Bonnie003Projectile"],
          i: [],
        },
        CannonGirlChristmas: {
          a: ["Bonnie004GirlExplosion", "CannonGirlExplosionOvercharged"],
          p: ["Bonnie004Projectile"],
          i: [],
        },
        CannonGirlGreekGod: {
          a: ["Bonnie005GirlExplosion", "CannonGirlExplosionOvercharged"],
          p: ["Bonnie005Projectile"],
          i: [],
        },
        CannonGirlFairy: {
          a: ["Bonnie006GirlExplosion", "CannonGirlExplosionOvercharged"],
          p: ["Bonnie006Projectile"],
          i: [],
        },
        CannonGirlFairyChromaBlue: {
          a: ["Bonnie006GirlExplosion", "CannonGirlExplosionOvercharged"],
          p: ["Bonnie006Projectile"],
          i: [],
        },
        CannonGirlFairyChromaPink: {
          a: ["Bonnie006GirlExplosion", "CannonGirlExplosionOvercharged"],
          p: ["Bonnie006Projectile"],
          i: [],
        },
      },
      Silencer: {
        SilencerDefault: {
          a: [],
          p: [
            "SilencerProjectile",
            "SilencerOverchargedUltiProjectile",
            "SilencerUltiProjectile",
            "SilencerOverchargedUltiProjectile",
          ],
          i: ["SilencerHugger", "SilencerHuggerMine"],
        },
        SilencerPharaoh: {
          a: [],
          p: [
            "Otto002Projectile",
            "SilencerOverchargedUltiProjectile",
            "Otto0002UltiProjectile",
            "SilencerOverchargedUltiProjectile",
          ],
          i: ["Otto002Hugger", "Otto002HuggerMine"],
        },
        SilencerGold: {
          a: [],
          p: [
            "SilencerProjectile",
            "SilencerOverchargedUltiProjectile",
            "SilencerUltiProjectile",
            "SilencerOverchargedUltiProjectile",
          ],
          i: ["SilencerHugger", "SilencerHuggerMine"],
        },
        SilencerSilver: {
          a: [],
          p: [
            "SilencerProjectile",
            "SilencerOverchargedUltiProjectile",
            "SilencerUltiProjectile",
            "SilencerOverchargedUltiProjectile",
          ],
          i: ["SilencerHugger", "SilencerHuggerMine"],
        },
        SilencerOni: {
          a: [],
          p: [
            "Otis003Projectile",
            "SilencerOverchargedUltiProjectile",
            "Otis003UltiProjectile",
            "SilencerOverchargedUltiProjectile",
          ],
          i: ["Otis003Hugger", "Otis003HuggerMine"],
        },
        SilencerWorldfinals: {
          a: [],
          p: [
            "Otis004Projectile",
            "SilencerOverchargedUltiProjectile",
            "Otis004UltiProjectile",
            "SilencerOverchargedUltiProjectile",
          ],
          i: ["Otis004Hugger", "Otis004HuggerMine"],
        },
        SilencerDemon: {
          a: [],
          p: [
            "Otis005Projectile",
            "SilencerOverchargedUltiProjectile",
            "Otis005UltiProjectile",
            "SilencerOverchargedUltiProjectile",
          ],
          i: ["Otis005Hugger", "Otis005HuggerMine"],
        },
        SilencerSewer: {
          a: [],
          p: [
            "SilencerProjectile",
            "SilencerOverchargedUltiProjectile",
            "SilencerUltiProjectile",
            "SilencerOverchargedUltiProjectile",
          ],
          i: ["SilencerHugger", "SilencerHuggerMine"],
        },
      },
      WeaponThrower: {
        WeaponThrowerDefault: {
          a: [],
          p: [
            "WeaponThrowerProjectile",
            "WeaponThrowerProjectile2",
            "WeaponThrowerOverchargedUltiProjectile",
            "WeaponThrowerUltiProjectile",
            "WeaponThrowerUltiProjectile2",
            "WeaponThrowerOverchargedUltiProjectile",
          ],
          i: ["WeaponThrowerWeapon"],
        },
        WeaponThrowerEmperor: {
          a: [],
          p: [
            "Bronson002Projectile",
            "Bronson002Projectile2",
            "WeaponThrowerOverchargedUltiProjectile",
            "Bronson002UltiProjectile",
            "Bronson002UltiProjectile2",
            "WeaponThrowerOverchargedUltiProjectile",
          ],
          i: ["Bronson002Weapon"],
        },
        WeaponThrowerYeti: {
          a: [],
          p: [
            "Bronson003Projectile",
            "Bronson003Projectile2",
            "WeaponThrowerOverchargedUltiProjectile",
            "Bronson003UltiProjectile",
            "Bronson003UltiProjectile2",
            "WeaponThrowerOverchargedUltiProjectile",
          ],
          i: ["Bronson003Weapon"],
        },
        WeaponThrowerValentines: {
          a: [],
          p: [
            "WeaponThrowerProjectile",
            "WeaponThrowerProjectile2",
            "WeaponThrowerOverchargedUltiProjectile",
            "WeaponThrowerUltiProjectile",
            "WeaponThrowerUltiProjectile2",
            "WeaponThrowerOverchargedUltiProjectile",
          ],
          i: ["WeaponThrowerWeapon"],
        },
        WeaponThrowerGold: {
          a: [],
          p: [
            "WeaponThrowerProjectile",
            "WeaponThrowerProjectile2",
            "WeaponThrowerOverchargedUltiProjectile",
            "WeaponThrowerUltiProjectile",
            "WeaponThrowerUltiProjectile2",
            "WeaponThrowerOverchargedUltiProjectile",
          ],
          i: ["WeaponThrowerWeapon"],
        },
        WeaponThrowerSilver: {
          a: [],
          p: [
            "WeaponThrowerProjectile",
            "WeaponThrowerProjectile2",
            "WeaponThrowerOverchargedUltiProjectile",
            "WeaponThrowerUltiProjectile",
            "WeaponThrowerUltiProjectile2",
            "WeaponThrowerOverchargedUltiProjectile",
          ],
          i: ["WeaponThrowerWeapon"],
        },
        WeaponThrowerDarkcircus: {
          a: [],
          p: [
            "Bronson004Projectile",
            "Bronson0040Projectile2",
            "WeaponThrowerOverchargedUltiProjectile",
            "Bronson004UltiProjectile",
            "Bronson004UltiProjectile2",
            "WeaponThrowerOverchargedUltiProjectile",
          ],
          i: ["Bronson004Weapon"],
        },
        WeaponThrowerSupercellMake: {
          a: [],
          p: [
            "Bronson005Projectile",
            "Bronson005Projectile2",
            "WeaponThrowerOverchargedUltiProjectile",
            "Bronson005UltiProjectile",
            "Bronson005UltiProjectile2",
            "WeaponThrowerOverchargedUltiProjectile",
          ],
          i: ["Bronson005Weapon"],
        },
        WeaponThrowerSteamPunk: {
          a: [],
          p: [
            "Bronson006Projectile",
            "Bronson006Projectile2",
            "WeaponThrowerOverchargedUltiProjectile",
            "Bronson006UltiProjectile",
            "Bronson006UltiProjectile2",
            "WeaponThrowerOverchargedUltiProjectile",
          ],
          i: ["Bronson006Weapon"],
        },
      },
      SoulCollector: {
        SoulCollectorDefault: {
          a: [],
          p: [
            "SoulCollectorProjectile",
            "GusOverchargedUltiProjectile",
            "SoulCollectorUltiProjectile",
            "GusOverchargedUltiProjectile",
          ],
          i: ["SoulCollectorSoul"],
        },
        SoulCollectorworldfinals: {
          a: [],
          p: [
            "Gus002Projectile",
            "GusOverchargedUltiProjectile",
            "Gus002UltiProjectile",
            "GusOverchargedUltiProjectile",
          ],
          i: ["Gus002Soul"],
        },
        SoulCollectorGold: {
          a: [],
          p: [
            "SoulCollectorProjectile",
            "GusOverchargedUltiProjectile",
            "SoulCollectorUltiProjectile",
            "GusOverchargedUltiProjectile",
          ],
          i: ["SoulCollectorSoul"],
        },
        SoulCollectorSilver: {
          a: [],
          p: [
            "SoulCollectorProjectile",
            "GusOverchargedUltiProjectile",
            "SoulCollectorUltiProjectile",
            "GusOverchargedUltiProjectile",
          ],
          i: ["SoulCollectorSoul"],
        },
        SoulCollectorRare: {
          a: [],
          p: [
            "SoulCollectorProjectile",
            "GusOverchargedUltiProjectile",
            "SoulCollectorUltiProjectile",
            "GusOverchargedUltiProjectile",
          ],
          i: ["SoulCollectorSoul"],
        },
        SoulCollectorSally: {
          a: [],
          p: [
            "Gus003Projectile",
            "GusOverchargedUltiProjectile",
            "Gus003UltiProjectile",
            "GusOverchargedUltiProjectile",
          ],
          i: ["Gus003Soul"],
        },
        SoulCollectorZombie: {
          a: [],
          p: [
            "Gus004Projectile",
            "GusOverchargedUltiProjectile",
            "Gus004UltiProjectile",
            "GusOverchargedUltiProjectile",
          ],
          i: ["Gus004Soul"],
        },
        SoulCollectorDemon: {
          a: [],
          p: [
            "Gus005Projectile",
            "GusOverchargedUltiProjectile",
            "Gus005UltiProjectile",
            "GusOverchargedUltiProjectile",
          ],
          i: ["Gus005Soul"],
        },
        SoulCollectorStrange: {
          a: [],
          p: [
            "Gus006Projectile",
            "GusOverchargedUltiProjectile",
            "Gus006UltiProjectile",
            "GusOverchargedUltiProjectile",
          ],
          i: ["Gus006Soul"],
        },
      },
      ShieldTank: {
        ShieldTankDefault: {
          a: [],
          p: [
            "ShieldTankProjectile",
            "ShieldTankOverchargedUltiProjectile",
            "ShieldTankUltiProjectile",
            "ShieldTankOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShieldTankChainsaw: {
          a: [],
          p: [
            "Buster002Projectile",
            "ShieldTankOverchargedUltiProjectile",
            "Buster002UltiProjectile",
            "ShieldTankOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShieldTankGold: {
          a: [],
          p: [
            "ShieldTankProjectile",
            "ShieldTankOverchargedUltiProjectile",
            "ShieldTankUltiProjectile",
            "ShieldTankOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShieldTankSilver: {
          a: [],
          p: [
            "ShieldTankProjectile",
            "ShieldTankOverchargedUltiProjectile",
            "ShieldTankUltiProjectile",
            "ShieldTankOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShieldTankCroc: {
          a: [],
          p: [
            "Buster003Projectile",
            "ShieldTankOverchargedUltiProjectile",
            "Buster003UltiProjectile",
            "ShieldTankOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShieldTankSupercellMake: {
          a: [],
          p: [
            "Buster004Projectile",
            "ShieldTankOverchargedUltiProjectile",
            "Buster004UltiProjectile",
            "ShieldTankOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShieldTankAngel: {
          a: [],
          p: [
            "Buster005Projectile",
            "ShieldTankOverchargedUltiProjectile",
            "Buster005UltiProjectile",
            "ShieldTankOverchargedUltiProjectile",
          ],
          i: [],
        },
        ShieldTankRare: {
          a: [],
          p: [
            "ShieldTankProjectile",
            "ShieldTankOverchargedUltiProjectile",
            "ShieldTankUltiProjectile",
            "ShieldTankOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      Jester: {
        JesterDefault: {
          a: ["JesterUltiDamageArea"],
          p: [
            "JesterUltiProjectileExploding",
            "JesterUltiProjectileStunning",
            "JesterUltiProjectilePoisoning",
          ],
          i: [],
        },
        JesterGhost: {
          a: ["JesterUltiDamageArea"],
          p: [
            "JesterUltiProjectileExploding",
            "JesterUltiProjectileStunning",
            "JesterUltiProjectilePoisoning",
          ],
          i: [],
        },
        JesterGold: {
          a: ["JesterUltiDamageArea"],
          p: [
            "JesterUltiProjectileExploding",
            "JesterUltiProjectileStunning",
            "JesterUltiProjectilePoisoning",
          ],
          i: [],
        },
        JesterSilver: {
          a: ["JesterUltiDamageArea"],
          p: [
            "JesterUltiProjectileExploding",
            "JesterUltiProjectileStunning",
            "JesterUltiProjectilePoisoning",
          ],
          i: [],
        },
        JesterWoodspirit: {
          a: ["Chester002UltiDamageArea"],
          p: [
            "Chester002Projectile",
            "Chester002ProjectileSP",
            "Chester002UltiProjectileExploding",
          ],
          i: [],
        },
        JesterLoki: {
          a: ["Chester003UltiDamageArea"],
          p: [
            "Chester003Projectile",
            "Chester003ProjectileSP",
            "Chester003UltiProjectileExploding",
          ],
          i: [],
        },
        JesterHarvest: {
          a: ["Chester004UltiDamageArea"],
          p: [
            "Chester004Projectile",
            "Chester004ProjectileSP",
            "Chester004UltiProjectileExploding",
          ],
          i: [],
        },
        JesterUno: {
          a: ["Chester005UltiDamageArea"],
          p: [
            "Chester005Projectile",
            "Chester005ProjectileSP",
            "Chester005UltiProjectileExploding",
          ],
          i: [],
        },
        JesterBrawlAcademy: {
          a: ["Chester006UltiDamageArea"],
          p: [
            "Chester006Projectile",
            "Chester006ProjectileSP",
            "Chester006UltiProjectileExploding",
          ],
          i: [],
        },
      },
      DoorMan: {
        DoorManDefault: { a: [], p: ["DoorManProjectile"], i: ["Portal"] },
        DoorManRunaway: { a: [], p: ["DoorManProjectile"], i: ["Portal"] },
        DoorManDetective: { a: [], p: ["DoorMan002Projectile"], i: ["Portal"] },
        DoorManDoorManDetectiveChroma: { a: [], p: ["DoorMan002Projectile"], i: ["Portal"] },
        DoorManGold: { a: [], p: ["DoorManProjectile"], i: ["Portal"] },
        DoorManSilver: { a: [], p: ["DoorManProjectile"], i: ["Portal"] },
        DoorManStarrForce: { a: [], p: ["DoorMan003Projectile"], i: ["Portal"] },
        DoorManJapan: { a: [], p: ["DoorMan004Projectile"], i: ["Portal"] },
      },
      Beamer: {
        BeamerDefault: { a: [], p: ["BeamerProjectile", "BeamerUltiProjectile"], i: [] },
        BeamerLavaQueen: { a: [], p: ["Beamer002Projectile", "Beamer002UltiProjectile"], i: [] },
        BeamerMC: { a: [], p: ["BeamerProjectile", "BeamerUltiProjectile"], i: [] },
        BeamerGold: { a: [], p: ["BeamerProjectile", "BeamerUltiProjectile"], i: [] },
        BeamerSilver: { a: [], p: ["BeamerProjectile", "BeamerUltiProjectile"], i: [] },
        Beamerharvest: { a: [], p: ["Beamer003Projectile", "Beamer003UltiProjectile"], i: [] },
        BeamerOnceupon: { a: [], p: ["Beamer004Projectile", "Beamer004UltiProjectile"], i: [] },
        BeamerCarnival: { a: [], p: ["Beamer005Projectile", "Beamer005UltiProjectile"], i: [] },
        BeamerSCStore: { a: [], p: ["Beamer006Projectile", "Beamer006UltiProjectile"], i: [] },
        BeamerMecha: { a: [], p: ["Beamer007Projectile", "Beamer007UltiProjectile"], i: [] },
        BeamerMechaYellow: { a: [], p: ["Beamer007Projectile", "Beamer007UltiProjectile"], i: [] },
        BeamerMechaPurple: { a: [], p: ["Beamer007Projectile", "Beamer007UltiProjectile"], i: [] },
      },
      Splitter: {
        SplitterDefault: { a: ["SplitterLegsDamageArea"], p: ["SplitterProjectile"], i: [] },
        SplitterCultist: { a: ["Splitter002LegsDamageArea"], p: ["Splitter002Projectile"], i: [] },
        SplitterPolice: { a: ["SplitterLegsDamageArea"], p: ["SplitterProjectile"], i: [] },
        SplitterGold: { a: ["SplitterLegsDamageArea"], p: ["SplitterProjectile"], i: [] },
        SplitterSilver: { a: ["SplitterLegsDamageArea"], p: ["SplitterProjectile"], i: [] },
        SplitterGreek: { a: ["Splitter004LegsDamageArea"], p: ["Splitter004Projectile"], i: [] },
        SplitterBrawloween: {
          a: ["Splitter005LegsDamageArea"],
          p: ["Splitter005Projectile"],
          i: [],
        },
      },
      Puppeteer: {
        PuppeteerDefault: {
          a: [],
          p: [
            "PuppeteerProjectile",
            "OverchargedPuppeteerUltiProjectile",
            "PuppeteerUltiProjectile",
            "OverchargedPuppeteerUltiProjectile",
          ],
          i: [],
        },
        PuppeteerAxl: {
          a: [],
          p: [
            "PuppeteerProjectile",
            "OverchargedPuppeteerUltiProjectile",
            "PuppeteerUltiProjectile",
            "OverchargedPuppeteerUltiProjectile",
          ],
          i: [],
        },
        PuppeteerWasteland: {
          a: [],
          p: [
            "Puppeteer002Projectile",
            "OverchargedPuppeteerUltiProjectile",
            "Puppeteer002UltiProjectile",
            "OverchargedPuppeteerUltiProjectile",
          ],
          i: [],
        },
        PuppeteerGold: {
          a: [],
          p: [
            "PuppeteerProjectile",
            "OverchargedPuppeteerUltiProjectile",
            "PuppeteerUltiProjectile",
            "OverchargedPuppeteerUltiProjectile",
          ],
          i: [],
        },
        PuppeteerSilver: {
          a: [],
          p: [
            "PuppeteerProjectile",
            "OverchargedPuppeteerUltiProjectile",
            "PuppeteerUltiProjectile",
            "OverchargedPuppeteerUltiProjectile",
          ],
          i: [],
        },
        PuppeteerDemon: {
          a: [],
          p: [
            "Puppeteer003Projectile",
            "OverchargedPuppeteerUltiProjectile",
            "Puppeteer003UltiProjectile",
            "OverchargedPuppeteerUltiProjectile",
          ],
          i: [],
        },
        PuppeteerLNY: {
          a: [],
          p: [
            "Puppeteer004Projectile",
            "OverchargedPuppeteerUltiProjectile",
            "Puppeteer004UltiProjectile",
            "OverchargedPuppeteerUltiProjectile",
          ],
          i: [],
        },
      },
      Maisie: {
        MaisieDefault: {
          a: [
            "MaisieUltiShockwave",
            "MaisieOverchargedUltiShockwave",
            "MaisieOverchargedUltiBulletExplosion",
          ],
          p: ["MaisieProjectile"],
          i: [],
        },
        MaisieMaisieCyber: {
          a: [
            "MaisieUltiShockwave",
            "MaisieOverchargedUltiShockwave",
            "MaisieOverchargedUltiBulletExplosion",
          ],
          p: ["MaisieProjectile"],
          i: [],
        },
        MaisieSnake: {
          a: [
            "Maisie002UltiShockwave",
            "MaisieOverchargedUltiShockwave",
            "MaisieOverchargedUltiBulletExplosion",
          ],
          p: ["Maisie002Projectile"],
          i: [],
        },
        MaisieWasteland: {
          a: [
            "Maisie003UltiShockwave",
            "MaisieOverchargedUltiShockwave",
            "MaisieOverchargedUltiBulletExplosion",
          ],
          p: ["Maisie003Projectile"],
          i: [],
        },
        MaisieGold: {
          a: [
            "MaisieUltiShockwave",
            "MaisieOverchargedUltiShockwave",
            "MaisieOverchargedUltiBulletExplosion",
          ],
          p: ["MaisieProjectile"],
          i: [],
        },
        MaisieSilver: {
          a: [
            "MaisieUltiShockwave",
            "MaisieOverchargedUltiShockwave",
            "MaisieOverchargedUltiBulletExplosion",
          ],
          p: ["MaisieProjectile"],
          i: [],
        },
        MaisieToon: {
          a: [
            "Maisie004UltiShockwave",
            "MaisieOverchargedUltiShockwave",
            "MaisieOverchargedUltiBulletExplosion",
          ],
          p: ["Maisie004Projectile"],
          i: [],
        },
        MaisieToonChroma1: {
          a: [
            "Maisie004UltiShockwave",
            "MaisieOverchargedUltiShockwave",
            "MaisieOverchargedUltiBulletExplosion",
          ],
          p: ["Maisie004Projectile"],
          i: [],
        },
        MaisieToonChroma2: {
          a: [
            "Maisie004UltiShockwave",
            "MaisieOverchargedUltiShockwave",
            "MaisieOverchargedUltiBulletExplosion",
          ],
          p: ["Maisie004Projectile"],
          i: [],
        },
        MaisieDragons: {
          a: [
            "Maisie005UltiShockwave",
            "MaisieOverchargedUltiShockwave",
            "MaisieOverchargedUltiBulletExplosion",
          ],
          p: ["Maisie005Projectile"],
          i: [],
        },
      },
      FishTank: {
        FishTankDefault: {
          a: ["FishTankBlast", "FishTankUltiArea", "FishTankOverchargedAreaEffect"],
          p: [],
          i: [],
        },
        FishTankShark: {
          a: ["FishTankBlast", "FishTankUltiArea", "FishTankOverchargedAreaEffect"],
          p: [],
          i: [],
        },
        FishTankWasteland: {
          a: ["Hank002Blast", "FishTank002UltiArea", "FishTankOverchargedAreaEffect"],
          p: [],
          i: [],
        },
        FishTankHarvest: {
          a: ["Hank003Blast", "FishTank003UltiArea", "FishTankOverchargedAreaEffect"],
          p: [],
          i: [],
        },
        FishTankGold: {
          a: ["FishTankBlast", "FishTankUltiArea", "FishTankOverchargedAreaEffect"],
          p: [],
          i: [],
        },
        FishTankSilver: {
          a: ["FishTankBlast", "FishTankUltiArea", "FishTankOverchargedAreaEffect"],
          p: [],
          i: [],
        },
        FishTankSurfer: {
          a: ["Hank004Blast", "FishTank004UltiArea", "FishTankOverchargedAreaEffect"],
          p: [],
          i: [],
        },
      },
      Duelist: {
        DuelistDefault: {
          a: [],
          p: [
            "DuelistProjectile",
            "DuelistOverchargedUltiProjectile",
            "DuelistUltiProjectile",
            "DuelistOverchargedUltiProjectile",
          ],
          i: [],
        },
        DuelistToxic: {
          a: [],
          p: [
            "DuelistProjectile",
            "DuelistOverchargedUltiProjectile",
            "DuelistUltiProjectile",
            "DuelistOverchargedUltiProjectile",
          ],
          i: [],
        },
        DuelistBrain: {
          a: [],
          p: [
            "Cordelius002Projectile",
            "DuelistOverchargedUltiProjectile",
            "Cordelius002UltiProjectile",
            "DuelistOverchargedUltiProjectile",
          ],
          i: [],
        },
        DuelistWasteland: {
          a: [],
          p: [
            "Cordelius003Projectile",
            "DuelistOverchargedUltiProjectile",
            "Cordelius003UltiProjectile",
            "DuelistOverchargedUltiProjectile",
          ],
          i: [],
        },
        DuelistOdin: {
          a: [],
          p: [
            "Cordelius004Projectile",
            "DuelistOverchargedUltiProjectile",
            "Cordelius004UltiProjectile",
            "DuelistOverchargedUltiProjectile",
          ],
          i: [],
        },
        DuelistGold: {
          a: [],
          p: [
            "DuelistProjectile",
            "DuelistOverchargedUltiProjectile",
            "DuelistUltiProjectile",
            "DuelistOverchargedUltiProjectile",
          ],
          i: [],
        },
        DuelistSilver: {
          a: [],
          p: [
            "DuelistProjectile",
            "DuelistOverchargedUltiProjectile",
            "DuelistUltiProjectile",
            "DuelistOverchargedUltiProjectile",
          ],
          i: [],
        },
        DuelistToon: {
          a: [],
          p: [
            "Cordelius005Projectile",
            "DuelistOverchargedUltiProjectile",
            "Cordelius005UltiProjectile",
            "DuelistOverchargedUltiProjectile",
          ],
          i: [],
        },
        DuelistSandsOfTime: {
          a: [],
          p: [
            "Cordelius006Projectile",
            "DuelistOverchargedUltiProjectile",
            "Cordelius006UltiProjectile",
            "DuelistOverchargedUltiProjectile",
          ],
          i: [],
        },
        DuelistSandsOfTimeChroma1: {
          a: [],
          p: [
            "Cordelius006Projectile",
            "DuelistOverchargedUltiProjectile",
            "Cordelius006UltiProjectile",
            "DuelistOverchargedUltiProjectile",
          ],
          i: [],
        },
        DuelistSandsOfTimeChroma2: {
          a: [],
          p: [
            "Cordelius006Projectile",
            "DuelistOverchargedUltiProjectile",
            "Cordelius006UltiProjectile",
            "DuelistOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      Reviver: {
        ReviverDefault: {
          a: ["ReviverDamageArea"],
          p: [
            "ReviverOverchargedUltiProjectile",
            "ReviverUltiProjectile",
            "ReviverOverchargedUltiProjectile",
          ],
          i: [],
        },
        ReviverDraco: {
          a: ["ReviverDamageArea"],
          p: [
            "ReviverOverchargedUltiProjectile",
            "ReviverUltiProjectile",
            "ReviverOverchargedUltiProjectile",
          ],
          i: [],
        },
        ReviverGold: {
          a: ["ReviverDamageArea"],
          p: [
            "ReviverOverchargedUltiProjectile",
            "ReviverUltiProjectile",
            "ReviverOverchargedUltiProjectile",
          ],
          i: [],
        },
        ReviverSilver: {
          a: ["ReviverDamageArea"],
          p: [
            "ReviverOverchargedUltiProjectile",
            "ReviverUltiProjectile",
            "ReviverOverchargedUltiProjectile",
          ],
          i: [],
        },
        ReviverPirate: {
          a: ["Reviver002DamageArea"],
          p: [
            "ReviverOverchargedUltiProjectile",
            "Reviver002UltiProjectile",
            "ReviverOverchargedUltiProjectile",
          ],
          i: [],
        },
        ReviverFantasy: {
          a: ["Reviver003DamageArea"],
          p: [
            "ReviverOverchargedUltiProjectile",
            "Reviver003UltiProjectile",
            "ReviverOverchargedUltiProjectile",
          ],
          i: [],
        },
        ReviverSandsOfTime: {
          a: ["Reviver004DamageArea"],
          p: [
            "ReviverOverchargedUltiProjectile",
            "Reviver004UltiProjectile",
            "ReviverOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      Cooker: {
        CookerDefault: {
          a: ["CookerUltiExplosion", "CookerOverchargedUltiExplosion", "CookerOverchargedUltiArea"],
          p: ["CookerProjectile"],
          i: [],
        },
        CookerRare: {
          a: ["CookerUltiExplosion", "CookerOverchargedUltiExplosion", "CookerOverchargedUltiArea"],
          p: ["CookerProjectile"],
          i: [],
        },
        CookerDeepsea: {
          a: [
            "Pearl002UltiExplosion",
            "CookerOverchargedUltiExplosion",
            "CookerOverchargedUltiArea",
          ],
          p: ["Pearl002Projectile"],
          i: [],
        },
        CookerGold: {
          a: ["CookerUltiExplosion", "CookerOverchargedUltiExplosion", "CookerOverchargedUltiArea"],
          p: ["CookerProjectile"],
          i: [],
        },
        CookerSilver: {
          a: ["CookerUltiExplosion", "CookerOverchargedUltiExplosion", "CookerOverchargedUltiArea"],
          p: ["CookerProjectile"],
          i: [],
        },
        CookerOnceupon: {
          a: [
            "Pearl003UltiExplosion",
            "CookerOverchargedUltiExplosion",
            "CookerOverchargedUltiArea",
          ],
          p: ["Pearl003Projectile"],
          i: [],
        },
        CookerPorcelain: {
          a: [
            "Pearl004UltiExplosion_k2",
            "CookerOverchargedUltiExplosion",
            "CookerOverchargedUltiArea",
          ],
          p: ["Pearl004Projectile_k2"],
          i: [],
        },
      },
      Conductor: {
        ConductorDefault: {
          a: [],
          p: ["ConductorProjectile", "ConductorUltiProjectile"],
          i: ["ConductorSign"],
        },
        ConductorRare: {
          a: [],
          p: ["ConductorProjectile", "ConductorUltiProjectile"],
          i: ["ConductorSign"],
        },
        ConductorScorpion: {
          a: [],
          p: ["Conductor002Projectile", "Conductor002UltiProjectile"],
          i: ["Conductor002Sign"],
        },
        ConductorGold: {
          a: [],
          p: ["ConductorProjectile", "ConductorUltiProjectile"],
          i: ["ConductorSign"],
        },
        ConductorSilver: {
          a: [],
          p: ["ConductorProjectile", "ConductorUltiProjectile"],
          i: ["ConductorSign"],
        },
        ConductorSupercellMake: {
          a: [],
          p: ["Conductor003Projectile", "Conductor003UltiProjectile"],
          i: ["Conductor003Sign"],
        },
      },
      Cocooner: {
        CocoonerDefault: {
          a: [],
          p: [
            "CocoonerProjectile",
            "CocoonerOverchargedUltiProjectile",
            "CocoonerUltiProjectile",
            "CocoonerOverchargedUltiProjectile",
          ],
          i: [],
        },
        CocoonerRosie: {
          a: [],
          p: [
            "Cocooner002Projectile",
            "CocoonerOverchargedUltiProjectile",
            "Cocooner002UltiProjectile",
            "CocoonerOverchargedUltiProjectile",
          ],
          i: [],
        },
        CocoonerRare: {
          a: [],
          p: [
            "CocoonerProjectile",
            "CocoonerOverchargedUltiProjectile",
            "CocoonerUltiProjectile",
            "CocoonerOverchargedUltiProjectile",
          ],
          i: [],
        },
        CocoonerVirus: {
          a: [],
          p: [
            "Cocooner003Projectile",
            "CocoonerOverchargedUltiProjectile",
            "Cocooner003UltiProjectile",
            "CocoonerOverchargedUltiProjectile",
          ],
          i: [],
        },
        CocoonerGold: {
          a: [],
          p: [
            "CocoonerProjectile",
            "CocoonerOverchargedUltiProjectile",
            "CocoonerUltiProjectile",
            "CocoonerOverchargedUltiProjectile",
          ],
          i: [],
        },
        CocoonerSilver: {
          a: [],
          p: [
            "CocoonerProjectile",
            "CocoonerOverchargedUltiProjectile",
            "CocoonerUltiProjectile",
            "CocoonerOverchargedUltiProjectile",
          ],
          i: [],
        },
        CocoonerGym: {
          a: [],
          p: [
            "Cocooner004Projectile",
            "CocoonerOverchargedUltiProjectile",
            "Cocooner004UltiProjectile",
            "CocoonerOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      Leaper: {
        LeaperDefault: {
          a: ["LeaperWeaponArea", "LeaperUltiArea", "LeaperOverchargedUltiArea"],
          p: [],
          i: [],
        },
        Leaperwukong: {
          a: ["Mico_002_WeaponArea", "Mico_002_UltiArea", "LeaperOverchargedUltiArea"],
          p: [],
          i: [],
        },
        LeaperRare: {
          a: ["LeaperWeaponArea", "LeaperUltiArea", "LeaperOverchargedUltiArea"],
          p: [],
          i: [],
        },
        LeaperDarkXmas: {
          a: ["Leaper003WeaponArea", "Leaper003UltiArea", "LeaperOverchargedUltiArea"],
          p: [],
          i: [],
        },
        LeaperGold: {
          a: ["LeaperWeaponArea", "LeaperUltiArea", "LeaperOverchargedUltiArea"],
          p: [],
          i: [],
        },
        LeaperSilver: {
          a: ["LeaperWeaponArea", "LeaperUltiArea", "LeaperOverchargedUltiArea"],
          p: [],
          i: [],
        },
        LeaperKaiju: {
          a: ["Leaper004WeaponArea", "Leaper004UltiArea", "LeaperOverchargedUltiArea"],
          p: [],
          i: [],
        },
      },
      Attacher: {
        AttacherDefault: { a: [], p: ["AttacherProjectile"], i: [] },
        AttacherBoxer: { a: [], p: ["Attacher002Projectile"], i: [] },
        AttacherRare: { a: [], p: ["AttacherProjectile"], i: [] },
        AttacherBoxerChromaGoldpaw: { a: [], p: ["Attacher002Projectile"], i: [] },
        AttacherBoxerChromaDarkpaw: { a: [], p: ["Attacher002Projectile"], i: [] },
        AttacherGold: { a: [], p: ["AttacherProjectile"], i: [] },
        AttacherSilver: { a: [], p: ["AttacherProjectile"], i: [] },
        AttacherOnceupon: { a: [], p: ["Attacher003Projectile"], i: [] },
        AttacherToy: { a: [], p: ["Attacher004Projectile"], i: [] },
        AttacherRareChroma1: { a: [], p: ["AttacherProjectile"], i: [] },
        AttacherRareChroma2: { a: [], p: ["AttacherProjectile"], i: [] },
        AttacherRareChroma3: { a: [], p: ["AttacherProjectile"], i: [] },
        AttacherRareChroma4: { a: [], p: ["AttacherProjectile"], i: [] },
        AttacherRareChroma5: { a: [], p: ["AttacherProjectile"], i: [] },
        AttacherRareChroma6: { a: [], p: ["AttacherProjectile"], i: [] },
      },
      Twins: {
        TwinsDefault: {
          a: [],
          p: ["TwinsThrowerProjectile", "TwinsShotgunProjectile", "TwinsUltiProjectile"],
          i: [],
        },
        TwinsRare: {
          a: [],
          p: ["TwinsThrowerProjectile", "TwinsShotgunProjectile", "TwinsUltiProjectile"],
          i: [],
        },
        TwinsVirus: {
          a: [],
          p: ["Twins002ThrowerProjectile", "Twins002ShotgunProjectile", "Twins002UltiProjectile"],
          i: [],
        },
        TwinsGold: {
          a: [],
          p: ["TwinsThrowerProjectile", "TwinsShotgunProjectile", "TwinsUltiProjectile"],
          i: [],
        },
        TwinsSilver: {
          a: [],
          p: ["TwinsThrowerProjectile", "TwinsShotgunProjectile", "TwinsUltiProjectile"],
          i: [],
        },
        TwinsAngel: {
          a: [],
          p: ["Twins003ThrowerProjectile", "Twins003ShotgunProjectile", "Twins003UltiProjectile"],
          i: [],
        },
        TwinsAngelChroma1: {
          a: [],
          p: ["Twins003ThrowerProjectile", "Twins003ShotgunProjectile", "Twins003UltiProjectile"],
          i: [],
        },
        TwinsAngelChroma2: {
          a: [],
          p: ["Twins003ThrowerProjectile", "Twins003ShotgunProjectile", "Twins003UltiProjectile"],
          i: [],
        },
        TwinsSandsOfTime: {
          a: [],
          p: ["Twins004ThrowerProjectile", "Twins004ShotgunProjectile", "Twins004UltiProjectile"],
          i: [],
        },
      },
      AxeJuggler: {
        AxeJugglerDefault: { a: [], p: ["AxeJugglerProjectile"], i: [] },
        AxeJugglerRare: { a: [], p: ["AxeJugglerProjectile"], i: [] },
        AxeJugglerGreek: { a: [], p: ["AxeJuggler002Projectile"], i: [] },
        AxeJugglerGold: { a: [], p: ["AxeJugglerProjectile"], i: [] },
        AxeJugglerSilver: { a: [], p: ["AxeJugglerProjectile"], i: [] },
        AxeJugglerGoodRandoms: { a: [], p: ["AxeJuggler003Projectile"], i: [] },
        AxeJugglerGoodRandomsChroma1: { a: [], p: ["AxeJuggler003Projectile"], i: [] },
        AxeJugglerGoodRandomsChroma2: { a: [], p: ["AxeJuggler003Projectile"], i: [] },
        AxeJugglerGym: { a: [], p: ["AxeJuggler004Projectile"], i: [] },
        AxeJugglerAprilFools: { a: [], p: ["AxeJuggler005Projectile"], i: [] },
      },
      InsectMan: {
        InsectManDefault: {
          a: [
            "InsectManUltiDamageArea",
            "InsectManUltiSwitchSkillArea",
            "InsectManOverchargedUltiDamageArea",
            "InsectManOverchargedUltiSwitchSkillArea",
          ],
          p: ["MosquitoProjectile", "MosquitoProjectilePoison"],
          i: ["PiperdefBomb"],
        },
        InsectManRare: {
          a: [
            "InsectManUltiDamageArea",
            "InsectManUltiSwitchSkillArea",
            "InsectManOverchargedUltiDamageArea",
            "InsectManOverchargedUltiSwitchSkillArea",
          ],
          p: ["MosquitoProjectile", "MosquitoProjectilePoison"],
          i: ["PiperdefBomb"],
        },
        InsectManGreek: {
          a: [
            "Angelo002UltiDamageArea",
            "Angelo002UltiSwitchSkillArea",
            "InsectManOverchargedUltiDamageArea",
            "InsectManOverchargedUltiSwitchSkillArea",
          ],
          p: ["Angelo002Projectile", "Angelo002ProjectilePoison"],
          i: ["PiperdefBomb"],
        },
        InsectManGold: {
          a: [
            "InsectManUltiDamageArea",
            "InsectManUltiSwitchSkillArea",
            "InsectManOverchargedUltiDamageArea",
            "InsectManOverchargedUltiSwitchSkillArea",
          ],
          p: ["MosquitoProjectile", "MosquitoProjectilePoison"],
          i: ["PiperdefBomb"],
        },
        InsectManSilver: {
          a: [
            "InsectManUltiDamageArea",
            "InsectManUltiSwitchSkillArea",
            "InsectManOverchargedUltiDamageArea",
            "InsectManOverchargedUltiSwitchSkillArea",
          ],
          p: ["MosquitoProjectile", "MosquitoProjectilePoison"],
          i: ["PiperdefBomb"],
        },
        InsectManJapan: {
          a: [
            "Angelo003UltiDamageArea",
            "Angelo003UltiSwitchSkillArea",
            "InsectManOverchargedUltiDamageArea",
            "InsectManOverchargedUltiSwitchSkillArea",
          ],
          p: ["Angelo003Projectile", "Angelo003ProjectilePoison"],
          i: ["PiperdefBomb"],
        },
        InsectManBrawlentine: {
          a: [
            "Angelo004UltiDamageArea",
            "Angelo004UltiSwitchSkillArea",
            "InsectManOverchargedUltiDamageArea",
            "InsectManOverchargedUltiSwitchSkillArea",
          ],
          p: ["Angelo004Projectile", "Angelo004ProjectilePoison"],
          i: ["PiperdefBomb"],
        },
        InsectManBrawlentineChroma1: {
          a: [
            "Angelo004UltiDamageArea",
            "Angelo004UltiSwitchSkillArea",
            "InsectManOverchargedUltiDamageArea",
            "InsectManOverchargedUltiSwitchSkillArea",
          ],
          p: ["Angelo004Projectile", "Angelo004ProjectilePoison"],
          i: ["PiperdefBomb"],
        },
        InsectManBrawlentineChroma2: {
          a: [
            "Angelo004UltiDamageArea",
            "Angelo004UltiSwitchSkillArea",
            "InsectManOverchargedUltiDamageArea",
            "InsectManOverchargedUltiSwitchSkillArea",
          ],
          p: ["Angelo004Projectile", "Angelo004ProjectilePoison"],
          i: ["PiperdefBomb"],
        },
      },
      DragonRider: {
        DragonRiderDefault: { a: [], p: ["DragonRiderProjectile"], i: [] },
        DragonRiderRare: { a: [], p: ["DragonRiderProjectile"], i: [] },
        DragonRiderGold: { a: [], p: ["DragonRiderProjectile"], i: [] },
        DragonRiderSilver: { a: [], p: ["DragonRiderProjectile"], i: [] },
        DragonRiderOnceupon: { a: [], p: ["DragonRider002Projectile"], i: [] },
        DragonRiderStrange: { a: [], p: ["DragonRider003Projectile"], i: [] },
      },
      Ambusher: {
        AmbusherDefault: {
          a: [],
          p: [
            "AmbusherProjectile",
            "AmbusherOverchargedUltiProjectile",
            "AmbusherUltiProjectile",
            "AmbusherOverchargedUltiProjectile",
          ],
          i: [],
        },
        AmbusherRare: {
          a: [],
          p: [
            "AmbusherProjectile",
            "AmbusherOverchargedUltiProjectile",
            "AmbusherUltiProjectile",
            "AmbusherOverchargedUltiProjectile",
          ],
          i: [],
        },
        AmbusherGold: {
          a: [],
          p: [
            "AmbusherProjectile",
            "AmbusherOverchargedUltiProjectile",
            "AmbusherUltiProjectile",
            "AmbusherOverchargedUltiProjectile",
          ],
          i: [],
        },
        AmbusherSilver: {
          a: [],
          p: [
            "AmbusherProjectile",
            "AmbusherOverchargedUltiProjectile",
            "AmbusherUltiProjectile",
            "AmbusherOverchargedUltiProjectile",
          ],
          i: [],
        },
        AmbusherAngel: {
          a: [],
          p: [
            "Ambusher002Projectile",
            "Ambusher002UltiProjectile",
            "Ambusher002UltiProjectile2",
            "Ambusher002UltiProjectile2",
          ],
          i: [],
        },
        AmbusherFantasy: {
          a: [],
          p: [
            "Ambusher003Projectile",
            "Ambusher003UltiProjectile",
            "Ambusher003UltiProjectile2",
            "Ambusher003UltiProjectile2",
          ],
          i: [],
        },
        AmbusherSandsOfTime: {
          a: [],
          p: [
            "Ambusher004UltiProjectile",
            "Ambusher004UltiProjectile2",
            "Ambusher004Projectile",
            "Ambusher004Projectile",
          ],
          i: [],
        },
        AmbusherSandsOfTimeChromaGreen: {
          a: [],
          p: [
            "Ambusher004UltiProjectile",
            "Ambusher004UltiProjectile2",
            "Ambusher004Projectile",
            "Ambusher004Projectile",
          ],
          i: [],
        },
        AmbusherSandsOfTimeChromaRed: {
          a: [],
          p: [
            "Ambusher004UltiProjectile",
            "Ambusher004UltiProjectile2",
            "Ambusher004Projectile",
            "Ambusher004Projectile",
          ],
          i: [],
        },
      },
      Painter: {
        PainterDefault: {
          a: ["PainterAreaEffect", "PainterAreaEffectOvercharged"],
          p: ["PainterProjectile"],
          i: [],
        },
        PainterRare: {
          a: ["PainterAreaEffect", "PainterAreaEffectOvercharged"],
          p: ["PainterProjectile"],
          i: [],
        },
        PainterGold: {
          a: ["PainterAreaEffect", "PainterAreaEffectOvercharged"],
          p: ["PainterProjectile"],
          i: [],
        },
        PainterSilver: {
          a: ["PainterAreaEffect", "PainterAreaEffectOvercharged"],
          p: ["PainterProjectile"],
          i: [],
        },
        PainterStarrForce: {
          a: ["Painter002AreaEffect", "PainterAreaEffectOvercharged"],
          p: ["Painter002Projectile"],
          i: [],
        },
        PainterGreekGod: {
          a: ["Painter003AreaEffect", "PainterAreaEffectOvercharged"],
          p: ["Painter003Projectile"],
          i: [],
        },
        PainterStrange: {
          a: ["Painter004AreaEffect", "PainterAreaEffectOvercharged"],
          p: ["Painter004Projectile"],
          i: [],
        },
      },
      Crab: {
        CrabDefault: {
          a: [],
          p: [
            "CrabProjectile",
            "CrabOverchargedUltiProjectile",
            "CrabUltiProjectile",
            "CrabOverchargedUltiProjectile",
          ],
          i: [],
        },
        CrabRare: {
          a: [],
          p: [
            "CrabProjectile",
            "CrabOverchargedUltiProjectile",
            "CrabUltiProjectile",
            "CrabOverchargedUltiProjectile",
          ],
          i: [],
        },
        CrabGold: {
          a: [],
          p: [
            "CrabProjectile",
            "CrabOverchargedUltiProjectile",
            "CrabUltiProjectile",
            "CrabOverchargedUltiProjectile",
          ],
          i: [],
        },
        CrabSilver: {
          a: [],
          p: [
            "CrabProjectile",
            "CrabOverchargedUltiProjectile",
            "CrabUltiProjectile",
            "CrabOverchargedUltiProjectile",
          ],
          i: [],
        },
        CrabKaiju: {
          a: [],
          p: [
            "Crab002Projectile",
            "CrabOverchargedUltiProjectile",
            "Crab002UltiProjectile",
            "CrabOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      Digger: {
        DiggerDefault: {
          a: [
            "DiggerDrillDive",
            "DiggerDrillSurface",
            "DiggerOverchargedDrillDive",
            "DiggerOverchargedDrillSurface",
            "DiggerDrillTrail",
          ],
          p: ["DiggerProjectile"],
          i: [],
        },
        DiggerRare: {
          a: [
            "DiggerDrillDive",
            "DiggerDrillSurface",
            "DiggerOverchargedDrillDive",
            "DiggerOverchargedDrillSurface",
            "DiggerDrillTrail",
          ],
          p: ["DiggerProjectile"],
          i: [],
        },
        DiggerGold: {
          a: [
            "DiggerDrillDive",
            "DiggerDrillSurface",
            "DiggerOverchargedDrillDive",
            "DiggerOverchargedDrillSurface",
            "DiggerDrillTrail",
          ],
          p: ["DiggerProjectile"],
          i: [],
        },
        DiggerSilver: {
          a: [
            "DiggerDrillDive",
            "DiggerDrillSurface",
            "DiggerOverchargedDrillDive",
            "DiggerOverchargedDrillSurface",
            "DiggerDrillTrail",
          ],
          p: ["DiggerProjectile"],
          i: [],
        },
        DiggerStarrForce: {
          a: [
            "Digger002DrillDive",
            "Digger002DrillSurface",
            "DiggerOverchargedDrillDive",
            "DiggerOverchargedDrillSurface",
            "Digger002DrillTrail",
          ],
          p: ["Digger002Projectile"],
          i: [],
        },
      },
      Samurai: {
        SamuraiDefault: {
          a: [],
          p: [
            "SamuraiOverchargedUltiProjectile",
            "SamuraiUltiProjectile",
            "SamuraiOverchargedUltiProjectile",
          ],
          i: [],
        },
        SamuraiRare: {
          a: [],
          p: [
            "SamuraiOverchargedUltiProjectile",
            "SamuraiUltiProjectile",
            "SamuraiOverchargedUltiProjectile",
          ],
          i: [],
        },
        SamuraiGold: {
          a: [],
          p: [
            "SamuraiOverchargedUltiProjectile",
            "SamuraiUltiProjectile",
            "SamuraiOverchargedUltiProjectile",
          ],
          i: [],
        },
        SamuraiSilver: {
          a: [],
          p: [
            "SamuraiOverchargedUltiProjectile",
            "SamuraiUltiProjectile",
            "SamuraiOverchargedUltiProjectile",
          ],
          i: [],
        },
        SamuraiStarrForce: {
          a: [],
          p: [
            "SamuraiOverchargedUltiProjectile",
            "Samurai002UltiProjectile",
            "SamuraiOverchargedUltiProjectile",
          ],
          i: [],
        },
        SamuraiStarrForceChroma1: {
          a: [],
          p: [
            "SamuraiOverchargedUltiProjectile",
            "Samurai002UltiProjectile",
            "SamuraiOverchargedUltiProjectile",
          ],
          i: [],
        },
        SamuraiStarrForceChroma2: {
          a: [],
          p: [
            "SamuraiOverchargedUltiProjectile",
            "Samurai002UltiProjectile",
            "SamuraiOverchargedUltiProjectile",
          ],
          i: [],
        },
        SamuraiJapan: {
          a: [],
          p: [
            "SamuraiOverchargedUltiProjectile",
            "Samurai003UltiProjectile",
            "SamuraiOverchargedUltiProjectile",
          ],
          i: [],
        },
        SamuraiJapanOvercharge: {
          a: [],
          p: [
            "Samurai003UltiProjectile",
            "Samurai003OverchargedUltiProjectile",
            "Samurai003OverchargedUltiProjectile",
          ],
          i: [],
        },
        SamuraiJapanOverchargeChroma1: {
          a: [],
          p: [
            "Samurai003UltiProjectile",
            "Samurai003OverchargedUltiProjectile",
            "Samurai003OverchargedUltiProjectile",
          ],
          i: [],
        },
        SamuraiJapanOverchargeChroma2: {
          a: [],
          p: [
            "Samurai003UltiProjectile",
            "Samurai003OverchargedUltiProjectile",
            "Samurai003OverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      Ghost: {
        GhostDefault: { a: [], p: [], i: [] },
        GhostSwag: { a: [], p: [], i: [] },
        GhostGold: { a: [], p: [], i: [] },
        GhostSilver: { a: [], p: [], i: [] },
        GhostGraffiti: { a: [], p: [], i: [] },
        GhostBrawlentine: { a: [], p: [], i: [] },
      },
      Voodoo: {
        VoodooDefault: {
          a: [],
          p: [
            "VoodooProjectileEarth",
            "VoodooOverchargedUltiProjectile",
            "VoodooUltiProjectile",
            "VoodooOverchargedUltiProjectile",
          ],
          i: [],
        },
        VoodooRare: {
          a: [],
          p: [
            "VoodooProjectileEarth",
            "VoodooOverchargedUltiProjectile",
            "VoodooUltiProjectile",
            "VoodooOverchargedUltiProjectile",
          ],
          i: [],
        },
        VoodooSandsOfTimes: {
          a: [],
          p: [
            "Voodoo002ProjectileEarth",
            "Voodoo002ProjectileForest",
            "Voodoo002ProjectileWater",
            "Voodoo002UltiProjectile",
          ],
          i: [],
        },
        VoodooGold: {
          a: [],
          p: [
            "VoodooProjectileEarth",
            "VoodooOverchargedUltiProjectile",
            "VoodooUltiProjectile",
            "VoodooOverchargedUltiProjectile",
          ],
          i: [],
        },
        VoodooSilver: {
          a: [],
          p: [
            "VoodooProjectileEarth",
            "VoodooOverchargedUltiProjectile",
            "VoodooUltiProjectile",
            "VoodooOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      Meeple: {
        MeepleDefault: {
          a: [],
          p: [
            "MeepleProjectile",
            "MeepleOverchargedUltiProjectile",
            "MeepleUltiProjectile",
            "MeepleOverchargedUltiProjectile",
          ],
          i: ["PiperdefBomb"],
        },
        MeepleBowling: {
          a: [],
          p: [
            "MeepleProjectile",
            "MeepleOverchargedUltiProjectile",
            "MeepleUltiProjectile",
            "MeepleOverchargedUltiProjectile",
          ],
          i: ["PiperdefBomb"],
        },
        MeepleSandsOfTimes: {
          a: [],
          p: [
            "Meeple002Projectile",
            "Meeple002UltiProjectile",
            "Meeple002WallProjectile",
            "Meeple002WallProjectile",
          ],
          i: ["PiperdefBomb"],
        },
        MeepleGold: {
          a: [],
          p: [
            "MeepleProjectile",
            "MeepleOverchargedUltiProjectile",
            "MeepleUltiProjectile",
            "MeepleOverchargedUltiProjectile",
          ],
          i: ["PiperdefBomb"],
        },
        MeepleSilver: {
          a: [],
          p: [
            "MeepleProjectile",
            "MeepleOverchargedUltiProjectile",
            "MeepleUltiProjectile",
            "MeepleOverchargedUltiProjectile",
          ],
          i: ["PiperdefBomb"],
        },
      },
      Skater: {
        SkaterDefault: {
          a: ["SkaterUltiLanding", "SkaterUltiLandingOvercharged"],
          p: ["SkaterProjectile"],
          i: [],
        },
        SkaterRapper: {
          a: ["SkaterUltiLanding", "SkaterUltiLandingOvercharged"],
          p: ["SkaterProjectile"],
          i: [],
        },
        SkaterSandsOfTimes: {
          a: ["Skater002UltiLanding", "SkaterUltiLandingOvercharged"],
          p: ["Skater002Projectile"],
          i: [],
        },
        SkaterGold: {
          a: ["SkaterUltiLanding", "SkaterUltiLandingOvercharged"],
          p: ["SkaterProjectile"],
          i: [],
        },
        SkaterSilver: {
          a: ["SkaterUltiLanding", "SkaterUltiLandingOvercharged"],
          p: ["SkaterProjectile"],
          i: [],
        },
        SkaterSurfer: {
          a: ["Skater003UltiLanding", "SkaterUltiLandingOvercharged"],
          p: ["Skater003Projectile"],
          i: [],
        },
      },
      Morningstar: {
        MorningstarDefault: {
          a: [],
          p: ["MorningstarProjectile"],
          i: ["MorningstarGroundedWeapon"],
        },
        MorningstarRare: { a: [], p: ["MorningstarProjectile"], i: ["MorningstarGroundedWeapon"] },
        MorningstarGold: { a: [], p: ["MorningstarProjectile"], i: ["MorningstarGroundedWeapon"] },
        MorningstarSilver: {
          a: [],
          p: ["MorningstarProjectile"],
          i: ["MorningstarGroundedWeapon"],
        },
        MorningstarGreekGod: {
          a: [],
          p: ["Morningstar002Projectile"],
          i: ["Morningstar002GroundedWeapon"],
        },
        MorningstarStrange: {
          a: [],
          p: ["Morningstar003Projectile"],
          i: ["Morningstar003GroundedWeapon"],
        },
        MorningstarStrangeChromaPink: {
          a: [],
          p: ["Morningstar003Projectile"],
          i: ["Morningstar003GroundedWeapon"],
        },
        MorningstarStrangeChromaRed: {
          a: [],
          p: ["Morningstar003Projectile"],
          i: ["Morningstar003GroundedWeapon"],
        },
      },
      Chronomancer: {
        ChronomancerDefault: {
          a: ["ChronomancerOverchargedUltiTimebend", "ChronomanceUltiDurationIncreasePulse"],
          p: [
            "ChronomancerUltiHyperProjectile",
            "ChronomancerUltiProjectile",
            "ChronomancerUltiHyperProjectile",
          ],
          i: [],
        },
        ChronomancerRare: {
          a: ["ChronomancerOverchargedUltiTimebend", "ChronomanceUltiDurationIncreasePulse"],
          p: [
            "ChronomancerUltiHyperProjectile",
            "ChronomancerUltiProjectile",
            "ChronomancerUltiHyperProjectile",
          ],
          i: [],
        },
        ChronomancerKaiju: {
          a: ["ChronomancerOverchargedUltiTimebend", "Chronomance002UltiDurationIncreasePulse"],
          p: [
            "Chronomancer002Projectile",
            "Chronomancer002ProjectileSecondary",
            "Chronomancer002UltiProjectile",
          ],
          i: [],
        },
        ChronomancerKaijuChromaWhite: {
          a: ["ChronomancerOverchargedUltiTimebend", "Chronomance002UltiDurationIncreasePulse"],
          p: [
            "Chronomancer002Projectile",
            "Chronomancer002ProjectileSecondary",
            "Chronomancer002UltiProjectile",
          ],
          i: [],
        },
        ChronomancerKaijuChromaGreen: {
          a: ["ChronomancerOverchargedUltiTimebend", "Chronomance002UltiDurationIncreasePulse"],
          p: [
            "Chronomancer002Projectile",
            "Chronomancer002ProjectileSecondary",
            "Chronomancer002UltiProjectile",
          ],
          i: [],
        },
        ChronomancerGold: {
          a: ["ChronomancerOverchargedUltiTimebend", "ChronomanceUltiDurationIncreasePulse"],
          p: [
            "ChronomancerUltiHyperProjectile",
            "ChronomancerUltiProjectile",
            "ChronomancerUltiHyperProjectile",
          ],
          i: [],
        },
        ChronomancerSilver: {
          a: ["ChronomancerOverchargedUltiTimebend", "ChronomanceUltiDurationIncreasePulse"],
          p: [
            "ChronomancerUltiHyperProjectile",
            "ChronomancerUltiProjectile",
            "ChronomancerUltiHyperProjectile",
          ],
          i: [],
        },
      },
      Alternator: {
        AlternatorDefault: {
          a: ["AlternatorHealAura", "AlternatorHealAuraOvercharged"],
          p: ["AlternatorSpeedProjectile"],
          i: [],
        },
        Alternator29gem: {
          a: ["AlternatorHealAura", "AlternatorHealAuraOvercharged"],
          p: ["AlternatorSpeedProjectile"],
          i: [],
        },
        AlternatorGold: {
          a: ["AlternatorHealAura", "AlternatorHealAuraOvercharged"],
          p: ["AlternatorSpeedProjectile"],
          i: [],
        },
        AlternatorSilver: {
          a: ["AlternatorHealAura", "AlternatorHealAuraOvercharged"],
          p: ["AlternatorSpeedProjectile"],
          i: [],
        },
      },
      Geisha: {
        GeishaDefault: {
          a: ["GeishaWeakSpotAttack"],
          p: [
            "GeishaUltiProjectileOvercharged",
            "GeishaUltiProjectile",
            "GeishaUltiProjectileOvercharged",
          ],
          i: [],
        },
        GeishaRare: {
          a: ["GeishaWeakSpotAttack"],
          p: [
            "GeishaUltiProjectileOvercharged",
            "GeishaUltiProjectile",
            "GeishaUltiProjectileOvercharged",
          ],
          i: [],
        },
        GeishaGold: {
          a: ["GeishaWeakSpotAttack"],
          p: [
            "GeishaUltiProjectileOvercharged",
            "GeishaUltiProjectile",
            "GeishaUltiProjectileOvercharged",
          ],
          i: [],
        },
        GeishaSilver: {
          a: ["GeishaWeakSpotAttack"],
          p: [
            "GeishaUltiProjectileOvercharged",
            "GeishaUltiProjectile",
            "GeishaUltiProjectileOvercharged",
          ],
          i: [],
        },
        GeishaSteamPunk: {
          a: ["GeishaWeakSpotAttack"],
          p: [
            "GeishaUltiProjectileOvercharged",
            "Geisha002UltiProjectile",
            "GeishaUltiProjectileOvercharged",
          ],
          i: [],
        },
      },
      Stalker: {
        StalkerDefault: { a: ["StalkerWeaponJumpArea"], p: [], i: [] },
        StalkerRare: { a: ["StalkerWeaponJumpArea"], p: [], i: [] },
        StalkerGold: { a: ["StalkerWeaponJumpArea"], p: [], i: [] },
        StalkerSilver: { a: ["StalkerWeaponJumpArea"], p: [], i: [] },
        StalkerGraffitiSpecial: { a: ["StalkerWeaponJumpArea"], p: [], i: [] },
        StalkerBrawlentine: { a: ["Stalker002WeaponJumpArea"], p: [], i: [] },
      },
      Domain: {
        DomainDefault: {
          a: ["DomainDamageArea", "DomainDamageWarningArea", "DomainDamageWarningArea"],
          p: [],
          i: [],
        },
        DomainRare: {
          a: ["DomainDamageArea", "DomainDamageWarningArea", "DomainDamageWarningArea"],
          p: [],
          i: [],
        },
        DomainGold: {
          a: ["DomainDamageArea", "DomainDamageWarningArea", "DomainDamageWarningArea"],
          p: [],
          i: [],
        },
        DomainSilver: {
          a: ["DomainDamageArea", "DomainDamageWarningArea", "DomainDamageWarningArea"],
          p: [],
          i: [],
        },
        DomainSupercellStore: {
          a: ["Domain002DamageArea", "DomainDamageWarningArea", "Domain002DamageWarningArea"],
          p: [],
          i: [],
        },
      },
      Dancer: {
        DancerDefault: { a: [], p: ["DancerProjectileSingle", "DancerProjectileUlti"], i: [] },
        DancerGraffitiSpecial: {
          a: [],
          p: ["DancerProjectileSingle", "DancerProjectileUlti"],
          i: [],
        },
        Dancer199Gem: {
          a: [],
          p: ["Dancer002ProjectileSingle", "Dancer002ProjectileDouble"],
          i: [],
        },
        Dancer199GemChroma1: {
          a: [],
          p: ["Dancer002ProjectileSingle", "Dancer002ProjectileDouble"],
          i: [],
        },
        Dancer199GemChroma2: {
          a: [],
          p: ["Dancer002ProjectileSingle", "Dancer002ProjectileDouble"],
          i: [],
        },
        DancerGold: { a: [], p: ["DancerProjectileSingle", "DancerProjectileUlti"], i: [] },
        DancerSilver: { a: [], p: ["DancerProjectileSingle", "DancerProjectileUlti"], i: [] },
        DancerFairies: {
          a: [],
          p: ["Dancer003ProjectileSingle", "Dancer003ProjectileDouble"],
          i: [],
        },
      },
      Fury: {
        FuryDefault: {
          a: [],
          p: [
            "FuryProjectile",
            "FuryOverchargedUltiProjectile",
            "FuryUltiProjectile",
            "FuryOverchargedUltiProjectile",
          ],
          i: [],
        },
        Fury199Gem: {
          a: [],
          p: [
            "Fury002Projectile",
            "FuryOverchargedUltiProjectile",
            "Fury002UltiProjectile",
            "FuryOverchargedUltiProjectile",
          ],
          i: [],
        },
        Fury199GemChroma1: {
          a: [],
          p: [
            "Fury002Projectile",
            "FuryOverchargedUltiProjectile",
            "Fury002UltiProjectile",
            "FuryOverchargedUltiProjectile",
          ],
          i: [],
        },
        Fury199GemChroma2: {
          a: [],
          p: [
            "Fury002Projectile",
            "FuryOverchargedUltiProjectile",
            "Fury002UltiProjectile",
            "FuryOverchargedUltiProjectile",
          ],
          i: [],
        },
        FuryGold: {
          a: [],
          p: [
            "FuryProjectile",
            "FuryOverchargedUltiProjectile",
            "FuryUltiProjectile",
            "FuryOverchargedUltiProjectile",
          ],
          i: [],
        },
        FurySilver: {
          a: [],
          p: [
            "FuryProjectile",
            "FuryOverchargedUltiProjectile",
            "FuryUltiProjectile",
            "FuryOverchargedUltiProjectile",
          ],
          i: [],
        },
      },
      Bulletstorm: {
        BulletstormDefault: {
          a: [],
          p: [
            "BulletstormProjectile",
            "BulletstormUltiOverchargedProjectile",
            "BulletstormUltiProjectile",
            "BulletstormUltiOverchargedProjectile",
          ],
          i: ["BulletstormShell"],
        },
        Bulletstorm199Gem: {
          a: [],
          p: [
            "Bulletstorm002Projectile",
            "Bulletstorm002UltiProjectile",
            "Bulletstorm002LastShotProjectile",
            "Bulletstorm002UltiMarkedProjectile",
          ],
          i: ["Bulletstorm002Shell"],
        },
        Bulletstorm199GemChroma1: {
          a: [],
          p: [
            "Bulletstorm002Projectile",
            "Bulletstorm002UltiProjectile",
            "Bulletstorm002LastShotProjectile",
            "Bulletstorm002UltiMarkedProjectile",
          ],
          i: ["Bulletstorm002Shell"],
        },
        Bulletstorm199GemChroma2: {
          a: [],
          p: [
            "Bulletstorm002Projectile",
            "Bulletstorm002UltiProjectile",
            "Bulletstorm002LastShotProjectile",
            "Bulletstorm002UltiMarkedProjectile",
          ],
          i: ["Bulletstorm002Shell"],
        },
        BulletstormGold: {
          a: [],
          p: [
            "BulletstormProjectile",
            "BulletstormUltiOverchargedProjectile",
            "BulletstormUltiProjectile",
            "BulletstormUltiOverchargedProjectile",
          ],
          i: ["BulletstormShell"],
        },
        BulletstormSilver: {
          a: [],
          p: [
            "BulletstormProjectile",
            "BulletstormUltiOverchargedProjectile",
            "BulletstormUltiProjectile",
            "BulletstormUltiOverchargedProjectile",
          ],
          i: ["BulletstormShell"],
        },
      },
      Daredevil: {
        DaredevilDefault: {
          a: [
            "DaredevilDamageArea",
            "DaredevilUltiNoDamageLeave",
            "DaredevilUltiNoDamageEnter",
            "DaredevilUltiNoDamageLeave",
            "DaredevilOverchargedUltiDamage",
          ],
          p: [],
          i: [],
        },
        DaredevilScarecrow: {
          a: [
            "Daredevil002DamageArea",
            "Daredevil002UltiNoDamageLeave",
            "Daredevil002UltiNoDamageEnter",
            "DaredevilUltiNoDamageLeave",
            "DaredevilOverchargedUltiDamage",
          ],
          p: [],
          i: [],
        },
        DaredevilScarecrow199GemChroma1: {
          a: [
            "Daredevil002DamageArea",
            "Daredevil002UltiNoDamageLeave",
            "Daredevil002UltiNoDamageEnter",
            "DaredevilUltiNoDamageLeave",
            "DaredevilOverchargedUltiDamage",
          ],
          p: [],
          i: [],
        },
        DaredevilScarecrow199GemChroma2: {
          a: [
            "Daredevil002DamageArea",
            "Daredevil002UltiNoDamageLeave",
            "Daredevil002UltiNoDamageEnter",
            "DaredevilUltiNoDamageLeave",
            "DaredevilOverchargedUltiDamage",
          ],
          p: [],
          i: [],
        },
        DaredevilGold: {
          a: [
            "DaredevilDamageArea",
            "DaredevilUltiNoDamageLeave",
            "DaredevilUltiNoDamageEnter",
            "DaredevilUltiNoDamageLeave",
            "DaredevilOverchargedUltiDamage",
          ],
          p: [],
          i: [],
        },
        DaredevilSilver: {
          a: [
            "DaredevilDamageArea",
            "DaredevilUltiNoDamageLeave",
            "DaredevilUltiNoDamageEnter",
            "DaredevilUltiNoDamageLeave",
            "DaredevilOverchargedUltiDamage",
          ],
          p: [],
          i: [],
        },
      },
      Mender: {
        MenderDefault: {
          a: [],
          p: [
            "MenderProjectile",
            "MenderUltiOverchargedProjectile",
            "MenderUltiProjectile",
            "MenderUltiOverchargedProjectile",
          ],
          i: [],
        },
        MenderGold: {
          a: [],
          p: [
            "MenderProjectile",
            "MenderUltiOverchargedProjectile",
            "MenderUltiProjectile",
            "MenderUltiOverchargedProjectile",
          ],
          i: [],
        },
        MenderSilver: {
          a: [],
          p: [
            "MenderProjectile",
            "MenderUltiOverchargedProjectile",
            "MenderUltiProjectile",
            "MenderUltiOverchargedProjectile",
          ],
          i: [],
        },
        Mender199Gem: {
          a: [],
          p: [
            "Mender002Projectile",
            "MenderUltiOverchargedProjectile",
            "Mender002UltiProjectile",
            "MenderUltiOverchargedProjectile",
          ],
          i: [],
        },
      },
      Shadowdemon: { ShadowdemonDefault: { a: [], p: ["ShadowdemonUltiProjectile"], i: [] } },
      Redirecter: {
        RedirecterDefault: {
          a: [],
          p: ["RedirecterProjectile", "RedirecterUltiProjectile"],
          i: [],
        },
      },
    };
    Libc_1.Libc.unlink(Memory.allocUtf8String(temporaryConfigPath));
    Outline_1.Outline.init();
  }

  static reset(_listener, buttonIndex) {
    if (buttonIndex !== 0) {
      this.config = Object.assign({}, this.configStatic);
      FileManager_1.FileManager.updateConfigFile();
      Libc_1.Libc.kill(Libc_1.Libc.getpid(), 15);
    }
  }
}

exports.Config = d;
d.useDebugLoggingVersions = ["dev", "integration", "beta"];
d.useDebugLogging = d.useDebugLoggingVersions.includes(ModProperties_1.ModProperties.environment);
d.isRussian = false;
d.resetNativeDialogListener = new INativeDialogListener_1.INativeDialogListener(d.reset.bind(d));
d.config = {};
d.configStatic = {
  FPSLimit: -1,
  ThemeBackgroundID: -1,
  ThemeMusicID: -1,
  AntiAfkKick: false,
  AttackRangeIndicator: false,
  DevModeEnabled: false,
  ShowDebugMenuButton: false,
  DebugMenuButtonWarningShown: false,
  AutoPlayAgain: false,
  BackgroundMatchmaking: false,
  BSDProxy: false,
  BattleEndInstantExit: true,
  BattleTextChat: false,
  BetterRange: false,
  ChromaticName: false,
  ColoredDamage: true,
  DisablePinAnimation: false,
  DisableShake: false,
  DoNotShowBattleHighlight: false,
  EnemyTracer: false,
  EnforceBattleChatButton: true,
  EnforceOldFriendsList: false,
  ExtendedTrajectory: false,
  HitboxRenderer: false,
  TileGrid: false,
  FriendListOptimization: false,
  DisableSkins: false,
  DefaultEnvironments: false,
  HideBattleBlackBars: true,
  HideBattlingStatusFromOthers: false,
  HideHomeScreenText: false,
  HideSuperAim: true,
  HighlightLeonClone: false,
  InstantStarrDropOpening: false,
  LegacyBackgrounds: false,
  LegacyNames: false,
  OldGlowbertName: false,
  ShamePlayersWithThumbsdownPin: false,
  SharedBackground: false,
  ShowAutoPlayAgainRadioButton: false,
  ShowBattleCameraButton: false,
  ShowSpectateButton: false,
  ShowBattleConnectionIndicator: false,
  ShowDPS: false,
  ShowCharactersInNames: false,
  ShowEnemyAmmoStatus: true,
  ShowTrophiesAboveHead: true,
  ShowFPSCounter: false,
  ShowFastPlayAgainButton: true,
  ShowFriendlyRoomOpponents: true,
  ShowFriendsInBattle: false,
  ShowAllianceMembersInBattle: false,
  ShowLaserLogs: true,
  ShowMuteButton: false,
  ShowOwnPlayerCoordinates: false,
  ShowSkinNamesInProfile: true,
  AllyRespawnTimer: true,
  TeammateHPIndicator: false,
  SlowMode: false,
  SoundMuted: false,
  TeamChatAnticensor: false,
  UseLowResGraphics: false,
  GfxQualityLevel: 3,
  MemQualityLevel: 3,
  WasBattleServerChanged: false,
  WasProxyReset: false,
  LocationThemeOverrides: {},
  SkinOverrides: {},
  CustomMods: [],
  BSDPlusKeys: [],
  OutlineColor: [0, 0, 0, 100],
  RandomLocalization: false,
  ShowTidKeys: false,
  RandomThemeMask: [false, false, false],
  PlayerNameOverride: "",
  CustomThemeName: "",
  FogType: "",
  KillEffectType: "",
  ParticleAnimationDisabled: false,
  ParticleFileName: "",
  ParticleExportName: "",
  ParticleStyle: "",
  ParticleCount: 200,
  ParticleScale: 100,
  ParticleSpeed: 500,
  UseBattleProxy: false,
  RegionId: -1,
  Font: -1,
};
d.PatchNotes = {
  "66.263-1": { EN: "Update!", RU: "Обновление!" },
};
d.updatedItems = [];
