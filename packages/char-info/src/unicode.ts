/**
 * Unicode character indicators.
 *
 * @module char-info/unicode
 * @preferred
 */ /** */

import {lookup} from "./internal/unicode-lookup";
import {BasicCharClassIndicator} from "./internal/indicators";
import {UnicodeCategory} from "./internal/names";
import {CharClassIndicator} from "./internal/indicator-type";

function homogenizeInputStr(str: string) {
    return str.toLowerCase().replace(/[_ -,]/g, "");
}

/**
 * Returns an indicator for characters belonging to the Unicode category,
 * `category`.
 * @param category The category to test for.
 */
export function uniInCategory(category: string): CharClassIndicator {
    category = homogenizeInputStr(category);
    if (category.length > 3) {
        category = lookup.longCategoryToCode.get(category);
    }
    let uGroup = lookup.categories.get(category);
    return new BasicCharClassIndicator(uGroup);
}

/**
 * Returns an indicator for characters belonging to a Unicode script, `script`.
 * @param script
 */
export function uniInScript(script: string) {
    script = homogenizeInputStr(script);
    let uGroup = lookup.scripts.get(script);
    return new BasicCharClassIndicator(uGroup);
}

/**
 * Returns an indicator for characters belonging to the Unicode block, `block`.
 * @param block
 */
export function uniInBlock(block: string) {
    block = homogenizeInputStr(block);
    let uGroup = lookup.blocks.get(block);
    return new BasicCharClassIndicator(uGroup);
}

/**
 * Indicator for Unicode decimal digit characters.
 */
export const uniIsDecimal = uniInCategory(UnicodeCategory.NumberDecimalDigit);

/**
 * Indicator for Unicode letters.
 */
export const uniIsLetter = uniInCategory(UnicodeCategory.Letter);

/**
 * Indicator for Unicode lowercase letters.
 */
export const uniIsLower = uniInCategory(UnicodeCategory.LetterLowercase);

/**
 * Indicator for Unicode uppercase letters.
 */
export const uniIsUpper = uniInCategory(UnicodeCategory.LetterUppercase);

/**
 * Indicator for Unicode inline spaces.
 */
export const uniIsSpace = uniInCategory(UnicodeCategory.SeparatorSpace);

/**
 * Indicator for Unicode vertical separators.
 */
export const uniIsNewline = uniInCategory(UnicodeCategory.Custom_SeparatorVertical);

/**
 * Returns the Unicode categories for a character or code.
 */
export const uniGetCategories = {
    code(code: number) {
        return lookup.allCategories.search(code, code);
    },
    char(char: string) {
        return uniGetCategories.code(char.charCodeAt(0));
    }
};

/**
 * Returns the Unicode scripts for a character or code.
 */
export const uniGetScripts = {
    code(code: number) {
        return lookup.allScripts.search(code, code);
    },
    char(char: string) {
        return uniGetScripts.code(char.charCodeAt(0));
    }
};

/**
 * Returns the Unicode block for a character or code.
 */
export const uniGetBlock = {
    code(code: number) {
        return lookup.allBlocks.search(code, code)[0];
    },
    char(char: string) {
        return uniGetBlock.code(char.charCodeAt(0));
    }
};

export {
    UnicodeScript,
    UnicodeCategory,
    UnicodeBlock
} from "./internal/names";
