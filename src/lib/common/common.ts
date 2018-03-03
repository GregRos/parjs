/** @private */ /** */

export module Es6 {
    export function strIncludes(haystack : string, needle : string) {
        return haystack.indexOf(needle) >= 0;
    }

    export function arrIncludes(arr : any[], v : any) {
        return arr.indexOf(v) >= 0;
    }

    export function strRepeat(what : string, num : number) {
        let result = "";
        for (let i = 0; i < num; i++) {
            result += what;
        }
        return result;
    }

    export function regexFlags(regex : RegExp) {
        let flags=  "";
        if (regex.global) flags += "g";
        if (regex.ignoreCase) flags += "i";
        if (regex.multiline) flags += "m";
        return flags;
    }
}