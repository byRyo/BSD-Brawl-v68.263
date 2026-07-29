// @ts-nocheck
"use strict";

const AREA_EFFECT_FIELDS = [
  "AreaEffectAttack",
  "AreaEffectAttack2",
  "AreaEffectUlti",
  "AreaEffectUlti2",
  "OverchargedAreaEffectUlti",
  "OverchargedAreaEffectUlti2",
  "AreaEffect",
  "AreaEffectStarPower",
  "AreaEffectStarPowerOvercharged",
  "AreaEffectStarPower2",
  "ChainAreaEffect",
  "OverchargedChainAreaEffect",
  "TriggerAreaEffect",
  "DestroyAreaEffect",
  "SpawnAreaEffectObject",
  "SpawnAreaEffectObject2",
  "SpawnAreaEffectTrail",
  "CustomAreaEffect1",
  "CustomAreaEffect2",
];
const PROJECTILE_FIELDS = [
  "Projectiles",
  "OverchargedMainAttackProjectile",
  "UltiProjectile",
  "OverchargedUltiProjectile",
  "SecondaryProjectile",
  "ThirdProjectile",
  "AutoAttackProjectile",
  "ProjectileForShockyStarPower",
  "OverchargedProjectileForShockyStarPower",
  "BulletExplosionBullet",
  "ChainBullet",
];
const ITEM_FIELDS = ["SpawnedItem", "SpawnedItem2", "BulletExplosionItem", "SpawnItem"];

export class Utils {
  static gameSleeping = false;

  static syncObjects(source, target) {
    for (const property in source) {
      if (property in target) continue;
      const value = source[property];
      const copy = Array.isArray(value)
        ? Object.assign([], value)
        : value !== null &&
            typeof value === "object" &&
            Object.getPrototypeOf(value) === Object.prototype
          ? Object.assign({}, value)
          : value;
      target.insertProperty(property, copy, Object.keys(source).indexOf(property));
    }
  }

  static getCurrentTime() {
    return Math.floor(Date.now() / 1000);
  }
  static setGameThreadSleepTo(value) {
    Thread.sleep(value);
  }

  static clearEmptyEntries(object) {
    for (const key in object) {
      const value = object[key];
      if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
        this.clearEmptyEntries(value);
        if (Object.keys(value).length === 0) delete object[key];
      } else if (!value) delete object[key];
    }
  }

  static clearConfigEntriesIfAnyValIsNull(config) {
    for (const character in config) {
      const skins = config[character];
      for (const skin in skins) {
        const entry = skins[skin];
        if (entry.a.length === 0 && entry.p.length === 0 && entry.i.length === 0)
          delete skins[skin];
      }
      if (Object.keys(skins).length === 0) delete config[character];
    }
  }

  static processDerivative(derivative, type, output) {
    if (!derivative?.name) return;
    output[type].push(derivative.name);
    for (const key of Object.keys(derivative)) {
      const field = key[0].toUpperCase() + key.slice(1);
      const value = derivative[key];
      if (AREA_EFFECT_FIELDS.includes(field)) this.processDerivative(value, "a", output);
      else if (PROJECTILE_FIELDS.includes(field)) this.processDerivative(value, "p", output);
      else if (ITEM_FIELDS.includes(field)) this.processDerivative(value, "i", output);
    }
  }
}