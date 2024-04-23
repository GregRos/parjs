/**
 * @module char-info
 */

/**
 * Lets you determine if a character or codepoint is part of some Unicode
 * character grouping.
 */
export interface CharClassIndicator {
    /**
     * Checks if the codepoint is part of the Unicode group.
     * @param char The codepoint.
     */
    code(char: number): boolean;

    /**
     * Checks if a character is in a Unicode group.
     * @param str A string representing a character.
     */
    char(str: string): boolean;
}

/**
 * Provides information about
 */
export interface CharInfoProvider {

}
