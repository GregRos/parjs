import type { Seq } from "stdseq";
import { UnicodeCharacter } from "./char.api.js";
import { UnicodeProperty } from "./prop.api.js";
import type { UnicodeScriptxProperty } from "./scriptx.api.js";
import {
    DataFlags,
    StandardPropNames,
    TypeName,
    type IfHasData,
    type UniCharInput
} from "./shared.api.js";

export type UnicodeGraph<Flags extends DataFlags> = {
    /** Gets the properties that are available in this graph. */
    readonly props: Seq<UnicodeProperty<Flags, TypeName>>;
    /**
     * Checks if the graph has a given data flag.
     *
     * @param flag The data flag to check.
     */
    hasDataFlag(flag: DataFlags): boolean;
    /**
     * Gets a character object for the given codepoint.
     *
     * @param codepoint The codepoint of the character.
     */
    char(codepoint: UniCharInput): UnicodeCharacter<Flags>;
    /** Gets the block property of this graph. */
    readonly block: UnicodeProperty<Flags, "string">;

    /** Gets the category property of this graph. */
    readonly category: UnicodeProperty<Flags, "string">;
    /** Gets the script property of this graph. */
    readonly script: UnicodeProperty<Flags, "string">;

    readonly scriptx: UnicodeScriptxProperty<Flags>;
    /** Gets an iterable of all characters in this graph. */
    get chars(): Seq<UnicodeCharacter<Flags>>;
    /** Gets a string representation of the graph. */
    toString(): string;
    /**
     * Gets a basic property object matching the given name.
     *
     * @param name The name of the property.
     * @param _ Must be `"string"` if provided.
     */
    prop(name: StandardPropNames, _?: "string"): UnicodeProperty<Flags, "string">;
} & IfHasData<
    Flags,
    "props:ucd",
    {
        /**
         * Gets a property object matching the given name.
         *
         * @param name The name of the property.
         * @param type The expected type of the property.
         */
        prop<Type extends TypeName = TypeName>(
            name: string,
            type?: Type
        ): UnicodeProperty<Flags, Type>;
    },
    {}
>;
