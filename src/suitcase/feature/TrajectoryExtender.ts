// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrajectoryExtender = void 0;
const Libc_1 = require("../../lib/Libc");
const LogicMemory_1 = require("../logic/LogicMemory");
const LogicBattleModeClient_1 = require("../../laser/client/logic/mode/LogicBattleModeClient");
const SINGLE_DRAW = 2808,
  MULTI_DRAW = 2816,
  MAP_W = LogicMemory_1.LogicMemory.offset(196),
  MAP_H = LogicMemory_1.LogicMemory.offset(200),
  OBJECT_A = LogicMemory_1.LogicMemory.offset(32),
  OBJECT_B = LogicMemory_1.LogicMemory.offset(16),
  ACTIVE = LogicMemory_1.LogicMemory.offset(20),
  TILE_DATA = LogicMemory_1.LogicMemory.offset(8);
const POINT_STRIDE = 12,
  BUFFER_END = 16,
  PATH_Z = 20,
  TILE = 300,
  MAX_MAP = 100,
  MIN_PATH = 60,
  MAX_BOUNCES = 3,
  STEP = 10,
  EPSILON = 1,
  PATH_DATA_SIZE = 48,
  PATH_BUFFER_SIZE = 24,
  MAX_DISTANCE = 3000,
  BOUNCE_DISTANCE = 1500,
  BOUNCE_SCALE = 0.5,
  ENABLED = 1;
