import type { Range } from "@unimatch/parser";
import type { Seq } from "stdseq";
export type TypeName = "string" | "number" | "boolean";
export type getPropValue<T extends TypeName | "boolean"> = T extends "string"
    ? string
    : T extends "number"
      ? number
      : T extends "boolean"
        ? boolean
        : never;
export namespace Data {
    export type Min = never;
    export type CharName = "Char.Name";
    export type PropsUCD = "Props.UCD";
    export type PropsUnihan = "Props.Unihan";
    export type CharProps = "Char.Props";
    export type PropChars = "Prop.Chars";
    export type Max = CharName | PropsUCD | PropChars | CharProps;
}
export type StandardPropNames = "Script" | "Block" | "Category";
export type getPossiblePropNames<Level extends Data.Max> = Data.PropsUCD extends Level
    ? StandardPropNames
    : string;

export type Char<Level extends Data.Max> = {
    readonly root: UniGraph<Level>;
    readonly code: number;
    get values(): Seq<UniValue<Level, "string">>;
    readonly script: UniValue<Level, "string">;
    readonly block: UniValue<Level, "string">;
    readonly category: UniValue<Level, "string">;
    is(char: Char<any> | number): boolean;
    value<Type extends TypeName>(
        prop: UniProp<any, Type> | string
    ): UniValue<Level, Type> | undefined;

    has<Type extends TypeName>(name: string | UniProp<any, Type>): boolean;
} & Data.CharName extends Level
    ? { readonly title: string }
    : {} & Data.PropsUCD extends Level
      ? {
            get<Type extends TypeName = TypeName>(
                name: StandardPropNames,
                type?: Type
            ): UniValue<Level, Type> | undefined;
        }
      : {
            get(name: StandardPropNames): UniValue<Level, "string"> | undefined;
        };

export type UniGraph<Level extends Data.Max> = {
    readonly levels: Seq<Level>;
    readonly props: readonly UniProp<Level, TypeName>[];
    hasData(level: Level): boolean;
    char(codepoint: number): Char<Level>;
    readonly blocks: Seq<UniProp<Level, "string">>;
    readonly categories: Seq<UniProp<Level, "string">>;
    readonly scripts: Seq<UniProp<Level, "string">>;
    get chars(): Iterable<Char<Level>>;
} & Data.PropsUCD extends Level
    ? {
          prop<Type extends TypeName = TypeName>(name: string, type?: Type): UniProp<Level, Type>;
      }
    : {
          prop(name: StandardPropNames, x?: "string"): UniProp<Level, "string">;
      };

export type UniProp<Level extends Data.Max, Type extends TypeName> = {
    readonly root: UniGraph;
    readonly type: Type;
    readonly seqId: number;
    readonly name: string;
    readonly aliases: Iterable<string>;
    value(value: getPropValue<Type>): UniValue<Level, Type>;
    has(value: getPropValue<Type> | UniValue<any, Type> | Char<any> | number): boolean;
    readonly values: readonly UniValue<Level, Type>[];
    is(prop: UniProp<any, Type> | string): boolean;
    get chars(): Seq<[Char<Level>, UniValue<Level, Type>]>;
} & Data.PropChars extends Level
    ? {
          valueOf(char: Char<any> | number): UniValue<Level, Type> | undefined;
      }
    : {};

export type UniValue<Level extends Data.Max, Type extends TypeName> = {
    readonly root: UniGraph;
    readonly owner: UniProp<Level, Type>;
    readonly seqId: number;
    readonly ranges: Range[];
    has(char: Char<Level> | number): boolean;
    is(value: getPropValue<Type> | UniValue<Level, Type>): boolean;
    readonly chars: Seq<Char<Level>>;
} & Type extends "string"
    ? {
          readonly value: string;
          readonly alts: Iterable<string>;
      }
    : Type extends "number"
      ? {
            readonly value: number;
        }
      : Type extends "boolean"
        ? {}
        : never;
