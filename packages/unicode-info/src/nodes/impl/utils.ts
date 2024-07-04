import { seq, type SeqLike } from "stdseq";
import type { UniCharInput } from "./shared.impl.js";

export function normalizeString<T>(v: T): T {
    if (typeof v === "string") {
        v = v.toLowerCase().replaceAll(" ", "_").replaceAll("-", "_") as any;
    }

    return v;
}

export function getShortest(names: SeqLike<any>) {
    return seq(names)
        .map(x => `${x}`)
        .minBy(x => x.length)
        .pull()!;
}

export function getLongest(names: SeqLike<any>) {
    return seq(names)
        .map(x => `${x}`)
        .maxBy(x => x.length)
        .pull()!;
}

export function normalizeToCodepoint(char: UniCharInput) {
    if (typeof char === "string") {
        if (char.length <= 2) {
            return char.codePointAt(0)!;
        }
        if (char.toLowerCase().startsWith("u+")) {
            return parseInt(char.slice(2), 16);
        }
        throw new Error(`Unknown character format: ${char}`);
    }
    if (typeof char === "object") {
        return char.code;
    }
    return char;
}

export function isUnsupportedPropertyName(name: string | Iterable<string>) {
    if (typeof name !== "string") {
        return seq(name).some(isUnsupportedPropertyName).pull();
    }
    if (name.startsWith("cjk")) {
        return true;
    }
    if (name.includes("case_")) {
        return true;
    }
    if (name.includes("bidi")) {
        return true;
    }
    if (name.includes("joining")) {
        return true;
    }
    if (name.startsWith("xo_")) {
        return true;
    }
    return false;
}
