import type { Range } from "@unicode-info/parser";
import type { Seq } from "stdseq";
import { UnicodeCharacter } from "./char.api.js";
import { UnicodeGraph } from "./graph.api.js";
import { UnicodeProperty } from "./prop.api.js";
import { DataFlags, TypeName, getPropValue, type UniCharInput } from "./shared.api.js";

/** A base object representing either {@see UnicodeValue} or {@see UnicodeValueUnion}. */
export interface UnicodeBaseValue<Flags extends DataFlags, Type extends TypeName>
    extends Iterable<UnicodeCharacter<Flags>> {
    /** The {@link UnicodeGraph} of this value. */
    readonly graph: UnicodeGraph<Flags>;

    /** The codepoint ranges that have this value. */
    readonly ranges: Seq<Range>;
    /** The shortest value of the property as a string. */
    readonly shortLabel: string;
    /** The longest value of the property as a string. */
    readonly longLabel: string;
    /**
     * Checks whether this value is an instance of another value. This is a subsetOf operation.
     *
     * @param value Another {@link UnicodeValue} object, a string label, or a value of the same type.
     */
    subsetOf(value: string | getPropValue<Type> | UnicodeBaseValue<Flags, Type>): boolean;
    /** Returns a string representation of the value. */
    toString(): string;
    /**
     * Checks if the given codepoint or character object has this value.
     *
     * @param codepoint
     */
    has(codepoint: UniCharInput): boolean;
}
/**
 * An object representing the value of a Unicode property, `@PropertyName=Value`, and all characters
 * with that value.
 */
export interface UnicodeValue<Flags extends DataFlags, Type extends TypeName>
    extends UnicodeBaseValue<Flags, Type> {
    /** The aliases and alternative values for this property. */
    readonly values: Seq<getPropValue<Type>>;
    /** The property of this value. */
    readonly property: UnicodeProperty<Flags, Type>;
}

export interface UnicodeValueUnion<Flags extends DataFlags, Type extends TypeName>
    extends UnicodeBaseValue<Flags, Type> {
    /** The property of this value. */
    readonly property: UnicodeProperty<Flags, Type>;
}
