/**
 * @module parjs/internal/implementation/functions
 */
/** */

export namespace Predicates {
    export function nonEmpty(x: any) {
        if (x === undefined || x === null || x === "") {
            return false;
        }
        if (x instanceof Array) {
            return x.length > 0;
        }
        let proto = Object.getPrototypeOf(x);
        if (proto === Object.prototype || !proto) {
            return Object.getOwnPropertyNames(x).length > 0;
        }
        return true;
    }
}
