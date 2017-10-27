/**
 * @module parjs
 */ /** */
import {LoudParser, ParjsPredicate} from "./loud";
import {FloatOptions} from "./internal/implementation/parsers/numbers/float";
import {IntOptions} from "./internal/implementation/parsers/numbers/int";
import {QuietParser} from "./quiet";
import {AnyParser} from "./any";
import {ReplyKind} from "./reply";
import {AnyParserAction} from "./internal/action";
import {TraceVisualizer} from "./internal/visualizer";

export interface ParjsStaticHelper {
    isParser(obj : any) : obj is AnyParser;

    isParserAction(obj : any) : obj is AnyParserAction;
}

/**
 * Namespace for static combinators and building-block parsers.
 *
 * @group functional
 */
export interface ParjsStatic {

    readonly helper : ParjsStaticHelper;


    //++ INFRASTRUCTURE
    /**
     * Used to visualize parsing errors in plain-text.
     */
    visualizer : TraceVisualizer;

    //++ PARSERS

    /**
     * P will parse a single character and return it.  If it can't, it will fail softly.
     *
     * @group basic-parser character
     */
    readonly anyChar : LoudParser<string>;

    /**
     * P will parse a single character that is part of the string {chars}, and then return it. If it can't, it will fail softly.
     * @param chars The characters to match.
     *
     * @group basic-parser character
     */
    anyCharOf(chars : string) : LoudParser<string>;

    /**
     * P will parse a single character that is not part of the string {chars}, and then return it.  If it can't, it will fail softly.
     * @param chars The characters not to match.
     *
     * @group basic-parser character
     */
    noCharOf(chars : string) : LoudParser<string>;

    /**
     * P will parse a single character that matches the given predicate, and then it will return the character.  If it can't, it will fail softly.
     * @param predicate The predicate the character must fulfill.
     *
     * @group basic-parser character
     */

    charWhere(predicate : ParjsPredicate<string>) : LoudParser<string>;

    /**
     * P will parse a single digit character [0-9] and return it. If it can't, it will fail soflty.
     *
     * @group basic-parser character numeric
     */
    readonly digit : LoudParser<string>;

    /**
     * P will parse a single hex digit character [0-9a-fA-F] and return it. If it can't, it will fail soflty.
     *
     * @group basic-parser character numeric
     */
    readonly hex : LoudParser<string>;

    /**
     * P will parse a single lower-case letter character in the range [a-z] and return it. If it can't, it will fail soflty.
     *
     * @group basic-parser character
     */
    readonly lower : LoudParser<string>;

    /**
     * P will parse a single letter [a-zA-Z] and return it. If it can't, it will fail softly.
     *
     * @group basic-parser character
     */
    readonly letter : LoudParser<string>;

    /**
     * P will parse a single upper-case letter character in the range [A-Z] and return it. If it can't, it will fail softly.
     *
     * @group basic-parser character
     */
    readonly upper : LoudParser<string>;


    /**
     * P will parse either \n, \r\n, or \r and return the string that was parsed. If it can't, it will fail softly.
     *
     * @group basic-parser character
     */
    readonly newline : LoudParser<string>;

    /**
     * P will parse a single Unicode newline string, including characters as \u2029 (PARAGRAPH SEPARATOR) that may indicate newlines. Returns the string that was parsed.
     * If it can't, it will fail softly.
     *
     * @group basic-parser character unicode
     */
    readonly uniNewline : LoudParser<string>;

    /**
     * P will parse a single Unicode lowercase character in any script or language. It will return the string that was parsed.
     *
     * @group basic-parser character unicode
     */
    readonly uniLower : LoudParser<string>;
    /**
     * P will parse a single Unicode letter character in any script or language. It will return the string that was parsed.
     *
     * @group basic-parser character unicode
     */
    readonly uniLetter : LoudParser<string>;

    /**
     * P will parse a single Unicode uppercase character in any script or language. It will return the string that was parsed.
     *
     * @group basic-parser character unicode
     */
    readonly uniUpper : LoudParser<string>;

    /**
     * P will parse a single Unicode digit character in any script or language. It will return the string that was parsed.
     *
     * @group basic-parser character unicode numeric
     */
    readonly uniDigit : LoudParser<string>;
    /**
     * P will parse one ASCII inline space character, such as space or a tab, and return it.
     * If it can't, it will fail softly.
     *
     * @group basic-parser character
     */
    readonly space : LoudParser<string>;

    /**
     * P will parse one Unicode inline space character, including characters such as EM SPACE, and return the character that was parsed.
     * If it can't, it will fail softly.
     *
     * @group basic-parser character unicode
     */
    readonly uniSpace : LoudParser<string>;

    //+ NUMERIC
    /**
     * P will parse an integer according to the format options given in {options}, and return the integer that was parsed in numeric form.
     * P will normally either succeed or fail softly, but some kinds of inputs will cause a hard failure, such as a sign without any digits after it.
     * @param options The format of the integer.
     *
     * @group basic-parser numeric
     */
    int(options ?: IntOptions) : LoudParser<number>;

