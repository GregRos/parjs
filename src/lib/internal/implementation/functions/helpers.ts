/**
 * @module parjs/internal/implementation/functions
 */ /** */

 import {QUIET_RESULT} from "../special-results";


export namespace StringHelpers {
    export function recJoin(arr: any): string {
        if (arr instanceof Array) {
            return arr.map(x => this.recJoin(x)).join("")
        } else {
            return String(arr);
        }
    }

    export function splice(target : string, where : number, what : string) {
        let start = target.slice(0, where);
        let end = target.slice(where);
        return start + what + end;
    }

    export function takeLines(str : string, start : number, end : number) {
        let matchNewline = /\r\n|\n|\r/g;
        end = Math.min(str.length, end);
        start = Math.max(0, start);
        let rows = str.split(matchNewline).splice(start, end);
        return rows;
    }
}

export namespace NumHelpers {
    export function padInt(n : number, digits : number, char : string) {
        let str = n.toString();
        if (str.length >= digits) return str;
        return char.repeat(digits - str.length) + str;
    }
}

export namespace ArrayHelpers {
    export function maybePush<T>(arr : T[], what : T) {
        if (what !== QUIET_RESULT) {
            arr.push(what);
        }
    }
}