"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VolumeTransformer_1 = require("./VoiceInterface/VolumeTransformer");
try {
    // eslint-disable-next-line
    const mod = require("prism-media");
    if (typeof mod.VolumeTransformer.hasSmoothing !== "boolean") {
        Reflect.set(mod, "VolumeTransformer", VolumeTransformer_1.VolumeTransformer);
    }
}
catch {
    /* do nothing */
}
