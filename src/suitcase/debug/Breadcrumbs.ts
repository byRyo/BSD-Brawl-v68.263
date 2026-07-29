// @ts-nocheck
"use strict";

import { Libg } from "../../lib/Libg";
import { StringObject } from "../../laser/titan/client/native/StringObject";
import { IOSHTTPOffsets } from "../../laser/titan/client/common/http/IOSHTTPOffsets";

const HTTP_GET = Libg.offset(15244024, 0);
const HTTP_DONE = Libg.offset(14642136, 0);

export class Breadcrumbs {
  static MAX = 64;
  static entries = [];

  static push(label) {
    const last = this.entries[this.entries.length - 1];
    if (last && last.label === label) last.count++;
    else {
      this.entries.length >= this.MAX && this.entries.shift();
      this.entries.push({ label, count: 1 });
    }
  }

  static dump() {
    return this.entries
      .map((entry) => (entry.count > 1 ? `${entry.label} (x${entry.count})` : entry.label))
      .join("\n");
  }
  static hasCrumbs() {
    return this.entries.length !== 0;
  }
  static clear() {
    this.entries.length = 0;
  }

  static initCrashDebug() {
    if (Process.platform === "darwin") return this.initIOSCrashDebug();
    Interceptor.attach(HTTP_DONE, {
      onEnter(args) {
        try {
          const string = args[0].add(8);
          const url =
            args[0].readU32() >= 8
              ? string.readPointer().readUtf8String()
              : string.readUtf8String();
          Breadcrumbs.push(`GET ${url?.substring(0, 200)}`);
        } catch {
          Breadcrumbs.push("GET (can't read url)");
        }
      },
    });
    Interceptor.attach(HTTP_GET, {
      onEnter(args) {
        try {
          Breadcrumbs.push(
            `done id=${args[1].toInt32()} status=${args[4].toInt32()} len=${args[3].toInt32()}`,
          );
        } catch {}
      },
    });
  }

  static initIOSCrashDebug() {
    Interceptor.attach(IOSHTTPOffsets.HTTPClient_get, {
      onEnter(args) {
        try {
          Breadcrumbs.push(`GET ${StringObject.read(args[1]).substring(0, 200)}`);
        } catch {
          Breadcrumbs.push("GET (read fail)");
        }
      },
    });
    Interceptor.attach(IOSHTTPOffsets.HTTPClient_post, {
      onEnter(args) {
        try {
          Breadcrumbs.push(
            `POST ${StringObject.read(args[1]).substring(0, 200)} len=${args[3].toInt32()}`,
          );
        } catch {
          Breadcrumbs.push("POST (read fail)");
        }
      },
    });
    Interceptor.attach(IOSHTTPOffsets.HTTPClient_download, {
      onEnter(args) {
        try {
          const url = StringObject.read(args[1]);
          const path = StringObject.read(args[2]);
          const slash = path.lastIndexOf("/");
          Breadcrumbs.push(
            `DL ${url.substring(0, 200)} → ${slash >= 0 ? path.substring(slash + 1) : path}`,
          );
        } catch {
          Breadcrumbs.push("DL (read fail)");
        }
      },
    });
    Interceptor.attach(IOSHTTPOffsets.HTTPClient_getMainTrampoline, {
      onEnter(args) {
        try {
          Breadcrumbs.push(
            `GET← status=${args[0].add(56).readU32()} code=${args[0].add(60).readU32()}`,
          );
        } catch {}
      },
    });
    Interceptor.attach(IOSHTTPOffsets.HTTPClient_postMainTrampoline, {
      onEnter(args) {
        try {
          Breadcrumbs.push(
            `POST← status=${args[0].add(56).readU32()} code=${args[0].add(60).readU32()}`,
          );
        } catch {}
      },
    });
    Interceptor.attach(IOSHTTPOffsets.HTTPClient_downloadFinalize, {
      onEnter(args) {
        try {
          const status = args[0].add(40).readU32();
          const code = args[0].add(44).readU32();
          const reason =
            code === 701
              ? "network"
              : code === 703
                ? "move-fail"
                : code === 704
                  ? "sha-mismatch"
                  : `http-${code}`;
          Breadcrumbs.push(`DL← status=${status} ${reason}`);
        } catch {}
      },
    });
  }
}
