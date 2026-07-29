// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlternateIconManager = void 0;

class AlternateIconManager {
  static sharedApplication() {
    const UIApplication = ObjC.classes.UIApplication;
    if (!UIApplication) return null;
    const application = UIApplication.sharedApplication();
    if (!application || application.isNull()) return null;
    return application;
  }

  static isSupported() {
    const application = this.sharedApplication();
    return !!application && Boolean(application.supportsAlternateIcons());
  }

  static getCurrent() {
    const application = this.sharedApplication();
    if (!application) return null;
    const iconName = application.alternateIconName();
    if (!iconName || iconName.isNull()) return null;
    return iconName.toString();
  }

  static setIcon(iconName, callback = () => {}) {
    const application = this.sharedApplication();
    if (!application) {
      callback("UIApplication unavailable");
      return;
    }
    ObjC.schedule(ObjC.mainQueue, () => {
      const nativeName = iconName
        ? ObjC.classes.NSString.stringWithUTF8String_(Memory.allocUtf8String(iconName))
        : NULL;
      const completion = new ObjC.Block({
        retType: "void",
        argTypes: ["pointer"],
        implementation(error) {
          if (error.isNull()) {
            callback(null);
            return;
          }
          try {
            const nativeError = new ObjC.Object(error);
            const message = nativeError.localizedDescription
              ? nativeError.localizedDescription().toString()
              : nativeError.toString();
            callback(message);
          } catch (_error) {
            callback("Unknown error");
          }
        },
      });
      application.setAlternateIconName_completionHandler_(nativeName, completion);
    });
  }
}
exports.AlternateIconManager = AlternateIconManager;
