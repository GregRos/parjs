/**
 * Created by User on 28-Nov-16.
 */
import _ = require('lodash');
export namespace FastMath {
    export const PositiveExponents = _.range(0, 256).map(n => Math.pow(10, n));
    export const NegativeExponents = _.range(0, 256).map(n => Math.pow(10, -n));
}