import { JanusDiceLab } from "../JanusDiceLab.js";

// Compatibility export for any existing page that still imports DiceLab3D.
export function DiceLab3D(options) {
  return JanusDiceLab(options);
}

export { JanusDiceLab };
