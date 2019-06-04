/**
 * @module parjs
 */
/** */
import {LoudParser, ParjsPredicate} from "./loud";
import {FloatOptions} from "./internal/implementation/parsers/numbers/float";
import {IntOptions} from "./internal/implementation/parsers/numbers/int";
import {QuietParser} from "./quiet";
import {AnyParser} from "./any";
import {ReplyKind} from "./reply";
import {AnyParserAction} from "./internal/action";
import {TraceVisualizer} from "./internal/visualizer";
import {UserState} from "./internal/implementation/state";
import {ImplicitAnyParser, ImplicitLoudParser} from "./convertible-literal";


/**
 * Helper methods for working with Parjs parsers.
 */
export interface ParjsStaticHelper {
    isParser(obj: any): obj is AnyParser;

    isParserAction(obj: any): obj is AnyParserAction;
}

/**
 * An object with one or more parser-valued properties. Each property specifies a parser to apply. Used by {@link ParjsStatic.seqObject}.
 */
export type ParserSpecification<Obj extends Record<string, any>> = {
    [key in keyof Obj]: ImplicitLoudParser<Obj[key]>
};

/**
 * Namespace for static combinators and building-block parsers.
 *
 * @group functional
 */
export interface ParjsStatic {

    /**
     * Helpers for working with Parjs parser objects.
     */
    readonly helper: ParjsStaticHelper;

    //++ INFRASTRUCTURE
    /**
     * Used to visualize parsing errors in plain-text.
     */
    visualizer: TraceVisualizer;

    //++ PARSERS

    /**
     * Returns a parser that will parse a single character and yield it.
     * @fail-type Softly
     * @group basic-parser character
     */
    readonly anyChar: LoudParser<string>;
    /**
     * Returns a parser that will parse a single digit character [0-9] and yield it.
     *
     * @group basic-parser character numeric
     * @fail-type Softly
     */
    readonly digit: LoudParser<string>;
    /**
     * Returns a parser that will parse a single hex digit character [0-9a-fA-F] and yield it.
     *
     * @group basic-parser character numeric
     * @fail-type Softly
     */
    readonly hex: LoudParser<string>;
    /**
     * Returns a parser that will parse a single lower-case letter character in the range [a-z] and yield it.
     *
     * @group basic-parser character
     * @fail-type Softly
     */
    readonly lower: LoudParser<string>;
    /**
     * Returns a parser that will parse a single letter [a-zA-Z] and yield it.
     *
     * @group basic-parser character
     * @fail-type Softly
     */
    readonly letter: LoudParser<string>;
    /**
     * Returns a parser that will parse a single upper-case letter character in the range [A-Z] and yield it.
     *
     * @group basic-parser character
     * @fail-type Softly
     */
    readonly upper: LoudParser<string>;
    /**
     * Returns a parser that will parse either \n, \r\n, or \r and yield the string that was parsed.
     *
     * @group basic-parser character
     * @fail-type Softly
     */
    readonly newline: LoudParser<string>;
    /**
     * Returns a parser that will parse a single Unicode newline string, including characters as \u2029 (PARAGRAPH SEPARATOR) that may indicate newlines. Returns the string that was parsed.
     *
     *
     * @group basic-parser character unicode
     * @requires module:parjs/unicode
     * @fail-type Softly
     */
    readonly uniNewline: LoudParser<string>;
    /**
     * Returns a parser that will parse a single Unicode lowercase character in any script or language. It will yield the string that was parsed.
     *
     * @group basic-parser character unicode
     * @requires module:parjs/unicode
     * @fail-type Softly
     */
    readonly uniLower: LoudParser<string>;
    /**
     * Returns a parser that will parse a single Unicode letter character in any script or language. It will yield the string that was parsed.
     *
     * @group basic-parser character unicode
     * @requires module:parjs/unicode
     * @fail-type Softly
     */
    readonly uniLetter: LoudParser<string>;
    /**
     * Returns a parser that will parse a single Unicode uppercase character in any script or language. It will yield the string that was parsed.
     *
     * @group basic-parser character unicode
     * @requires module:parjs/unicode
     * @fail-type Softly
     */
    readonly uniUpper: LoudParser<string>;
    /**
     * Returns a parser that will parse a single Unicode digit character in any script or language. It will yield the string that was parsed.
     *
     * @group basic-parser character unicode numeric
     * @requires module:parjs/unicode
     */
    readonly uniDigit: LoudParser<string>;
    /**
     * Returns a parser that will parse one ASCII inline space character, such as space or a tab, and yield it.
     *
     *
     * @group basic-parser character
     * @fail-type Softly
     *
     */
    readonly space: LoudParser<string>;
    /**
     * Returns a parser that will parse one Unicode inline space character, including characters such as EM SPACE, and yield the character that was parsed.
     *
     *
     * @group basic-parser character unicode
     * @requires module:parjs/unicode
     * @fail-type Softly
     */
    readonly uniSpace: LoudParser<string>;
    /**
     * Returns a parser that will succeed without consuming input. Quiet parser.
     *
     * @group basic-parser primitive
     * @fail-type Never
     */
    readonly nop: QuietParser;
    /**
     * Returns a parser that will succeed if it has reached the end of the input.
     *
     * @group basic-parser primitive
     * @fail-type Soft
     */
    readonly eof: QuietParser;
    /**
     * Returns a parser that will succeed without consuming input and yield the current position in the input.
     *
     * @group basic-parser primitive
     * @fail-type Never
     */
    readonly position: LoudParser<number>;
    /**
     * Returns a parser that will succeed without consuming input and yield the current user state.
     *
     * @group basic-parser primitive
     * @fail-type Never
     */
    readonly state: LoudParser<any>;
    /**
     * Returns a parser that will parse as many ASCII whitespace characters as possible, including any number of spaces, tabs, and newlines. Returns the parsed text.
     *
     * @group basic-parser string
     * @fail-type Never
     */
    readonly whitespaces: LoudParser<string>;


