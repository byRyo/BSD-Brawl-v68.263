// @ts-nocheck
const { EDebugger } = require("../../../../suitcase/debug/EDebugger");
const { Logcat } = require("../../../../suitcase/debug/Logcat");
const { IOSDownloader } = require("../common/http/IOSDownloader");

class NativeHTTPClient {
  static nativeHTTPGetRequest(url, callback, savePath) {
    if (!savePath) {
      const message =
        "NativeHTTPClient.nativeHTTPGetRequest: savePath required on iOS, got empty for ".concat(
          url,
        );
      Logcat.logError(message);
      try {
        callback(message, 0);
      } catch (_error) {}
      return;
    }

    IOSDownloader.download(url, savePath, "", (response, statusCode) => {
      try {
        callback(response, statusCode);
      } catch (_error) {}
    });
  }

  static nativeHTTPPostRequest(_url, callback, _body) {
    const message = "NativeHTTPClient.nativeHTTPPostRequest: not supported on iOS";
    EDebugger.addMessage(EDebugger.WARNING, message);
    Logcat.logError(message);
    try {
      callback(message, 0);
    } catch (_error) {}
  }
}

exports.NativeHTTPClient = NativeHTTPClient;
