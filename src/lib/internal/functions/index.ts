/**
 * Recursively applies join to an array of arrays.
 *
 * @param arr
 */
type StringOrArray = string | StringOrArray[];

export function recJoin(arr: StringOrArray): string {
    if (arr instanceof Array) {
        return arr.map(x => recJoin(x)).join("");
    } else {
        return String(arr);
    }
}

export function padInt(n: number, digits: number, char: string) {
    const str = n.toString();
    if (str.length >= digits) return str;
    return char.repeat(digits - str.length) + str;
}
