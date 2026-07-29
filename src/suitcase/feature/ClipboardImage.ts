// @ts-nocheck
const { Libc } = require("../../lib/Libc");
const JNI_VERSION_1_6 = 0x10006,
  JNI_GET_ENV = 6,
  JNI_FIND_CLASS = 6,
  JNI_GET_STATIC_METHOD_ID = 113,
  JNI_CALL_STATIC_OBJECT_METHOD = 116;
const JNI_GET_METHOD_ID = 33,
  JNI_CALL_OBJECT_METHOD = 36,
  JNI_CALL_INT_METHOD = 51,
  JNI_CALL_VOID_METHOD = 63;
const JNI_DELETE_LOCAL_REF = 23,
  JNI_NEW_STRING_UTF = 167,
  JNI_EXCEPTION_CHECK = 228;
class ClipboardImage {
  static readImageTo(path) {
    const env = this.getEnv();
    if (!env || env.isNull()) return false;
    const fn = (index, result, args) =>
      new NativeFunction(
        env
          .readPointer()
          .add(index * Process.pointerSize)
          .readPointer(),
        result,
        args,
      );
    const findClass = fn(JNI_FIND_CLASS, "pointer", ["pointer", "pointer"]),
      getStaticMethod = fn(JNI_GET_STATIC_METHOD_ID, "pointer", [
        "pointer",
        "pointer",
        "pointer",
        "pointer",
      ]);
    const callStaticObject = fn(JNI_CALL_STATIC_OBJECT_METHOD, "pointer", [
        "pointer",
        "pointer",
        "pointer",
        "pointer",
      ]),
      getMethod = fn(JNI_GET_METHOD_ID, "pointer", ["pointer", "pointer", "pointer", "pointer"]);
    const callObject = fn(JNI_CALL_OBJECT_METHOD, "pointer", [
        "pointer",
        "pointer",
        "pointer",
        "pointer",
      ]),
      callInt = fn(JNI_CALL_INT_METHOD, "int", ["pointer", "pointer", "pointer", "pointer"]);
    const callVoid = fn(JNI_CALL_VOID_METHOD, "void", ["pointer", "pointer", "pointer", "pointer"]),
      deleteRef = fn(JNI_DELETE_LOCAL_REF, "void", ["pointer", "pointer"]);
    const newString = fn(JNI_NEW_STRING_UTF, "pointer", ["pointer", "pointer"]),
      exceptionCheck = fn(JNI_EXCEPTION_CHECK, "int", ["pointer"]);
    const refs = [];
    const utf = (value) => Memory.allocUtf8String(value),
      keep = (value) => {
        if (!value.isNull()) refs.push(value);
        return value;
      };
    try {
      const activityThread = keep(findClass(env, utf("android/app/ActivityThread"))),
        currentApplication = getStaticMethod(
          env,
          activityThread,
          utf("currentApplication"),
          utf("()Landroid/app/Application;"),
        );
      const application = keep(callStaticObject(env, activityThread, currentApplication, NULL));
      if (application.isNull()) return false;
      const contextClass = keep(findClass(env, utf("android/content/Context"))),
        getService = getMethod(
          env,
          contextClass,
          utf("getSystemService"),
          utf("(Ljava/lang/String;)Ljava/lang/Object;"),
        );
      const clipboard = keep(
        callObject(env, application, getService, keep(newString(env, utf("clipboard")))),
      );
      if (clipboard.isNull()) return false;
      const clipboardClass = keep(findClass(env, utf("android/content/ClipboardManager"))),
        getPrimary = getMethod(
          env,
          clipboardClass,
          utf("getPrimaryClip"),
          utf("()Landroid/content/ClipData;"),
        );
      const clip = keep(callObject(env, clipboard, getPrimary, NULL));
      if (clip.isNull()) return false;
      const clipClass = keep(findClass(env, utf("android/content/ClipData"))),
        getItem = getMethod(
          env,
          clipClass,
          utf("getItemAt"),
          utf("(I)Landroid/content/ClipData$Item;"),
        );
      const item = keep(callObject(env, clip, getItem, ptr(0)));
      if (item.isNull()) return false;
      const itemClass = keep(findClass(env, utf("android/content/ClipData$Item"))),
        getUri = getMethod(env, itemClass, utf("getUri"), utf("()Landroid/net/Uri;"));
      const uri = keep(callObject(env, item, getUri, NULL));
      if (uri.isNull()) return false;
      const resolverClass = keep(findClass(env, utf("android/content/ContentResolver"))),
        getResolver = getMethod(
          env,
          contextClass,
          utf("getContentResolver"),
          utf("()Landroid/content/ContentResolver;"),
        );
      const resolver = keep(callObject(env, application, getResolver, NULL)),
        openFd = getMethod(
          env,
          resolverClass,
          utf("openFileDescriptor"),
          utf("(Landroid/net/Uri;Ljava/lang/String;)Landroid/os/ParcelFileDescriptor;"),
        );
      const parcel = keep(callObject(env, resolver, openFd, uri));
      if (parcel.isNull()) return false;
      const parcelClass = keep(findClass(env, utf("android/os/ParcelFileDescriptor"))),
        getFd = getMethod(env, parcelClass, utf("getFd"), utf("()I")),
        close = getMethod(env, parcelClass, utf("close"), utf("()V"));
      const fd = callInt(env, parcel, getFd, NULL);
      const result = fd >= 0 && this.copyFdToFile(fd, path);
      if (!close.isNull()) callVoid(env, parcel, close, NULL);
      return result;
    } catch (_) {
      return false;
    } finally {
      for (const ref of refs)
        try {
          deleteRef(env, ref);
        } catch (_) {}
    }
  }
  static getEnv() {
    const address =
      Module.findExportByName("libart.so", "JNI_GetCreatedJavaVMs") ??
      Module.findExportByName(null, "JNI_GetCreatedJavaVMs");
    if (!address) return null;
    const getVMs = new NativeFunction(address, "int", ["pointer", "int", "pointer"]),
      vmOut = Libc.malloc(Process.pointerSize),
      count = Libc.malloc(4);
    if (getVMs(vmOut, 1, count) !== 0 || count.readS32() < 1) return null;
    const vm = vmOut.readPointer();
    if (vm.isNull()) return null;
    const table = vm.readPointer(),
      envOut = Libc.malloc(Process.pointerSize);
    const getEnv = new NativeFunction(
      table.add(JNI_GET_ENV * Process.pointerSize).readPointer(),
      "int",
      ["pointer", "pointer", "int"],
    );
    return getEnv(vm, envOut, JNI_VERSION_1_6) === 0 ? envOut.readPointer() : null;
  }
  static copyFdToFile(fd, path) {
    const buffer = Libc.malloc(65536);
    let file = null,
      total = 0;
    try {
      file = new File(path, "wb");
      while (true) {
        const count = Number(Libc.read(fd, buffer, 65536));
        if (count <= 0) break;
        file.write(buffer.readByteArray(count));
        total += count;
      }
      file.close();
      return total > 0;
    } catch (_) {
      try {
        file?.close();
      } catch (_) {}
      return false;
    }
  }
}
exports.ClipboardImage = ClipboardImage;
