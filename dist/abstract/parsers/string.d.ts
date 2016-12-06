/// <reference types="core-js" />
/**
 * Created by User on 21-Nov-16.
 */
interface StringParsers {
    /**
     * P parses as many ASCII whitespace characters as possible, including any number of spaces, tabs, and newlines. Returns the parsed text.
     *
     */
    readonly spaces: LoudParser<string>;
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
}