class TrajectoryExtender {
  static extend(object, path, z, maxDistance = BOUNCE_DISTANCE, alreadyTravelled = 0) {
    const map = LogicBattleModeClient_1.LogicBattleModeClient.getTileMap();
    if (map.isNull()) return null;
    const last = path[path.length - 1],
      previous = path[path.length - 2],
      length = this.computeTotalPathLength(path),
      target = Math.max(alreadyTravelled, length),
      extra = Math.min(
        target - length + maxDistance,
        alreadyTravelled > 0 ? alreadyTravelled * BOUNCE_SCALE : MAX_DISTANCE,
      );
    if (extra < MIN_PATH) return null;
    const segments = this.computeBounceSegments(map, last, previous, extra);
    if (!segments.length) return null;
    const height = last.z,
      a = object.add(OBJECT_A).readPointer(),
      b = object.add(OBJECT_B).readPointer(),
      hasA = !a.isNull(),
      hasB = !b.isNull();
    if (!hasA && !hasB) return null;
    if (segments.length === 1) {
      if (hasA) this.drawSingleSegment(a, segments[0], height, z);
    } else {
      if (hasA) this.drawMultiSegmentPath(a, segments.slice(0, -1), height, z);
      if (hasB) this.drawSingleSegment(b, segments[segments.length - 1], height, z);
    }
    const end = segments[segments.length - 1];
    return { endX: end.endX, endY: end.endY };
  }
  static computeTotalPathLength(path) {
    let total = 0;
    for (let i = 1; i < path.length; i++) {
      const d = this.distance(path[i - 1].x, path[i - 1].y, path[i].x, path[i].y);
      if (d > 1) total += d;
    }
    return total;
  }
  static computeBounceSegments(map, start, previous, distance) {
    let x = start.x,
      y = start.y,
      dx = start.x - previous.x,
      dy = start.y - previous.y,
      len = Math.sqrt(dx * dx + dy * dy);
    dx /= len;
    dy /= len;
    let remaining = distance;
    const result = [];
    for (let bounce = 0; bounce < MAX_BOUNCES; bounce++) {
      len = Math.sqrt(dx * dx + dy * dy);
      if (len < 1 || remaining < MIN_PATH) break;
      const ux = dx / len,
        uy = dy / len;
      let endX = x + ux * remaining,
        endY = y + uy * remaining,
        hit = false;
      const collision = this.raycast(map, x, y, ux, uy, remaining);
      if (collision) {
        hit = true;
        endX = collision.x;
        endY = collision.y;
        dx = ux;
        dy = uy;
        if (collision.flipX) dx = -dx;
        else dy = -dy;
      }
      const traveled = this.distance(x, y, endX, endY);
      result.push({ startX: x - ux * EPSILON, startY: y - uy * EPSILON, endX, endY, hitWall: hit });
      if (!hit) break;
      remaining -= traveled;
      x = endX;
      y = endY;
    }
    return result;
  }
  static drawSingleSegment(target, segment, height, draw) {
    this.writeSingleSegmentBuffer(
      this.singleSegmentPathData,
      this.singleSegmentPathBuffer,
      segment,
      height,
    );
    draw(target, this.singleSegmentPathBuffer, SINGLE_DRAW, 0);
    target.add(ACTIVE).writeU8(ENABLED);
  }
  static drawMultiSegmentPath(target, segments, height, draw) {
    let count = 0;
    for (let i = 0; i < segments.length; i++) {
      const s = segments[i];
      if (i === 0)
        this.writePathPoint(this.multiSegmentPathData, count++, s.startX, s.startY, height);
      this.writePathPoint(this.multiSegmentPathData, count++, s.endX, s.endY, height);
    }
    const end = this.multiSegmentPathData.add(count * POINT_STRIDE);
    this.multiSegmentPathBuffer.writePointer(this.multiSegmentPathData);
    this.multiSegmentPathBuffer.add(8).writePointer(end);
    this.multiSegmentPathBuffer.add(BUFFER_END).writePointer(end);
    draw(target, this.multiSegmentPathBuffer, MULTI_DRAW, 0);
    target.add(ACTIVE).writeU8(ENABLED);
  }
  static writePathPoint(buffer, index, x, y, z) {
    const o = index * POINT_STRIDE;
    buffer.add(o).writeFloat(x);
    buffer.add(o + 4).writeFloat(y);
    buffer.add(o + 8).writeFloat(z);
  }
  static writeSingleSegmentBuffer(data, buffer, segment, z) {
    data.writeFloat(segment.startX);
    data.add(4).writeFloat(segment.startY);
    data.add(8).writeFloat(z);
    data.add(12).writeFloat(segment.endX);
    data.add(16).writeFloat(segment.endY);
    data.add(20).writeFloat(z);
    const end = data.add(PATH_BUFFER_SIZE);
    buffer.writePointer(data);
    buffer.add(8).writePointer(end);
    buffer.add(BUFFER_END).writePointer(end);
  }
  static distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }
  static isTileBlocked(map, x, y) {
    try {
      const tx = Math.floor(x / TILE),
        ty = Math.floor(y / TILE),
        w = map.add(MAP_W).readS32(),
        h = map.add(MAP_H).readS32();
      if (tx < 0 || ty < 0 || tx >= w || ty >= h) return false;
      const row = map
        .add(TILE_DATA)
        .readPointer()
        .add(8 * (tx + w * ty))
        .readPointer();
      if (row.isNull()) return false;
      const sx = Math.floor((x % TILE) / 100),
        sy = Math.floor((y % TILE) / 100),
        bit = sx + 3 * sy,
        a = row.add(4).readU32(),
        b = row.add(8).readU32();
      return bit < 32 ? !!((a >> bit) & 1) : !!((b >> (bit - 32)) & 1);
    } catch (_) {
      return false;
    }
  }
  static raycast(map, x, y, dx, dy, distance) {
    const steps = Math.ceil(distance / STEP);
    for (let i = 1; i <= steps; i++) {
      const at = Math.min(i * STEP, distance),
        px = x + dx * at,
        py = y + dy * at;
      if (!this.isTileBlocked(map, px, py)) continue;
      let low = at - STEP,
        high = at;
      for (let j = 0; j < 8; j++) {
        const mid = (low + high) / 2;
        if (this.isTileBlocked(map, x + dx * mid, y + dy * mid)) high = mid;
        else low = mid;
      }
      const t = (low + high) / 2,
        hitX = x + dx * t,
        hitY = y + dy * t,
        blockX = this.isTileBlocked(map, px, y + dy * low),
        blockY = this.isTileBlocked(map, x + dx * low, py);
      let flipX = blockX && !blockY;
      if (blockX === blockY) flipX = Math.abs(dx) > Math.abs(dy);
      return { x: hitX, y: hitY, flipX };
    }
    return null;
  }
}
exports.TrajectoryExtender = TrajectoryExtender;
TrajectoryExtender.multiSegmentPathData = Libc_1.Libc.malloc(PATH_DATA_SIZE);
TrajectoryExtender.multiSegmentPathBuffer = Libc_1.Libc.malloc(PATH_BUFFER_SIZE);
TrajectoryExtender.singleSegmentPathData = Libc_1.Libc.malloc(PATH_BUFFER_SIZE);
TrajectoryExtender.singleSegmentPathBuffer = Libc_1.Libc.malloc(PATH_BUFFER_SIZE);
