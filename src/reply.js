"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Namespace that contains the different reply kinds/error levels.
 */
var ReplyKind;
(function (ReplyKind) {
    /**
     * An Unknown reply.
     */
    ReplyKind.Unknown = "Unknown";
    /**
     * An OK reply.
     */
    ReplyKind.OK = "OK";
    /**
     * A soft failure reply.
     */
    ReplyKind.SoftFail = "SoftFail";
    /**
     * A hard failure reply.
     */
    ReplyKind.HardFail = "HardFail";
    /**
     * A fatal failure reply.
     */
    ReplyKind.FatalFail = "FatalFail";
})(ReplyKind = exports.ReplyKind || (exports.ReplyKind = {}));
//# sourceMappingURL=reply.js.map