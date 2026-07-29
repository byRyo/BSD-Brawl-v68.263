// @ts-nocheck
const { Libc } = require("../../lib/Libc");
const { RenderOverlay } = require("./RenderOverlay");
const { Logcat } = require("../debug/Logcat");
const MTL_VERTEX_FORMAT_FLOAT3 = 30,
  MTL_PIXEL_FORMAT_BGRA8_UNORM = 80,
  MTL_PRIMITIVE_TYPE_LINE = 1;
const METAL_SOURCE = `
#include <metal_stdlib>
using namespace metal;
struct VertexIn { float3 position [[attribute(0)]]; };
struct Uniforms { float4x4 mvp; float4 color; };
struct VertexOut { float4 position [[position]]; };
vertex VertexOut vertex_main(VertexIn in [[stage_in]], constant Uniforms &u [[buffer(1)]]) {
    VertexOut out;
    out.position = u.mvp * float4(in.position, 1.0);
    return out;
}
fragment float4 fragment_main(VertexOut in [[stage_in]], constant Uniforms &u [[buffer(1)]]) {
    return u.color;
}
`;
class MetalOverlayBackend extends RenderOverlay {
  constructor(...args) {
    super(...args);
    this.device = null;
    this.pipelineState = null;
    this.commandQueue = null;
    this.uniformBuf = null;
    this.encoder = null;
    this.ownCmdBuf = null;
    this.currentFbPtr = NULL;
    this.gameCmdBufPtr = NULL;
    this.cachedTexture = null;
  }
  setupHooks() {
    this.setupBattleHooks();
    Logcat.logInfo(
      "[MetalOverlay] hooks attached (render paused — Metal validation issue on Playcover)",
    );
  }
  initializeGPU() {
    try {
      if (typeof ObjC === "undefined" || !ObjC.available) {
        Logcat.logError("[MetalOverlay] ObjC not available");
        return false;
      }
      const createDevice = new NativeFunction(
        Module.findExportByName("Metal", "MTLCreateSystemDefaultDevice"),
        "pointer",
        [],
      );
      this.device = new ObjC.Object(createDevice());
      if (!this.device) {
        Logcat.logError("[MetalOverlay] no MTLDevice");
        return false;
      }
      const errorOut = Libc.malloc(Process.pointerSize);
      errorOut.writePointer(NULL);
      const library = this.device.newLibraryWithSource_options_error_(
        ObjC.classes.NSString.stringWithString_(METAL_SOURCE),
        NULL,
        errorOut,
      );
      if (!library) {
        Logcat.logError(
          `[MetalOverlay] shader compile: ${new ObjC.Object(errorOut.readPointer()).localizedDescription()}`,
        );
        return false;
      }
      const vertex = library.newFunctionWithName_("vertex_main"),
        fragment = library.newFunctionWithName_("fragment_main");
      if (!vertex || !fragment) {
        Logcat.logError("[MetalOverlay] shader functions not found");
        return false;
      }
      const descriptor = ObjC.classes.MTLRenderPipelineDescriptor.alloc().init();
      descriptor.setVertexFunction_(vertex);
      descriptor.setFragmentFunction_(fragment);
      const vertexDescriptor = ObjC.classes.MTLVertexDescriptor.vertexDescriptor(),
        attribute = vertexDescriptor.attributes().objectAtIndexedSubscript_(0);
      attribute.setFormat_(MTL_VERTEX_FORMAT_FLOAT3);
      attribute.setOffset_(0);
      attribute.setBufferIndex_(0);
      vertexDescriptor.layouts().objectAtIndexedSubscript_(0).setStride_(12);
      descriptor.setVertexDescriptor_(vertexDescriptor);
      descriptor
        .colorAttachments()
        .objectAtIndexedSubscript_(0)
        .setPixelFormat_(MTL_PIXEL_FORMAT_BGRA8_UNORM);
      descriptor.setDepthAttachmentPixelFormat_(0);
      descriptor.setStencilAttachmentPixelFormat_(0);
      errorOut.writePointer(NULL);
      this.pipelineState = this.device.newRenderPipelineStateWithDescriptor_error_(
        descriptor,
        errorOut,
      );
      if (!this.pipelineState) {
        Logcat.logError(
          `[MetalOverlay] pipeline: ${new ObjC.Object(errorOut.readPointer()).localizedDescription()}`,
        );
        return false;
      }
      this.commandQueue = this.device.newCommandQueue();
      this.uniformBuf = this.device.newBufferWithLength_options_(80, 0);
      this.isInitialized = true;
      Logcat.logInfo("[MetalOverlay] GPU initialized");
      return true;
    } catch (error) {
      Logcat.logError(`[MetalOverlay] init failed: ${error.stack || error.message || error}`);
      return false;
    }
  }
  saveAndPrepareState(mvp) {
    try {
      if (!this.cachedTexture || this.gameCmdBufPtr.isNull()) return;
      const queue = new ObjC.Object(this.gameCmdBufPtr).commandQueue();
      if (!queue) return;
      const pass = ObjC.classes.MTLRenderPassDescriptor.renderPassDescriptor(),
        color = pass.colorAttachments().objectAtIndexedSubscript_(0);
      color.setTexture_(this.cachedTexture);
      color.setLoadAction_(2);
      color.setStoreAction_(1);
      this.ownCmdBuf = queue.commandBuffer();
      if (!this.ownCmdBuf) return;
      this.encoder = this.ownCmdBuf.renderCommandEncoderWithDescriptor_(pass);
      if (!this.encoder) return;
      this.encoder.setRenderPipelineState_(this.pipelineState);
      const contents = this.uniformBuf.contents();
      Memory.copy(contents, mvp, 64);
      this.encoder.setVertexBuffer_offset_atIndex_(this.uniformBuf, 0, 1);
      this.encoder.setFragmentBuffer_offset_atIndex_(this.uniformBuf, 0, 1);
    } catch (_) {
      this.encoder = null;
      this.ownCmdBuf = null;
    }
  }
  setColorUniform(r, g, b, a) {
    if (!this.uniformBuf || !this.encoder) return;
    const data = this.uniformBuf.contents();
    data.add(64).writeFloat(r);
    data.add(68).writeFloat(g);
    data.add(72).writeFloat(b);
    data.add(76).writeFloat(a);
  }
  uploadAndDrawLines(vertices, count) {
    if (!this.encoder || !this.device) return;
    try {
      const buffer = this.device.newBufferWithBytes_length_options_(vertices, count * 12, 0);
      if (!buffer) return;
      this.encoder.setVertexBuffer_offset_atIndex_(buffer, 0, 0);
      this.encoder.drawPrimitives_vertexStart_vertexCount_(MTL_PRIMITIVE_TYPE_LINE, 0, count);
    } catch (_) {}
  }
  restoreState() {
    if (this.encoder) {
      try {
        this.encoder.endEncoding();
      } catch (_) {}
      this.encoder = null;
    }
  }
}
exports.MetalOverlayBackend = MetalOverlayBackend;
