/**
 * @module parjs/internal/implementation/functions
 */ /** */

import _range = require('lodash/range');
export namespace FastMath {
    export const PositiveExponents = _range(0, 36).map(b => b < 2 ? [] : _range(0, 256).map(e => Math.pow(b, e)));
    export const NegativeExponents = _range(0, 36).map(b => b < 2 ? [] : _range(1, 256).map(n => Math.pow(b, -n)));
}