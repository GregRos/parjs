/**
 * @module parjs/internal/implementation/functions
 */ /** */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
var FastMath;
(function (FastMath) {
    FastMath.PositiveExponents = _.range(0, 36).map(b => b < 2 ? [] : _.range(0, 256).map(e => Math.pow(b, e)));
    FastMath.NegativeExponents = _.range(0, 36).map(b => b < 2 ? [] : _.range(1, 256).map(n => Math.pow(b, -n)));
})(FastMath = exports.FastMath || (exports.FastMath = {}));

//# sourceMappingURL=math.js.map
