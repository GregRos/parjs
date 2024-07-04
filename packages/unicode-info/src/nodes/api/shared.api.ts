import type { UnicodeCharacter } from "./char.api.js";

export type TypeName = "string" | "number" | "boolean";
export type getPropValue<T extends TypeName | "boolean"> = T extends "string"
    ? string
    : T extends "number"
      ? number
      : T extends "boolean"
        ? boolean
        : never;
export type DataFlags = "props:ucd" | "char:prop:val" | "char:name" | "props:emoji";
export type StandardPropNames = "script" | "scriptx" | "block" | "category";
export type getPossiblePropNames<Flags extends DataFlags> = "props:ucd" extends Flags
    ? StandardPropNames
    : string;

export type IfHasData<Input, Query extends DataFlags, IfTrue, IfFalse = {}> = Query extends Input
    ? IfTrue
    : IfFalse;

export type UniCharInput = number | UnicodeCharacter<any> | string;
