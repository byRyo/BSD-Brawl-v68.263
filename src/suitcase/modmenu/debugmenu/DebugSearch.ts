// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugSearch = void 0;
class DebugSearch {
  static getQuery() {
    return this.query;
  }
  static setQuery(query) {
    const normalized = query.trim().toLowerCase();
    if (normalized !== this.query) {
      this.query = normalized;
      this.listeners.forEach((listener) => listener());
    }
  }
  static clear() {
    this.setQuery("");
  }
  static matches(label) {
    return this.query.length === 0 || label.toLowerCase().includes(this.query);
  }
  static onChange(listener) {
    this.listeners.push(listener);
  }
}
exports.DebugSearch = DebugSearch;
DebugSearch.query = "";
DebugSearch.listeners = [];