    /**
     * P will parse a single floating point number according to the format options given in {options}, and return it in numeric form.
     * P will fail softly if the input is not a floating point number, but it will fail hard if it suspects the input is a malformed floating point number.
     * For example, 1.0e+ will cause it to fail hard.
     * @param options The floating point format options.
     *
     * @group basic-parser numeric
     */
    float(options ?: FloatOptions) : LoudParser<number>


    //+ PRIMTIIVE

    /**
     * P will succeed without consuming input and return the given value.
     * @param result The value to return.
     *
     * @group basic-parser primitive
     */
    result<T>(result : T) : LoudParser<T>;

    /**
     * P will succeed without consuming input. Quiet parser.
     *
     * @group basic-parser primitive
     */
    readonly nop : QuietParser;

    /**
     * P will succeed if it has reached the end of the input, and fail softly otherwise.
     *
     * @group basic-parser primitive
     */
    readonly eof : QuietParser;

    /**
     * P will fail with the severity specified by {kind}, regardless of the input.
     * @param expecting Optionally, a text indicating why the parser failed.
     * @param kind The failure kind. Defaults to hard.
     *
     * @group basic-parser primitive
     */
    fail(expecting ?: string, kind ?: ReplyKind.Fail) : LoudParser<any>;

    //+ SPECIAL

    /**
     * P will succeed without consuming input and return the current position in the input.
     *
     * @group basic-parser primitive
     */
    readonly position : LoudParser<number>;

    /**
     * P will succeed without consuming input and return the current user state.
     *
     * @group basic-parser primitive
     */
    readonly state : LoudParser<any>;

    //+ STRING

    /**
     * P will parse as many ASCII whitespace characters as possible, including any number of spaces, tabs, and newlines. Returns the parsed text.
     * P will always succeed.
     *
     * @group basic-parser string
     */
    readonly whitespaces : LoudParser<string>;

    /**
     * P will parse one or more ASCII whitespace character and returns the result.
     * P will fail softly if it can't parse at least one space character.
     *
     * @group basic-parser string
     */
    readonly spaces1 : LoudParser<string>;

    /**
     * P parses as many Unicode inline white spaces as possible. Returns the parsed text.
     * P will always succeed.
     *
     *  @group basic-parser string unicode
     */
    readonly uniSpaces : LoudParser<string>;

    /**
     * P will parse all the characters until the end of the input, and then return the parsed text.
     * P will never fail.
     *
     *  @group basic-parser string
     */
    readonly rest : LoudParser<string>;

    /**
     * P will try to parse the string {str}. P will return the parsed string if it succeeds, and fail softly otherwise.
     * @param str The string to parse.
     *
     *  @group basic-parser string
     */
    string(str : string) : LoudParser<string>;

    /**
     * P will try to parse the strings in {strings} in order, and it will return the first one for which parsing succeeds.
     * P will fail softly if none of the strings can be parsed.
     * @param strings The strings.
     *
     *  @group basic-parser string
     */
    anyStringOf(...strings : string[]) : LoudParser<string>;

    /**
     * P will parse exactly {length} characters and return the string that was parsed.
     * P will fail softly if the input does not contain that many characters, and succeed otherwise.
     * @param length The number of characters to parse.
     *
     *  @group basic-parser string
     */
    stringLen(length : number) : LoudParser<string>;

    /**
     * P will apply {regexp} starting at the current position. P will consume all the text from the current position to the end of the match.
     * The regexp starts matching at the current position.
     * P will return the resulting match array, with return[0] being the entire match and return[n] being group n.
     * P will fail softly if {regexp} failed.
     * @param regexp The regexp to apply.
     *
     *  @group basic-parser string regex
     */
    regexp(regexp : RegExp) : LoudParser<string[]>;


    //+ STATIC COMBINATORS

    /**
     * The first time P is invoked, it will call {resolver} with no arguments and cache the result. From that point, it will act like the parser returned by {resolver}.
     * This late binding can be used to create certain kinds of recursive parsers.
     * @param resolver
     *
     *  @group combinator special
     */
    late<T>(resolver : () => LoudParser<T>) : LoudParser<T>;

    /**
     * P will try to apply the given parsers at the current position, one after the other, until one of them succeeds. It will return its result.
     * P will fail softly if none of the parsers succeeds, and fail hard if any of them fails hard.
     * @param pars The parsers.
     *
     * @group combinator failure-recovery alternatives
     */
    any(...pars : LoudParser<any>[]) : LoudParser<any>;

    /**
     * P will try to apply the given parsers at the current position, one after the other, until one of them succeeds.
     * P will fail soflty if none of the parsers succeeds, and fail hard if any of them fails hard.
     * @param pars The quiet parsers to try.
     *
     * @group combinator failure-recovery alternatives
     */
    any(...pars : QuietParser[]) : QuietParser;

    /**
     * P will apply the specified parsers in sequence and return the results in an array.
     * @param parsers The parser sequence.
     *
     * @group combinator sequential
     */
    seq(...parsers : AnyParser[]) : LoudParser<any[]>;

}