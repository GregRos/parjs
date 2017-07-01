"use strict";
/**
 * @module parjs/internal/implementation/functions
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
const _range = require("lodash/range");
var FastMath;
(function (FastMath) {
    FastMath.PositiveExponents = _range(0, 36).map(b => b < 2 ? [] : _range(0, 256).map(e => Math.pow(b, e)));
    FastMath.NegativeExponents = _range(0, 36).map(b => b < 2 ? [] : _range(1, 256).map(n => Math.pow(b, -n)));
})(FastMath = exports.FastMath || (exports.FastMath = {}));
//# sourceMappingURL=math.js.map