    //+ PRIMTIIVE
    /**
     * Returns a parser that will parse one or more ASCII whitespace character and yield the result.
     *
     * @group basic-parser string
     * @fail-type Soft
     */
    readonly spaces1: LoudParser<string>;
    /**
     * Returns a parser that parses as many Unicode inline white spaces as possible. Returns the parsed text.
     *
     * @group basic-parser string unicode
     * @requires module:parjs/unicode
     * @fail-type Never
     */
    readonly uniSpaces: LoudParser<string>;
    /**
     * Returns a parser that will parse all the characters until the end of the input, and then yield the parsed text.
     *
     * @group basic-parser string
     * @fail-type Never
     */
    readonly rest: LoudParser<string>;

    /**
     * Returns a parser that will parse a single character that is part of the string `chars`, and then yield it.
     * @param chars The characters to match.
     *
     * @fail-type Softly
     * @group basic-parser character
     */
    anyCharOf(chars: string): LoudParser<string>;

    //+ SPECIAL

    /**
     * Returns a parser that will parse a single character that is not part of the string `chars`, and then yield it.
     * @param chars The characters not to match.
     *
     * @group basic-parser character
     * @fail-type Soft
     */
    noCharOf(chars: string): LoudParser<string>;

    /**
     * Returns a parser that will parse a single character that matches the given predicate, and then it will yield the character.
     * @param predicate The predicate the character must fulfill.
     *
     * @group basic-parser character
     * @fail-type Softly
     */

    charWhere(predicate: ParjsPredicate<string>): LoudParser<string>;

    //+ STRING

    //+ NUMERIC
    /**
     * Returns a parser that will parse an integer according to the format options given in `options`, and yield the integer that was parsed (as a number).
     * @param options The format of the integer.
     *
     * @group basic-parser numeric
     * @fail-type Softly usually, but hard for some inputs, like a sign with no digits after it
     */
    int(options ?: IntOptions): LoudParser<number>;

    /**
     * Returns a parser that will parse a single floating point number according to the format options given in `options`, and yield it (as a number).
     * @param options The floating point format options.
     *
     * @group basic-parser numeric
     * @fail-type Softly usually, but hard for some malformed inputs, like 1.0e+.
     */
    float(options ?: FloatOptions): LoudParser<number>;

    /**
     * Returns a parser that will succeed without consuming input and yield the given value.
     * @param result The value to yield.
     *
     * @group basic-parser primitive
     * @fail-type Never
     */
    result<T>(result: T): LoudParser<T>;

    /**
     * Returns a parser that will fail with the severity specified by `kind`, regardless of the input.
     * @param expecting Optionally, a text indicating why the parser failed.
     * @param kind The failure kind. Defaults to hard.
     *
     * @group basic-parser primitive
     * @fail-type As `kind`.
     */
    fail(expecting ?: string, kind ?: ReplyKind.Fail): LoudParser<any>;

