// @ts-nocheck
class EccDigest {
  static patch() {
    const base = Process.getModuleByName("libg.so").base;
    const digestFunction = base.add(0x4e70b4);

    Interceptor.replace(digestFunction, new NativeCallback(() => 0x78167189, "uint32", []));
  }
}

exports.EccDigest = EccDigest;
