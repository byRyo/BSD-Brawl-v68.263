// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMOOTH_HUD_GRAPH_HEIGHT_PX = exports.SmoothHudGraph = void 0;
const Libc_1 = require("../../lib/Libc");
const Logcat_1 = require("../debug/Logcat");
const GL = {
  VERTEX_SHADER: 35633,
  FRAGMENT_SHADER: 35632,
  COMPILE_STATUS: 35713,
  LINK_STATUS: 35714,
  VIEWPORT: 2978,
  CURRENT_PROGRAM: 35725,
  VERTEX_ARRAY_BINDING: 34229,
  DRAW_FRAMEBUFFER_BINDING: 36006,
  FRAMEBUFFER: 36160,
  ARRAY_BUFFER: 34962,
  FLOAT: 5126,
  DYNAMIC_DRAW: 35048,
  DEPTH_TEST: 2929,
  CULL_FACE: 2960,
  SCISSOR_TEST: 3089,
  BLEND: 3042,
  SRC_ALPHA: 770,
  ONE_MINUS_SRC_ALPHA: 771,
};
const VERTEX =
    "#version 300 es\nin vec2 aPos;\nin vec4 aColor;\nout vec4 vColor;\nvoid main() { gl_Position = vec4(aPos, 0.0, 1.0); vColor = aColor; }",
  FRAGMENT =
    "#version 300 es\nprecision mediump float;\nin vec4 vColor;\nout vec4 fragColor;\nvoid main() { fragColor = vColor; }";
exports.SMOOTH_HUD_GRAPH_HEIGHT_PX = 130;
const SAMPLE_COUNT = 240,
  INIT_FRAMES = 30,
  REFRESH = 120,
  LEFT = 40,
  RIGHT = 50,
  MAX_MS = 50,
  GOOD_MS = 20,
  FRAME_MS = 1000 / 30,
  FLOATS = 6,
  STRIDE = 24,
  SCRATCH = 8676;
