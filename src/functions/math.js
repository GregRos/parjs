"use strict";
/**
 * Created by User on 28-Nov-16.
 */
var _ = require("lodash");
var FastMath;
(function (FastMath) {
    FastMath.PositiveExponents = _.range(0, 36).map(function (b) { return b < 2 ? [] : _.range(0, 256).map(function (e) { return Math.pow(b, e); }); });
    FastMath.NegativeExponents = _.range(0, 36).map(function (b) { return b < 2 ? [] : _.range(1, 256).map(function (n) { return Math.pow(b, -n); }); });
})(FastMath = exports.FastMath || (exports.FastMath = {}));
//# sourceMappingURL=math.js.map