// @ts-nocheck
const { Libg } = require("../../../../lib/Libg");
const { CustomModNames } = require("../../../../suitcase/config/ModProperties");
const { FileManager } = require("../../../../suitcase/filesystem/FileManager");
const { StringObject } = require("../../../titan/client/native/StringObject");

const resourcePathAddress = Libg.offset(11315696, 7783960);
const isDarwin = Process.platform === "darwin";
const resourcePathCallers = isDarwin
  ? [Libg.offset(0, 9760184), Libg.offset(0, 9760452), Libg.offset(0, 9760488)]
  : null;

class LogicDataTableResource {
  static patch() {
    const patchDirectory = "bsd/mods/BSDCsvPatches/";
    const patchedResources = new Set([
      "csv_logic/themes.csv",
      "csv_client/effects.csv",
      "csv_client/music.csv",
    ]);
    CustomModNames.oldRankMod;

    Interceptor.attach(resourcePathAddress, {
      onLeave(retval) {
        if (
          resourcePathCallers &&
          !resourcePathCallers.some((address) => address.equals(this.returnAddress))
        )
          return;

        const resource = StringObject.read(retval);
        if (patchedResources.has(resource)) {
          const contents = FileManager.readAAsset(patchDirectory + resource, "r");
          if (contents && contents.length !== 0) {
            retval.replace(StringObject.create(patchDirectory + resource));
          }
        }
      },
    });
  }
}

exports.LogicDataTableResource = LogicDataTableResource;
