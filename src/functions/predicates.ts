/**
 * Created by lifeg on 07/12/2016.
 */

export class _PredicatesType {
    nonEmpty(x: any) {
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

export const Predicates = new _PredicatesType();