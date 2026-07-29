// @ts-nocheck
"use strict";

import { Attestation } from "../../laser/titan/protection/Attestation";
import { EDebugger } from "../debug/EDebugger";

export class IntegrityControl {
  static test() {
    Attestation.isPatched ||
      EDebugger.addMessage(
        EDebugger.ERROR,
        "Attestation is not patched! Immediately abort logging in if using main account!",
      );
  }
}
