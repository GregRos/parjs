/**
 * @module parjs/internal/implementation/functions
 */ /** */

import repeat from "lodash/repeat";


/**
 * Some simple helpers for working with strings.
 */
export namespace StringHelpers {
    /**
     * Recursively applies join to an array of arrays.
     * @param arr
     */
    export function recJoin(arr: any): string {
        if (arr instanceof Array) {
            return arr.map(x => this.recJoin(x)).join("");
        } else {
            return String(arr);
        }
    }

    /**
     * Splices a string.
     * @param target
     * @param where
     * @param what
     */
    export function splice(target: string, where: number, what: string) {
        let start = target.slice(0, where);
        let end = target.slice(where);
        return start + what + end;
    }

}

/**
 * Helpers for working with numbers.
 */
export namespace NumHelpers {
    /**
     * Pads an integer with characters.
     * @param n
     * @param digits
     * @param char
     */
    export function padInt(n: number, digits: number, char: string) {
        let str = n.toString();
        if (str.length >= digits) return str;
        return repeat(char, digits - str.length) + str;
    }
}
