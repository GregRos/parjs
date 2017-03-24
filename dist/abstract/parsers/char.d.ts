import { LoudParser } from "../combinators/loud";
/**
 * Created by User on 21-Nov-16.
 */
export interface CharParsers {
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
    charWhere(predicate: (input: string) => boolean): LoudParser<string>;
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
     * P Parses a single Unicode lower-case character.
     */
    readonly lower: LoudParser<string>;
    /**
     * P Parses a single Unicode upper-case character.
     */
    readonly upper: LoudParser<string>;
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
}
