/**
 * @module parjs/internal/implementation/functions
 */ /** */

import _ = require('lodash');
export namespace FastMath {
    export const PositiveExponents = _.range(0, 36).map(b => b < 2 ? [] : _.range(0, 256).map(e => Math.pow(b, e)));
    export const NegativeExponents = _.range(0, 36).map(b => b < 2 ? [] : _.range(1, 256).map(n => Math.pow(b, -n)));
}