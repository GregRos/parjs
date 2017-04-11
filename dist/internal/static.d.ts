/**
 * @module parjs/internal
 */ /** */
import { ParjsParser } from "./instance";
import { AnyParser } from "../any";
import { ReplyKind } from "../reply";
import { IntOptions } from "./implementation/parsers/numbers/int";
import { FloatOptions } from "./implementation/parsers/numbers/float";
import { LoudParser } from "../loud";
import { ParjsStatic } from "../parjs";
export declare class ParjsParsers implements ParjsStatic {
    readonly spaces1: ParjsParser;
    late<T>(resolver: () => LoudParser<T>): LoudParser<T>;
    readonly asciiLetter: ParjsParser;
    any(...parsers: AnyParser[]): ParjsParser;
    seq(...parsers: AnyParser[]): ParjsParser;
    readonly anyChar: ParjsParser;
    charWhere(predicate: (char: string) => boolean, property?: string): ParjsParser;
    anyCharOf(options: string): ParjsParser;
    noCharOf(options: string): ParjsParser;
    readonly digit: ParjsParser;
    readonly hex: ParjsParser;
    readonly asciiLower: ParjsParser;
    readonly asciiUpper: ParjsParser;
    readonly newline: ParjsParser;
    readonly unicodeNewline: ParjsParser;
    readonly space: ParjsParser;
    readonly unicodeSpace: ParjsParser;
    readonly spaces: ParjsParser;
    readonly unicodeSpaces: ParjsParser;
    readonly nop: ParjsParser;
    readonly rest: ParjsParser;
    string(str: string): ParjsParser;
    anyStringOf(...strs: string[]): ParjsParser;
    stringLen(length: number): ParjsParser;
    regexp(regex: RegExp): ParjsParser;
    result(x: any): ParjsParser;
    readonly eof: ParjsParser;
    fail(expecting?: string, kind?: ReplyKind.Fail): ParjsParser;
    readonly position: ParjsParser;
    readonly state: ParjsParser;
    int(options?: IntOptions): ParjsParser;
    float(options?: FloatOptions): ParjsParser;
}
