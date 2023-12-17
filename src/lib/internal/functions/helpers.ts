/**
 * @external
 */ /** */

import repeat from "lodash/repeat";

/**
 * Recursively applies join to an array of arrays.
 * @param arr
 */
type StringOrArray = string | StringOrArray[];

/**
 * Some simple helpers for working with strings.
 */
export const StringHelpers = {
    recJoin(arr: StringOrArray): string {
        if (arr instanceof Array) {
            return arr.map(x => this.recJoin(x)).join("");
        } else {
            return String(arr);
        }
    }
};

/**
 * Helpers for working with numbers.
 */
export const NumHelpers = {
    /**
     * Pads an integer with characters.
     * @param n
     * @param digits
     * @param char
     */
    padInt(n: number, digits: number, char: string) {
        const str = n.toString();
        if (str.length >= digits) return str;
        return repeat(char, digits - str.length) + str;
    }
};
