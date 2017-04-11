/**
 * @module parjs/internal/implementation/functions
 */ /** */

export namespace StringHelpers {
    export function recJoin(arr : any) : string {
    if (arr instanceof Array) {
        return arr.map(x => this.recJoin(x)).join("")
    } else {
        return String(arr);
    }
}
}