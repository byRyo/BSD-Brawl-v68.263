// @ts-nocheck
const { EGatchaDropTypes } = require("../LogicGatchaDrop");
const {
  LogicOwnGatchaRandomReward,
  EEmoteRarities,
  ESkinRarities,
} = require("./LogicOwnGatchaReward");
const { LogicDataTables } = require("../../data/LogicDataTables");

const EStarrDropRarities = {
  1: "RARE",
  2: "SUPER_RARE",
  3: "EPIC",
  4: "MYTHIC",
  5: "LEGENDARY",
  RARE: 1,
  SUPER_RARE: 2,
  EPIC: 3,
  MYTHIC: 4,
  LEGENDARY: 5,
};

class LogicStarrDropRewards {
  static getRandomDropByWeights(rarity) {
    const rewards = this.table[rarity];
    const total = rewards.reduce((sum, reward) => sum + reward.weight, 0);
    const target = Math.random() * total;
    let cumulative = 0;
    for (const reward of rewards) {
      cumulative += reward.weight;
      if (target < cumulative) return reward.getGatchaDrop();
    }
    return rewards[0].getGatchaDrop();
  }
}
const R = LogicOwnGatchaRandomReward;
LogicStarrDropRewards.table = {
  RARE: [
    new R(41.9, 50, EGatchaDropTypes.GOLD),
    new R(32.6, 25, EGatchaDropTypes.POWER_POINTS),
    new R(20.9, 100, EGatchaDropTypes.TOKEN_DOUBLER),
    new R(2.3, 20, EGatchaDropTypes.BLING),
    new R(2.3, 10, EGatchaDropTypes.RECRUIT_TOKENS),
  ],
  SUPER_RARE: [new R(42.38, 100, EGatchaDropTypes.GOLD)],
  EPIC: [
    new R(21.05, 200, EGatchaDropTypes.GOLD),
    new R(21.05, 100, EGatchaDropTypes.POWER_POINTS),
    new R(
      15.79,
      1,
      EGatchaDropTypes.VANITY_ITEM,
      LogicDataTables.table.Emotes,
      EEmoteRarities.COMMON,
    ),
    new R(15.79, 1, EGatchaDropTypes.VANITY_ITEM, LogicDataTables.table.Sprays),
    new R(10.53, 500, EGatchaDropTypes.TOKEN_DOUBLER),
    new R(5.26, 150, EGatchaDropTypes.RECRUIT_TOKENS),
    new R(5.26, 1, EGatchaDropTypes.VANITY_ITEM, LogicDataTables.table.Emotes, EEmoteRarities.RARE),
    new R(5.26, 1, EGatchaDropTypes.VANITY_ITEM, LogicDataTables.table.Skins, ESkinRarities.RARE),
  ],
  MYTHIC: [],
  LEGENDARY: [],
};
exports.EStarrDropRarities = EStarrDropRarities;
exports.LogicStarrDropRewards = LogicStarrDropRewards;
