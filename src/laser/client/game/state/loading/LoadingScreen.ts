// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Libc } = require("../../../../../lib/Libc");
const { DownloadManager } = require("../../network/DownloadManager");
const { MessageManager, MessageManager_update } = require("../../network/MessageManager");
const {
  NativeHTTPClientManager,
} = require("../../../../titan/client/common/http/NativeHTTPClientManager");
const { SafeJNI } = require("../../../../titan/client/application/SafeJNI");
const { GameMain } = require("../../../GameMain");
const { Logcat } = require("../../../../../suitcase/debug/Logcat");
const { Breadcrumbs } = require("../../../../../suitcase/debug/Breadcrumbs");
const { GameStateManager_changeToStateOffset } = require("../GameStateManager");

const loadingScreenInstance = Libg.offset(19849552, 18156496);
const contentUpdateStartedAddress = Libg.offset(10253780, 9630936);
const ContentUpdateScreen_update = Libg.offset(10250088, 9628060);
const contentUpdateScreenCtor = Libg.offset(10248636, 9626844);

const stateManagerPendingStateOffset = 8;
const screenStateOffset = 72;
const screenForcedStateOffset = 76;
const screenQueueOffset = 80;
const screenProgressOffset = 84;
const screenVectorOffset = 88;
const screenVectorEndOffset = 120;
const currentScreenOffset = 8;
const currentScreenType = 2;
const contentUpdatePendingState = 4;
const forcedContentUpdateState = 2;
const taskSize = 16;
const taskStateOffset = 4;
const taskPendingState = 1;
const taskDownloadedState = 0;
const queueCountOffset = 32;
const queueCapacityOffset = 36;
const queueVectorOffset = 40;
const queueSecondaryVectorOffset = 56;

class LoadingScreen {
  static patch() {
    DownloadManager.init();
    this.needsDownload = !DownloadManager.downloadingFinished;
    Logcat.logDebug(
      "LoadingScreen: ".concat(
        DownloadManager.downloadedAssets,
        "/",
        DownloadManager.DOWNLOAD_ASSETS.length,
        " cached, needsDownload=",
        this.needsDownload,
      ),
    );
    if (!this.needsDownload) return;

    this.noopCallback = new NativeCallback(() => {}, "void", ["pointer"]);
    this.fakeVtable = Libc.malloc(64);
    for (let i = 0; i < 8; i++) this.fakeVtable.add(8 * i).writePointer(this.noopCallback);

    Interceptor.attach(GameStateManager_changeToStateOffset, {
      onEnter(args) {
        if (LoadingScreen.needsDownload) {
          const manager = args[0];
          if (manager.add(stateManagerPendingStateOffset).readS32() === contentUpdatePendingState) {
            Logcat.logDebug(
              "LoadingScreen: forcing ContentUpdateScreen via manager pending-state field",
            );
            manager.add(stateManagerPendingStateOffset).writeS32(forcedContentUpdateState);
          }
        }
      },
    });

    const contentUpdateStarted = new NativeFunction(contentUpdateStartedAddress, "void", [
      "pointer",
      "pointer",
    ]);
    Interceptor.replace(
      contentUpdateStartedAddress,
      new NativeCallback(
        (self, value) => {
          if (LoadingScreen.needsDownload) {
            self.add(screenStateOffset).writeS32(forcedContentUpdateState);
            Logcat.logDebug("LoadingScreen: content_update_started replaced (no-op)");
            return;
          }
          contentUpdateStarted(self, value);
        },
        "void",
        ["pointer", "pointer"],
      ),
    );

    Interceptor.attach(ContentUpdateScreen_update, {
      onEnter(args) {
        this.needsRestore = false;
        if (LoadingScreen.needsDownload) {
          const screen = args[0];
          if (screen.add(screenStateOffset).readS32() >= contentUpdatePendingState) {
            screen.add(screenForcedStateOffset).writeS32(forcedContentUpdateState);
            this.savedQueue = screen.add(screenQueueOffset).readPointer();
            screen.add(screenQueueOffset).writePointer(NULL);
            this.self = screen;
            this.needsRestore = true;
          }
        }
      },
      onLeave() {
        if (this.needsRestore) this.self.add(screenQueueOffset).writePointer(this.savedQueue);
      },
    });

    Interceptor.attach(contentUpdateScreenCtor, {
      onEnter(args) {
        const screen = args[0];
        const queue = screen.add(screenQueueOffset).readPointer();
        if (LoadingScreen.fakeQueue && !queue.isNull() && queue.equals(LoadingScreen.fakeQueue)) {
          screen.add(screenQueueOffset).writePointer(NULL);
          screen.add(screenVectorOffset).writePointer(NULL);
          screen.add(screenVectorEndOffset).writePointer(NULL);
        }
      },
    });

    Interceptor.attach(MessageManager_update, {
      onEnter() {
        if (
          LoadingScreen.needsDownload &&
          !LoadingScreen.downloadsStarted &&
          LoadingScreen.loginOk &&
          SafeJNI.isAvailable()
        ) {
          LoadingScreen.downloadsStarted = true;
          Logcat.logDebug("LoadingScreen: starting downloads");
          DownloadManager.startDownloads();
        }
        if (NativeHTTPClientManager.pendingDownloads.length > 0 && SafeJNI.isAvailable()) {
          const downloads = NativeHTTPClientManager.pendingDownloads.splice(0);
          for (const download of downloads) {
            NativeHTTPClientManager.nativeHTTPGetRequest(
              download.hostName,
              download.callback,
              download.fileSavePath,
            );
          }
        }
      },
    });
  }

