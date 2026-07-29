// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugRecents = void 0;
const MAX_RECENTS = 8;
class DebugRecents {
  static push(label) {
    const index = this.labels.indexOf(label);
    if (index >= 0) this.labels.splice(index, 1);
    this.labels.unshift(label);
    if (this.labels.length > MAX_RECENTS) this.labels.length = MAX_RECENTS;
    this.listeners.forEach((listener) => listener());
  }
  static getAll() {
    return this.labels.slice();
  }
  static clear() {
    this.labels.length = 0;
    this.listeners.forEach((listener) => listener());
  }
  static onChange(listener) {
    this.listeners.push(listener);
  }
}
exports.DebugRecents = DebugRecents;
DebugRecents.labels = [];
DebugRecents.listeners = [];
