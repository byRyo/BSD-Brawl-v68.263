// @ts-nocheck
const { Libc } = require("../../lib/Libc");
const { RenderOverlay } = require("./RenderOverlay");
const GL_LINES = 1,
  GL_FLOAT = 5126,
  GL_ARRAY_BUFFER = 34962,
  GL_DYNAMIC_DRAW = 35048;
const GL_DEPTH_TEST = 2929,
  GL_CULL_FACE = 2884,
  GL_BLEND = 3042,
  GL_SCISSOR_TEST = 3089;
class GLOverlayBackend extends RenderOverlay {
  constructor(...args) {
    super(...args);
    this.glFunctions = null;
    this.shaderProgram = 0;
    this.positionAttributeLocation = 0;
    this.mvpUniformLocation = 0;
    this.colorUniformLocation = 0;
    this.vertexBufferObject = 0;
    this.vertexArrayObject = 0;
    this.savedGLState = Libc.malloc(12);
  }
  setupHooks() {
    const swap = Module.findExportByName("libEGL.so", "eglSwapBuffers");
    if (!swap) return;
    Interceptor.attach(swap, { onEnter: () => this.onFrame() });
    this.setupBattleHooks();
  }
  initializeGPU() {
    const native = (name, result, args) => {
      const address = Module.findExportByName("libGLESv2.so", name);
      return address ? new NativeFunction(address, result, args) : null;
    };
    this.glFunctions = {
      createShader: native("glCreateShader", "uint32", ["uint32"]),
      shaderSource: native("glShaderSource", "void", ["uint32", "int32", "pointer", "pointer"]),
      compileShader: native("glCompileShader", "void", ["uint32"]),
      getShaderiv: native("glGetShaderiv", "void", ["uint32", "uint32", "pointer"]),
      createProgram: native("glCreateProgram", "uint32", []),
      attachShader: native("glAttachShader", "void", ["uint32", "uint32"]),
      linkProgram: native("glLinkProgram", "void", ["uint32"]),
      getProgramiv: native("glGetProgramiv", "void", ["uint32", "uint32", "pointer"]),
      useProgram: native("glUseProgram", "void", ["uint32"]),
      getAttribLocation: native("glGetAttribLocation", "int32", ["uint32", "pointer"]),
      getUniformLocation: native("glGetUniformLocation", "int32", ["uint32", "pointer"]),
      enableVertexAttribArray: native("glEnableVertexAttribArray", "void", ["uint32"]),
      disableVertexAttribArray: native("glDisableVertexAttribArray", "void", ["uint32"]),
      vertexAttribPointer: native("glVertexAttribPointer", "void", [
        "uint32",
        "int32",
        "uint32",
        "uint8",
        "int32",
        "pointer",
      ]),
      uniform4f: native("glUniform4f", "void", ["int32", "float", "float", "float", "float"]),
      uniformMatrix4fv: native("glUniformMatrix4fv", "void", [
        "int32",
        "int32",
        "uint8",
        "pointer",
      ]),
      drawArrays: native("glDrawArrays", "void", ["uint32", "int32", "int32"]),
      genBuffers: native("glGenBuffers", "void", ["int32", "pointer"]),
      bindBuffer: native("glBindBuffer", "void", ["uint32", "uint32"]),
      bufferData: native("glBufferData", "void", ["uint32", "int32", "pointer", "uint32"]),
      enable: native("glEnable", "void", ["uint32"]),
      disable: native("glDisable", "void", ["uint32"]),
      lineWidth: native("glLineWidth", "void", ["float"]),
      depthMask: native("glDepthMask", "void", ["uint8"]),
      getIntegerv: native("glGetIntegerv", "void", ["uint32", "pointer"]),
      genVertexArrays: native("glGenVertexArrays", "void", ["int32", "pointer"]),
      bindVertexArray: native("glBindVertexArray", "void", ["uint32"]),
      bindFramebuffer: native("glBindFramebuffer", "void", ["uint32", "uint32"]),
    };
    if (!this.glFunctions.createShader) return false;
    const vertex = this.compileShader(35633, GLOverlayBackend.VERTEX_SHADER),
      fragment = this.compileShader(35632, GLOverlayBackend.FRAGMENT_SHADER);
    if (!vertex || !fragment) return false;
    const gl = this.glFunctions;
    this.shaderProgram = gl.createProgram();
    gl.attachShader(this.shaderProgram, vertex);
    gl.attachShader(this.shaderProgram, fragment);
    gl.linkProgram(this.shaderProgram);
    const status = Libc.malloc(4);
    gl.getProgramiv(this.shaderProgram, 35714, status);
    if (!status.readS32()) return false;
    this.positionAttributeLocation = gl.getAttribLocation(
      this.shaderProgram,
      Memory.allocUtf8String("aPos"),
    );
    this.mvpUniformLocation = gl.getUniformLocation(
      this.shaderProgram,
      Memory.allocUtf8String("uMVP"),
    );
    this.colorUniformLocation = gl.getUniformLocation(
      this.shaderProgram,
      Memory.allocUtf8String("uColor"),
    );
    gl.genVertexArrays(1, status);
    this.vertexArrayObject = status.readU32();
    gl.genBuffers(1, status);
    this.vertexBufferObject = status.readU32();
    this.isInitialized = true;
    return true;
  }
  saveAndPrepareState(mvp) {
    const gl = this.glFunctions;
    gl.useProgram(this.shaderProgram);
    gl.bindVertexArray(this.vertexArrayObject);
    gl.disable(GL_DEPTH_TEST);
    gl.disable(GL_BLEND);
    gl.disable(GL_CULL_FACE);
    gl.disable(GL_SCISSOR_TEST);
    gl.depthMask(0);
    gl.lineWidth(2);
    gl.uniformMatrix4fv(this.mvpUniformLocation, 1, 0, mvp);
  }
  setColorUniform(r, g, b, a) {
    this.glFunctions.uniform4f(this.colorUniformLocation, r, g, b, a);
  }
  uploadAndDrawLines(vertices, count) {
    const gl = this.glFunctions;
    gl.bindBuffer(GL_ARRAY_BUFFER, this.vertexBufferObject);
    gl.bufferData(GL_ARRAY_BUFFER, count * 12, vertices, GL_DYNAMIC_DRAW);
    gl.enableVertexAttribArray(this.positionAttributeLocation);
    gl.vertexAttribPointer(this.positionAttributeLocation, 3, GL_FLOAT, 0, 0, ptr(0));
    gl.drawArrays(GL_LINES, 0, count);
    gl.disableVertexAttribArray(this.positionAttributeLocation);
  }
  restoreState() {
    const gl = this.glFunctions;
    gl.bindBuffer(GL_ARRAY_BUFFER, 0);
    gl.bindVertexArray(0);
    gl.useProgram(0);
    gl.enable(GL_DEPTH_TEST);
    gl.depthMask(1);
  }
  compileShader(type, source) {
    const gl = this.glFunctions,
      shader = gl.createShader(type);
    if (!shader) return 0;
    const text = Memory.allocUtf8String(source),
      holder = Libc.malloc(8);
    holder.writePointer(text);
    gl.shaderSource(shader, 1, holder, NULL);
    gl.compileShader(shader);
    const status = Libc.malloc(4);
    gl.getShaderiv(shader, 35713, status);
    return status.readS32() ? shader : 0;
  }
}
GLOverlayBackend.VERTEX_SHADER =
  "#version 300 es\nin vec3 aPos;\nuniform mat4 uMVP;\nvoid main() { gl_Position = uMVP * vec4(aPos, 1.0); }";
GLOverlayBackend.FRAGMENT_SHADER =
  "#version 300 es\nprecision mediump float;\nuniform vec4 uColor;\nout vec4 fragColor;\nvoid main() { fragColor = uColor; }";
class GLOverlay {
  static addRenderer(name, callback) {
    RenderOverlay.addRenderer(name, callback);
  }
  static setDrawColor(r, g, b, a) {
    RenderOverlay.setDrawColor(r, g, b, a);
  }
  static drawLineSegment(x1, y1, z1, x2, y2, z2) {
    RenderOverlay.drawLineSegment(x1, y1, z1, x2, y2, z2);
  }
  static drawWireframeCube(x1, y1, z1, x2, y2, z2) {
    RenderOverlay.drawWireframeCube(x1, y1, z1, x2, y2, z2);
  }
  static patch() {
    RenderOverlay.patch();
  }
}
exports.GLOverlayBackend = GLOverlayBackend;
exports.GLOverlay = GLOverlay;
