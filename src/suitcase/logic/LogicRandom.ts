// @ts-nocheck
"use strict";

import { GameMain } from "../../laser/client/GameMain";

export class LogicRandom {
  static getRandomInRangeExcept(min, max, excluded = []) {
    const value = GameMain.getRand(max - min + 1) + min;
    return excluded.includes(value) ? this.getRandomInRangeExcept(min, max, excluded) : value;
  }

  static random(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
  }
}
