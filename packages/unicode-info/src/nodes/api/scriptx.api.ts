import type { Seq } from "stdseq";
import type { UnicodeCharacter } from "./char.api.js";
import type { UnicodeGraph } from "./graph.api.js";
import { DataFlags, type UniCharInput } from "./shared.api.js";
/** A property object that represents the Unicode */
export interface UnicodeScriptxProperty<Flags extends DataFlags> {
    readonly graph: UnicodeGraph<Flags>;
    readonly names: Seq<string>;
    toString(): string;
    script(name: string): UnicodeScriptxValue<Flags>;
    scriptFor(char: UniCharInput): UnicodeScriptxValue<Flags> | undefined;
    scriptsFor(char: UniCharInput): Seq<UnicodeScriptxValue<Flags>>;
    get scripts(): Seq<UnicodeScriptxValue<Flags>>;
}

export interface UnicodeScriptxValue<Flags extends DataFlags>
    extends Iterable<UnicodeCharacter<Flags>> {
    readonly property: UnicodeScriptxProperty<Flags>;
    readonly names: Seq<string>;
    readonly shortLabel: string;
    readonly longLabel: string;
    toString(): string;
    has(codepoint: UniCharInput): boolean;
}
