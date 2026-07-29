// @ts-nocheck
"use strict";

export class LogicColor {
  static argbToIntString(argb) {
    return `${Math.round((255 * argb[3]) / 100)
      .toString(16)
      .padStart(2, "0")}${Math.round((255 * argb[0]) / 100)
      .toString(16)
      .padStart(2, "0")}${Math.round((255 * argb[1]) / 100)
      .toString(16)
      .padStart(2, "0")}${Math.round((255 * argb[2]) / 100)
      .toString(16)
      .padStart(2, "0")}`.toUpperCase();
  }

  static rgbToInt(rgb) {
    return (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
  }
  static intToRGB(value) {
    return [(value & 0xff0000) >> 16, (value & 0xff00) >> 8, value & 0xff];
  }

  static generateColorArray(from, to, count) {
    const a = this.intToRGB(from),
      b = this.intToRGB(to),
      result = [];
    let position = 0;
    for (let i = 0; i < count; i++) {
      position += 1 / count;
      result.push(
        this.rgbToInt([
          a[0] * position + (1 - position) * b[0],
          a[1] * position + (1 - position) * b[1],
          a[2] * position + (1 - position) * b[2],
        ]),
      );
    }
    return result;
  }

  static lerp(a, b, position) {
    return a + (b - a) * position;
  }
  static lerpColor(from, to, position) {
    const [r1, g1, b1] = this.intToRGB(from);
    const [r2, g2, b2] = this.intToRGB(to);
    return this.rgbToInt([
      Math.round(this.lerp(r1, r2, position)),
      Math.round(this.lerp(g1, g2, position)),
      Math.round(this.lerp(b1, b2, position)),
    ]);
  }
}
