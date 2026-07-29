// @ts-nocheck
"use strict";

export class LogicTime {
  static timestampToDate(timestamp) {
    const pad = (value, length = 2) => `${Array(length).fill(0)}${value}`.slice(-length);
    const date = new Date(timestamp);
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${pad(date.getFullYear(), 4)} (dd.mm.yyyy)\n  ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} (hh:mm:ss)`;
  }

  static humanizeTime(seconds) {
    const s = seconds % 60;
    const m = Math.floor(seconds / 60) % 60;
    const h = Math.floor(seconds / 3600) % 24;
    const d = Math.floor(seconds / 86400);
    const values = [];
    d > 0 && values.push(`${d}д`);
    h > 0 && values.push(`${h}ч`);
    (m > 0 || values.length > 0) && values.push(`${m}м`);
    values.push(`${s}c`);
    return values.join(" ");
  }
}
