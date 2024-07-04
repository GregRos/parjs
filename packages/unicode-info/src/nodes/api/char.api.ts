import type { Seq } from "stdseq";
import { UnicodeGraph } from "./graph.api.js";
import type { UnicodeProperty } from "./prop.api.js";
import type { UnicodeScriptxValue } from "./scriptx.api.js";
import { DataFlags, StandardPropNames, TypeName, type IfHasData } from "./shared.api.js";
import { UnicodeValue } from "./value.api.js";
export type CharFormats = "hex" | "char" | "decimal" | "escape" | "long";

/** A character object that represents a Unicode character. */
export type UnicodeCharacter<Flags extends DataFlags> = {
    /** The {@link UnicodeGraph} that contains this character. */
    readonly graph: UnicodeGraph<Flags>;
    /** The codepoint. */
    readonly code: number;
    /** Gets all property values for this character. */
    get values(): Seq<UnicodeValue<Flags, "string">>;
    /** Gets the script property value for this character. */
    readonly script: UnicodeValue<Flags, "string">;
    /** Gets all the scripts this character is in, querying both Script and Script_Extensions. */
    readonly scriptx: Seq<UnicodeScriptxValue<Flags>>;
    /** Gets the block property value for this character. */
    readonly block: UnicodeValue<Flags, "string">;
    /** Gets the General Category property value for this character. */
    readonly category: UnicodeValue<Flags, "string">;
    /** Gets the character as a string. */
    readonly string: string;
    valueOf(): string;
    /**
     * Returns a string representation of the character, using a configurable format.
     *
     * @param format The format to use.
     */
    toString(format?: CharFormats): string;
    /**
     * Determines if this character is equal to the given character or codepoint.
     *
     * @param char The character or codepoint to compare.
     */
    is(char: UnicodeCharacter<any> | number): boolean;
    /** Returns a string representation of the character, using a default format. */
    toString(): string;
    value(name: StandardPropNames, type?: "string"): UnicodeValue<Flags, "string"> | undefined;
} & IfHasData<
    Flags,
    "char:name",
    {
        /** If available, the name of the character. Some characters have generated names. */
        readonly title: string;
    }
> &
    IfHasData<
        Flags,
        "props:ucd",
        {
            /**
             * Given a property, get the value of that property for this character.
             *
             * @param property The name of the property or a {@link UnicodeProperty} object.
             * @param type The expected type of the property.
             */
            value<Type extends TypeName = TypeName>(
                property: string | UnicodeProperty<Flags, Type>,
                type?: Type
            ): UnicodeValue<Flags, Type> | undefined;
        },
        {}
    >;