class SmoothHudGraph {
  static patch() {
    if (Process.platform === "darwin") return;
    const swap = Module.findExportByName("libEGL.so", "eglSwapBuffers");
    if (swap) Interceptor.attach(swap, { onEnter: () => this.onFrame() });
    else Logcat_1.Logcat.logDebug("SmoothHudGraph: eglSwapBuffers NOT found");
  }
  static onFrame() {
    if (!this.enabled) {
      this.lastFrameAt = 0;
      this.sampleFilled = 0;
      this.sampleHead = 0;
      return;
    }
    const now = Date.now();
    if (this.lastFrameAt) {
      this.samples[this.sampleHead] = now - this.lastFrameAt;
      this.sampleHead = (this.sampleHead + 1) % SAMPLE_COUNT;
      if (this.sampleFilled < SAMPLE_COUNT) this.sampleFilled++;
    }
    this.lastFrameAt = now;
    this.framesSinceStart++;
    if (!this.initializationAttempted && this.framesSinceStart > INIT_FRAMES) {
      this.initializationAttempted = true;
      try {
        this.initializeGPU();
      } catch (e) {
        Logcat_1.Logcat.logDebug("SmoothHudGraph init error: " + e);
      }
    }
    if (this.initialized)
      try {
        this.draw();
      } catch (e) {
        Logcat_1.Logcat.logDebug("SmoothHudGraph draw error: " + e);
      }
  }
  static draw() {
    const gl = this.gl;
    if (this.viewportWidth === 0 || this.framesSinceStart % REFRESH === 0) {
      gl.getIntegerv(GL.VIEWPORT, this.viewportBuffer);
      this.viewportWidth = this.viewportBuffer.add(8).readS32();
      this.viewportHeight = this.viewportBuffer.add(12).readS32();
    }
    if (this.viewportWidth <= 0 || this.viewportHeight <= 0) return;
    const count = this.buildGeometry();
    if (!count) return;
    this.vertexBuffer.writeByteArray(this.scratch.buffer);
    gl.getIntegerv(GL.CURRENT_PROGRAM, this.savedState);
    gl.getIntegerv(GL.VERTEX_ARRAY_BINDING, this.savedState.add(4));
    gl.getIntegerv(GL.DRAW_FRAMEBUFFER_BINDING, this.savedState.add(8));
    gl.bindFramebuffer(GL.FRAMEBUFFER, 0);
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vertexArrayObject);
    gl.disable(GL.DEPTH_TEST);
    gl.disable(GL.CULL_FACE);
    gl.disable(GL.SCISSOR_TEST);
    gl.enable(GL.BLEND);
    gl.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(0);
    gl.bindBuffer(GL.ARRAY_BUFFER, this.vertexBufferObject);
    gl.bufferData(GL.ARRAY_BUFFER, count * STRIDE, this.vertexBuffer, GL.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(this.positionLocation);
    gl.vertexAttribPointer(this.positionLocation, 2, GL.FLOAT, 0, STRIDE, ptr(0));
    gl.enableVertexAttribArray(this.colorLocation);
    gl.vertexAttribPointer(this.colorLocation, 4, GL.FLOAT, 0, STRIDE, ptr(8));
    gl.drawArrays(4, 0, count);
    gl.disableVertexAttribArray(this.positionLocation);
    gl.disableVertexAttribArray(this.colorLocation);
    gl.bindBuffer(GL.ARRAY_BUFFER, 0);
    gl.bindFramebuffer(GL.FRAMEBUFFER, this.savedState.add(8).readU32());
    gl.bindVertexArray(this.savedState.add(4).readU32());
    gl.useProgram(this.savedState.readU32());
    gl.disable(GL.BLEND);
    gl.enable(GL.DEPTH_TEST);
    gl.depthMask(1);
  }
  static buildGeometry() {
    this.scratchIndex = 0;
    const w = this.viewportWidth,
      h = this.viewportHeight,
      bottom = exports.SMOOTH_HUD_GRAPH_HEIGHT_PX,
      xStep = (w - LEFT - RIGHT) / SAMPLE_COUNT,
      toX = (x) => x / (w / 2) - 1,
      toY = (y) => 1 - y / (h / 2);
    this.emitQuad(toX(LEFT), toY(bottom), toX(w), toY(0), 0, 0, 0, 0.47);
    const base = toY(bottom);
    for (let i = 0; i < this.sampleFilled; i++) {
      const idx = (this.sampleHead - this.sampleFilled + i + SAMPLE_COUNT) % SAMPLE_COUNT,
        ms = this.samples[idx],
        bar = (ms < MAX_MS ? ms / MAX_MS : 1) * exports.SMOOTH_HUD_GRAPH_HEIGHT_PX,
        x = LEFT + i * xStep;
      let r = 1,
        g = 0.25,
        b = 0.25;
      if (ms <= GOOD_MS) {
        r = 0.2;
        g = 0.8;
        b = 0.2;
      } else if (ms <= FRAME_MS) {
        r = 1;
        g = 0.85;
        b = 0;
      }
      this.emitQuad(toX(x), base, toX(x + xStep), toY(bottom - bar), r, g, b, 0.9);
    }
    return this.scratchIndex / FLOATS;
  }
  static emitQuad(x1, y1, x2, y2, r, g, b, a) {
    this.pushVertex(x1, y1, r, g, b, a);
    this.pushVertex(x2, y1, r, g, b, a);
    this.pushVertex(x2, y2, r, g, b, a);
    this.pushVertex(x1, y1, r, g, b, a);
    this.pushVertex(x2, y2, r, g, b, a);
    this.pushVertex(x1, y2, r, g, b, a);
  }
  static pushVertex(x, y, r, g, b, a) {
    const s = this.scratch,
      i = this.scratchIndex;
    s[i] = x;
    s[i + 1] = y;
    s[i + 2] = r;
    s[i + 3] = g;
    s[i + 4] = b;
    s[i + 5] = a;
    this.scratchIndex = i + 6;
  }
  static initializeGPU() {
    const n = (name, ret, args) => {
      const p = Module.findExportByName("libGLESv2.so", name);
      return p ? new NativeFunction(p, ret, args) : null;
    };
    this.gl = {
      createShader: n("glCreateShader", "uint32", ["uint32"]),
      shaderSource: n("glShaderSource", "void", ["uint32", "int32", "pointer", "pointer"]),
      compileShader: n("glCompileShader", "void", ["uint32"]),
      getShaderiv: n("glGetShaderiv", "void", ["uint32", "uint32", "pointer"]),
      createProgram: n("glCreateProgram", "uint32", []),
      attachShader: n("glAttachShader", "void", ["uint32", "uint32"]),
      linkProgram: n("glLinkProgram", "void", ["uint32"]),
      getProgramiv: n("glGetProgramiv", "void", ["uint32", "uint32", "pointer"]),
      useProgram: n("glUseProgram", "void", ["uint32"]),
      getAttribLocation: n("glGetAttribLocation", "int32", ["uint32", "pointer"]),
      enableVertexAttribArray: n("glEnableVertexAttribArray", "void", ["uint32"]),
      disableVertexAttribArray: n("glDisableVertexAttribArray", "void", ["uint32"]),
      vertexAttribPointer: n("glVertexAttribPointer", "void", [
        "uint32",
        "int32",
        "uint32",
        "uint8",
        "int32",
        "pointer",
      ]),
      drawArrays: n("glDrawArrays", "void", ["uint32", "int32", "int32"]),
      genBuffers: n("glGenBuffers", "void", ["int32", "pointer"]),
      bindBuffer: n("glBindBuffer", "void", ["uint32", "uint32"]),
      bufferData: n("glBufferData", "void", ["uint32", "int32", "pointer", "uint32"]),
      enable: n("glEnable", "void", ["uint32"]),
      disable: n("glDisable", "void", ["uint32"]),
      blendFunc: n("glBlendFunc", "void", ["uint32", "uint32"]),
      depthMask: n("glDepthMask", "void", ["uint8"]),
      getIntegerv: n("glGetIntegerv", "void", ["uint32", "pointer"]),
      genVertexArrays: n("glGenVertexArrays", "void", ["int32", "pointer"]),
      bindVertexArray: n("glBindVertexArray", "void", ["uint32"]),
      bindFramebuffer: n("glBindFramebuffer", "void", ["uint32", "uint32"]),
    };
    if (!this.gl.createShader) {
      Logcat_1.Logcat.logDebug("SmoothHudGraph: GL funcs missing");
      return false;
    }
    const vs = this.compileShader(GL.VERTEX_SHADER, VERTEX),
      fs = this.compileShader(GL.FRAGMENT_SHADER, FRAGMENT);
    if (!vs || !fs) {
      Logcat_1.Logcat.logDebug("SmoothHudGraph: shader compile failed");
      return false;
    }
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vs);
    this.gl.attachShader(this.program, fs);
    this.gl.linkProgram(this.program);
    const status = Libc_1.Libc.malloc(4);
    this.gl.getProgramiv(this.program, GL.LINK_STATUS, status);
    if (!status.readS32()) {
      Logcat_1.Logcat.logDebug("SmoothHudGraph: program link failed");
      return false;
    }
    this.positionLocation = this.gl.getAttribLocation(this.program, Memory.allocUtf8String("aPos"));
    this.colorLocation = this.gl.getAttribLocation(this.program, Memory.allocUtf8String("aColor"));
    const id = Libc_1.Libc.malloc(4);
    this.gl.genVertexArrays(1, id);
    this.vertexArrayObject = id.readU32();
    this.gl.genBuffers(1, id);
    this.vertexBufferObject = id.readU32();
    this.initialized = true;
    return true;
  }
  static compileShader(type, source) {
    const shader = this.gl.createShader(type);
    if (!shader) return 0;
    const text = Memory.allocUtf8String(source),
      array = Libc_1.Libc.malloc(8);
    array.writePointer(text);
    this.gl.shaderSource(shader, 1, array, NULL);
    this.gl.compileShader(shader);
    const status = Libc_1.Libc.malloc(4);
    this.gl.getShaderiv(shader, GL.COMPILE_STATUS, status);
    return status.readS32() ? shader : 0;
  }
}
exports.SmoothHudGraph = SmoothHudGraph;
SmoothHudGraph.enabled = false;
SmoothHudGraph.gl = null;
SmoothHudGraph.program = 0;
SmoothHudGraph.vertexBufferObject = 0;
SmoothHudGraph.vertexArrayObject = 0;
SmoothHudGraph.positionLocation = 0;
SmoothHudGraph.colorLocation = 0;
SmoothHudGraph.initialized = false;
SmoothHudGraph.initializationAttempted = false;
SmoothHudGraph.framesSinceStart = 0;
SmoothHudGraph.samples = new Float32Array(SAMPLE_COUNT);
SmoothHudGraph.sampleHead = 0;
SmoothHudGraph.sampleFilled = 0;
SmoothHudGraph.lastFrameAt = 0;
SmoothHudGraph.scratch = new Float32Array(SCRATCH);
SmoothHudGraph.scratchIndex = 0;
SmoothHudGraph.viewportWidth = 0;
SmoothHudGraph.viewportHeight = 0;
SmoothHudGraph.vertexBuffer = Libc_1.Libc.malloc(34704);
SmoothHudGraph.savedState = Libc_1.Libc.malloc(12);
SmoothHudGraph.viewportBuffer = Libc_1.Libc.malloc(16);