  static onLoginResponse(type) {
    if (type === 20103) {
      Logcat.logDebug("LoadingScreen: 20103 — letting game update, skipping mod downloads");
      this.nullFakeQueueOnScreen();
      this.needsDownload = false;
      this.modPhaseActive = false;
      this.loginOk = false;
      this.downloadsStarted = false;
      return;
    }
    if (type === 20104) {
      if (DownloadManager.downloadingFinished) return;
      Logcat.logDebug("LoadingScreen: 20104 — enabling downloads");
      this.needsDownload = true;
      this.loginOk = true;
      this.downloadsStarted = false;
    }
  }

  static update() {
    if (!this.needsDownload) return;
    if (DownloadManager.downloadingFinished) {
      this.needsDownload = false;
      this.modPhaseActive = false;
      Logcat.logDebug("LoadingScreen: downloads complete, reloading");
      GameMain.reloadGame();
      return;
    }

    const screen = this.getCurrentScreen();
    if (!screen) return;
    if (!this.modPhaseActive) {
      this.modPhaseActive = true;
      Breadcrumbs.push("LoadingScreen: holding for mod downloads");
    }
    if (screen.add(screenStateOffset).readS32() >= contentUpdatePendingState) {
      screen.add(screenForcedStateOffset).writeS32(forcedContentUpdateState);
      this.ensureFakeQueue(screen);
      if (this.fakeQueue && this.fakeTasks) {
        const total = DownloadManager.DOWNLOAD_ASSETS.length;
        const downloaded = DownloadManager.downloadedAssets;
        this.fakeQueue.add(screenProgressOffset).writeS32(total - downloaded);
        for (let i = 0; i < total; i++) {
          this.fakeTasks
            .add(i * taskSize + taskStateOffset)
            .writeS32(i < downloaded ? taskDownloadedState : taskPendingState);
        }
      }
    }
  }

  static getCurrentScreen() {
    const loading = loadingScreenInstance.readPointer();
    if (loading.isNull()) return null;
    const screen = loading.add(currentScreenOffset).readPointer();
    if (screen.isNull() || screen.add(currentScreenOffset).readS32() !== currentScreenType)
      return null;
    return screen;
  }

  static ensureFakeQueue(screen) {
    const count = DownloadManager.DOWNLOAD_ASSETS.length;
    if (this.fakeQueue) {
      screen.add(screenQueueOffset).writePointer(this.fakeQueue);
      screen.add(screenVectorOffset).writePointer(this.fakeVectorBase);
      screen.add(screenVectorEndOffset).writePointer(this.fakeVectorBase.add(taskSize * count));
      return;
    }

    const tasks = Libc.malloc(taskSize * count);
    for (let offset = 0; offset < taskSize * count; offset += 8) tasks.add(offset).writeU64(0);
    for (let i = 0; i < count; i++)
      tasks.add(i * taskSize + taskStateOffset).writeS32(taskPendingState);
    this.fakeTasks = tasks;

    const taskVector = Libc.malloc(taskSize * count);
    for (let i = 0; i < count; i++) {
      taskVector.add(taskSize * i).writeU64(0);
      taskVector.add(taskSize * i + 8).writePointer(tasks.add(i * taskSize));
    }

    const secondaryVector = Libc.malloc(16);
    secondaryVector.writeU64(0);
    secondaryVector.add(8).writeU64(0);

    const queue = Libc.malloc(128);
    for (let offset = 0; offset < 128; offset += 8) queue.add(offset).writeU64(0);
    queue.writePointer(this.fakeVtable);
    queue.add(queueCountOffset).writeS32(count);
    queue.add(queueCapacityOffset).writeS32(count);
    queue.add(queueVectorOffset).writePointer(taskVector);
    queue.add(queueSecondaryVectorOffset).writePointer(secondaryVector);
    this.fakeQueue = queue;
    screen.add(screenQueueOffset).writePointer(queue);

    const vectorSize = taskSize * count;
    const vectorBase = Libc.malloc(vectorSize);
    for (let offset = 0; offset < vectorSize; offset += 8) vectorBase.add(offset).writeU64(0);
    this.fakeVectorBase = vectorBase;
    screen.add(screenVectorOffset).writePointer(vectorBase);
    screen.add(screenVectorEndOffset).writePointer(vectorBase.add(vectorSize));
  }

  static nullFakeQueueOnScreen() {
    const screen = this.getCurrentScreen();
    if (!screen || !this.fakeQueue) return;
    const queue = screen.add(screenQueueOffset).readPointer();
    if (!queue.isNull() && queue.equals(this.fakeQueue)) {
      screen.add(screenQueueOffset).writePointer(NULL);
      screen.add(screenVectorOffset).writePointer(NULL);
      screen.add(screenVectorEndOffset).writePointer(NULL);
    }
  }

  static get isActive() {
    return this.modPhaseActive;
  }
  static get progress() {
    const total = DownloadManager.DOWNLOAD_ASSETS.length;
    if (total === 0) return 100;
    return Math.floor((DownloadManager.downloadedAssets / total) * 100);
  }
}

LoadingScreen.needsDownload = false;
LoadingScreen.downloadsStarted = false;
LoadingScreen.loginOk = false;
LoadingScreen.modPhaseActive = false;
LoadingScreen.fakeQueue = null;
LoadingScreen.fakeTasks = null;
LoadingScreen.fakeVectorBase = null;
LoadingScreen.noopCallback = null;
LoadingScreen.fakeVtable = null;

exports.ContentUpdateScreen_update = ContentUpdateScreen_update;
exports.LoadingScreen = LoadingScreen;