    /**
     * Returns a parser that will try to parse the string `str`. The returned parser will yield the parsed string if it succeeds.
     * @param str The string to parse.
     *
     * @group basic-parser string
     * @fail-type Soft
     */
    string(str: string): LoudParser<string>;

    /**
     * Returns a parser that will try to parse the strings in `strings` in order, and it will yield the string that was parsed.
     * @param strings The strings.
     *
     * @group basic-parser string
     * @fail-type Soft
     */
    anyStringOf(...strings: string[]): LoudParser<string>;

    /**
     * Returns a parser that will parse exactly `length` characters and yield the string that was parsed.
     * @param length The number of characters to parse.
     *
     * @group basic-parser string
     * @fail-type Softly
     */
    stringLen(length: number): LoudParser<string>;

    /**
     * Returns a parser that will apply `regexp` on the input. It will succeed only if `regexp` matches at the current position.
     * The returned parser will consume all the (consecutive) input matched by the regex.
     * The returned parser will yield the resulting match array, with result[0] being the entire match and result[n] being group n.
     * @param regexp The regexp to apply. The global flag will not be respected.
     *
     * @group basic-parser string regex
     * @fail-type Softly
     */
    regexp(regexp: RegExp): LoudParser<string[]>;


    //+ STATIC COMBINATORS

    /**
     * The first time the returned parser that is invoked, it will call `resolver` with no arguments and cache the result. From that point, it will act like the parser returned by `resolver`.
     * This late binding can be used to create certain kinds of recursive parsers.
     * @param resolver
     *
     * @group combinator special
     * @fail-type As subparser
     */
    late<T>(resolver: () => LoudParser<T>): LoudParser<T>;

    /**
     * Returns a parser that will try to apply the given parsers at the current position, one after the other, until one of them succeeds. It will yield its result.
     * @param pars The parsers.
     *
     * @group combinator failure-recovery alternatives
     * @fail-type As subparsers
     */
    any(...pars: ImplicitLoudParser<any>[]): LoudParser<any>;

    /**
     * Returns a parser that will try to apply the given parsers at the current position, one after the other, until one of them succeeds.
     * @param pars The quiet parsers to try.
     *
     * @group combinator failure-recovery alternatives
     * @fail-type Softly usually, but hard if any subparser fails hard
     */
    any(...pars: QuietParser[]): QuietParser;

    /**
     * Returns a parser that will apply the parsers defined in the properties of `parsers`, in the order given by `ordering`.
     * If `ordering` is `null`, the own properties of `parsers` will be enumerated, and the parsers will be applied in the order in which they appear in the enumeration, which may be unpredictable.
     *
     * The returned parser will yield an object containing each parser property in `parsers`, with the value of that parser's result.
     * @template TObj
     * @returns {LoudParser<TObj>}
     */
    seqObject<O1, O2 = {}, O3 = {}, O4 = {}, O5 = {}, O6 = {}, O7 = {}, O8 = {}, O9 = {}, O10 = {}, O11 = {}>(
        p1: ParserSpecification<O1>,
        p2 ?: ParserSpecification<O2>,
        p3 ?: ParserSpecification<O3>,
        p4 ?: ParserSpecification<O4>,
        p5 ?: ParserSpecification<O5>,
        p6 ?: ParserSpecification<O6>,
        p7 ?: ParserSpecification<O7>,
        p8 ?: ParserSpecification<O8>,
        p9 ?: ParserSpecification<O9>,
        p10 ?: ParserSpecification<O10>,
        p11 ?: ParserSpecification<O11>
    )
        : LoudParser<O1 & O2 & O3 & O4>;

    /**
     * Returns a parser that will apply the specified parsers in sequence and yield the results in an array.
     * @param parsers The parser sequence.
     *
     * @group combinator sequential
     * @fail-type Softly if the first parser fails softly, hard if any of the next parsers fail.
     */
    seq(...parsers: ImplicitAnyParser[]): LoudParser<any[]>;

    /**
     * Returns a parser that, when called, will call the `parserChooser` function on the current parsing state.
     * The returned parser will behave like the parser returned by this function.
     * @param {(userState: UserState) => TParser1} parserChooser A function for choosing which parser to apply based on user state.
     */
    choose<TParser1>(parserChooser: (userState: UserState) => TParser1);
}
