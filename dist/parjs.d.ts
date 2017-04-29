/**
 * @module parjs
 */ /** */
import { LoudParser, ParjsPredicate } from "./loud";
import { FloatOptions } from "./internal/implementation/parsers/numbers/float";
import { IntOptions } from "./internal/implementation/parsers/numbers/int";
import { QuietParser } from "./quiet";
import { AnyParser } from "./any";
import { ReplyKind } from "./reply";
import { AnyParserAction } from "./internal/action";
export interface ParjsStaticHelper {
    isParser(obj: any): obj is AnyParser;
    isParserAction(obj: any): obj is AnyParserAction;
}
export interface ParjsStatic {
    readonly helper: ParjsStaticHelper;
    /**
     * P parses a single character. Equivalent to:
     */
    readonly anyChar: LoudParser<string>;
    /**
     * P parses a single character that is part of the string {chars}.
     * @param chars The characters to match.
     */
    anyCharOf(chars: string): LoudParser<string>;
    /**
     * P parses a single character that is not part of {chars}.
     * @param chars The characters not to match.
     */
    noCharOf(chars: string): LoudParser<string>;
    /**
     * P parses a single character that matches the predicate.
     * Equivalent to: Parjs.anyChar.require(predicate)
     * @param predicate The predicate the character must match.
     */
    charWhere(predicate: ParjsPredicate<string>): LoudParser<string>;
    /**
     * P Parses a single digit character [0-9]. Returns the parsed character.
     */
    readonly digit: LoudParser<string>;
    /**
     * P Parses a single hex digit character [0-9a-fA-F]. Returns the parsed character.
     */
    readonly hex: LoudParser<string>;
    /**
     * P parses a single lower-case letter character in the range [a-z]
     */
    readonly asciiLower: LoudParser<string>;
    /**
     * Parses a single letter [a-zA-Z]
     */
    readonly asciiLetter: LoudParser<string>;
    /**
     * P parses a single upper-case letter character in the range [A-Z].
     */
    readonly asciiUpper: LoudParser<string>;
    /**
     * P Parses either \n, \r\n, or \r and returns the string that was parsed.
     */
    readonly newline: LoudParser<string>;
    /**
     * Parses a single Unicode newline string, including characters as \u2029 (PARAGRAPH SEPARATOR) that may indicate newlines. Returns the string that was parsed.
     */
    readonly unicodeNewline: LoudParser<string>;
    /**
     * P parses one ASCII inline space character, such as space or a tab.
     */
    readonly space: LoudParser<string>;
    /**
     * P parses one Unicode inline space character, including characters such as EM SPACE, and returns the character that was parsed.
     */
    readonly unicodeSpace: LoudParser<string>;
    int(options?: IntOptions): LoudParser<number>;
    float(options?: FloatOptions): LoudParser<number>;
    /**
     * P succeeds without consuming input and returns the given value.
     * @param result The value to return.
     */
    result<T>(result: T): LoudParser<T>;
    /**
     * P succeeds without consuming input. Quiet parser.
     */
    readonly nop: QuietParser;
    /**
     * P succeeds there are no more characters to parse.
     */
    readonly eof: QuietParser;
    /**
     * P fails for any input.
     */
    fail(expecting?: string, kind?: ReplyKind.Fail): LoudParser<any>;
    /**
     * P succeeds without consuming input and returns the current position in the input.
     */
    readonly position: LoudParser<number>;
    /**
     * P succeeds without consuming input and returns the current user state.
     */
    readonly state: LoudParser<any>;
    /**
     * P parses as many ASCII whitespace characters as possible, including any number of spaces, tabs, and newlines. Returns the parsed text.
     *
     */
    readonly spaces: LoudParser<string>;
    /**
     * P parses one or more spaces and returns the result.
     */
    readonly spaces1: LoudParser<string>;
    /**
     * P parses as many Unicode inline white spaces as possible. Returns the parsed text.
     */
    readonly unicodeSpaces: LoudParser<string>;
    /**
     * P parses the remaining characters in the input until eof and returns the resulting string.
     * Never fails.
     */
    readonly rest: LoudParser<string>;
    /**
     * P tries to parse the string {str} and returns it.
     * @param str The string to parse.
     */
    string(str: string): LoudParser<string>;
    /**
     * P tries to parse the strings in {strings}, and returns the first one that succeeds.. Equivalent to:
     * Parjs.any(strings.map(Parjs.string));
     * @param strings The strings.
     */
    anyStringOf(...strings: string[]): LoudParser<string>;
    /**
     * P parses exactly {length} characters and returns the string that was parsed.
     * Fails if end of input is reached before {length} characters are parsed.
     * Equivalent to: Parjs.anyChar.exactly(length).str
     * @param length The number of characters to parse.
     */
    stringLen(length: number): LoudParser<string>;
    /**
     * P applies the regexp {regexp} starting at the current position. P consumes all the text from the current position to the end of the match.
     * The regexp starts matching at the current position.
     * Returns the resulting match array, with return[0] being the entire match and return[n] being group n.
     * @param regexp The regexp to apply.
     */
    regexp(regexp: RegExp): LoudParser<string[]>;
    /**
     * The first time P is invoked, it calls {resolver} with no arguments and caches the result. From that point, it acts like the parser returned by {resolver}.
     * This can be used to create certain kinds of recursive parsers.
     *
     * @param resolver
     */
    late<T>(resolver: () => LoudParser<T>): LoudParser<T>;
    /**
     * P tries the given parsers, one after the other, and returns the value of the first one that succeeds.
     * @param pars The parsers.
     */
    any(...pars: LoudParser<any>[]): LoudParser<any>;
    /**
     * P tries the given parsers, one after the other.
     * @param pars The quiet parsers to try.
     */
    any(...pars: QuietParser[]): QuietParser;
    /**
     * P applies the specified parsers in sequence and returns the results in an array.
     * @param parsers The parser sequence.
     */
    seq(...parsers: AnyParser[]): LoudParser<any[]>;
}
