import type { Seq } from "stdseq";
import { UnicodeCharacter } from "./char.api.js";
import { UnicodeGraph } from "./graph.api.js";
import { DataFlags, TypeName, getPropValue, type UniCharInput } from "./shared.api.js";
import { UnicodeValue } from "./value.api.js";

/** A property object that represents a Unicode property. */
export type UnicodeProperty<Flags extends DataFlags, Type extends TypeName> = {
    /** Gets the {@link UnicodeGraph} that contains this property. */
    readonly graph: UnicodeGraph<Flags>;
    /** The type of the property, one of the {@link TypeName} values. */
    readonly type: Type;
    /** An array with all the names and aliases of the property. */
    readonly names: Seq<string>;
    /** The longest name for the property. */
    readonly longName: string;
    /** The shortest name for the property. */
    readonly shortName: string;
    /** Returns a string representation of the property. */
    toString(): string;

    /**
     * Gets the {@link UnicodeValue} object matching the given value.
     *
     * @param value
     */
    getValue(value: getPropValue<Type>): UnicodeValue<Flags, Type>;
    /**
     * Gets the {@link UnicodeValue} object matching the given value, if it exists, or `undefined`
     * otherwise.
     *
     * @param value The value to get.
     */
    tryGetvalue(value: getPropValue<Type>): UnicodeValue<Flags, Type> | undefined;
    /**
     * Gets the property's value, as a {@link UnicodeValue}, for the given character.
     *
     * @param char
     */
    getValueFor(char: UniCharInput): UnicodeValue<Flags, Type> | undefined;

    /** @param char */
    tryGetValueFor(char: UniCharInput): UnicodeValue<Flags, Type> | undefined;

    get values(): Seq<UnicodeValue<Flags, Type>>;

    /** Returns an iterable of all characters that have this property. */
    get chars(): Seq<[UnicodeCharacter<Flags>, UnicodeValue<Flags, Type>]>;
};
