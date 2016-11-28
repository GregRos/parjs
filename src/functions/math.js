"use strict";
/**
 * Created by User on 28-Nov-16.
 */
var _ = require('lodash');
var FastMath;
(function (FastMath) {
    FastMath.PositiveExponents = _.range(0, 256).map(function (n) { return Math.pow(10, n); });
    FastMath.NegativeExponents = _.range(0, 256).map(function (n) { return Math.pow(10, -n); });
})(FastMath = exports.FastMath || (exports.FastMath = {}));
//# sourceMappingURL=math.js.map