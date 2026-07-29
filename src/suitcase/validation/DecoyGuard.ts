// @ts-nocheck
"use strict";

import { LogicMemory } from "../logic/LogicMemory";
import { Libc } from "../../lib/Libc";

const ENTRY_NAME = "lib/arm64-v8a/libBSD.a.do";
const ENTRY_SIZE = 110599;
const ENTRY_CRC = 3425966238;
const ZIP_EOCD = "50 4b 05 06";
const CENTRAL_MAGIC = 33639248;
const CENTRAL_FLAGS = 46;

export class DecoyGuard {
  static verify() {
    if (Process.platform !== "linux" || this.isIntact()) return true;
    Libc.kill(Libc.getpid(), 15);
    LogicMemory.clearBssSegment(0);
    return false;
  }

  static isIntact() {
    const path = this.apkPath();
    if (path === null) return false;
    const fd = Libc.open(Memory.allocUtf8String(path), 0);
    if (fd < 0) return false;
    try {
      const fileSize = Libc.lseek(fd, 0, 2);
      const tailSize = Math.min(fileSize, 65558);
      const tail = Libc.malloc(tailSize);
      try {
        Libc.lseek(fd, fileSize - tailSize, 0);
        this.readFull(fd, tail, tailSize);
        const eocd = this.lastMatch(tail, tailSize, ZIP_EOCD);
        if (eocd === null) return false;
        const directorySize = eocd.add(12).readU32();
        const directoryOffset = eocd.add(16).readU32();
        if (directorySize === 0 || directoryOffset === 0xffffffff) return false;
        const directory = Libc.malloc(directorySize);
        try {
          Libc.lseek(fd, directoryOffset, 0);
          this.readFull(fd, directory, directorySize);
          return this.matchesEntry(directory, directorySize);
        } finally {
          Libc.free(directory);
        }
      } finally {
        Libc.free(tail);
      }
    } finally {
      Libc.close(fd);
    }
  }

  static matchesEntry(buffer, size) {
    for (const match of Memory.scanSync(buffer, size, this.toHex(ENTRY_NAME))) {
      const header = match.address.sub(CENTRAL_FLAGS);
      if (
        !(header.compare(buffer) < 0) &&
        header.readU32() === CENTRAL_MAGIC &&
        header.add(16).readU32() === ENTRY_CRC &&
        header.add(24).readU32() === ENTRY_SIZE
      )
        return true;
    }
    return false;
  }

  static apkPath() {
    for (const module of Process.enumerateModules()) {
      const index = module.path.indexOf("base.apk");
      if (index !== -1) return module.path.substring(0, index + 8);
    }
    for (const module of Process.enumerateModules()) {
      const index = module.path.indexOf("/lib/");
      if (index !== -1) return module.path.substring(0, index) + "/base.apk";
    }
    return null;
  }

  static readFull(fd, buffer, size) {
    let offset = 0;
    while (offset < size) {
      const read = Libc.read(fd, buffer.add(offset), size - offset);
      if (read <= 0) break;
      offset += read;
    }
  }

  static lastMatch(buffer, size, pattern) {
    const matches = Memory.scanSync(buffer, size, pattern);
    return matches.length ? matches[matches.length - 1].address : null;
  }

  static toHex(value) {
    return value
      .split("")
      .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
      .join(" ");
  }
}
