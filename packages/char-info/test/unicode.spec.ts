import {
    UnicodeBlock,
    UnicodeCategory,
    UnicodeScript,
    uniGetBlock,
    uniGetCategories,
    uniGetScripts,
    uniInBlock,
    uniInCategory,
    uniInScript,
    uniIsDecimal,
    uniIsLetter,
    uniIsLower,
    uniIsNewline,
    uniIsSpace,
    uniIsUpper
} from "../../lib";
import test from "ava";
import {defineIndicatorTest} from "../helpers/indicator-test";


const uniPunctuation = uniInCategory(UnicodeCategory.Punctuation);

defineIndicatorTest("category - punctuation", uniPunctuation.char, {
    true: [",", "׆", "؟", "§"],
    false: ["a", "", "4"]
});

defineIndicatorTest("category - uppercase", uniIsUpper.char, {
    true: ["A", "Ę", "Ц"],
    false: ["a", "4", "§", "", "ר", "ج"]
});

// note - hebrew letters are not in Lu or Ll, they're in Lo

defineIndicatorTest("category - lowercase", uniIsLower.char, {
    true: ["ö", "ė", "e"],
    false: ["O", "1", ",", "ר", "ج"]
});

defineIndicatorTest("category - decimal", uniIsDecimal.char, {
    true: ["٤", "۹", "1", "9", "\u09e8"],
    false: ["a", " ", "A", "X", "Ⅵ", "ⅸ"]
});


defineIndicatorTest("category - letter", uniIsLetter.char, {
    true: ["A", "Ę", "Ц", "ö", "ė", "e", "ר", "ج"],
    false: ["1", " ", "-", "⅀", "∂"]
});

const uniIsLetterLongName = uniInCategory("Letter");

defineIndicatorTest("category - letter, long name", uniIsLetterLongName.char, {
    true: ["A", "Ę", "Ц", "ö", "ė", "e", "ר", "ج"],
    false: ["1", " ", "-", "⅀", "∂"]
});

// note - added checks for some letter-like symbols

defineIndicatorTest("category - space", uniIsSpace.char, {
    //  that dash thing is on purpose, it's considered a space
    true: [" ", "\t", "\u200a", "\u3000", "\u2008", "\u2005", " "],
    false: ["\r", "\n", "\u2029", "a", "x", "5", ";"]
});

defineIndicatorTest("custom category - linebreak", uniIsNewline.char, {
    true: ["\r", "\n", "\u2029", "\u2028"],
    false: ["", "4", "a", " ", "-", "\u200a", "\u3000", "\u2008", "\u2005", " "]
});



const uniIsHebrew = uniInScript(UnicodeScript.Hebrew);

defineIndicatorTest("script - hebrew", uniIsHebrew.char, {
    true: ["רּ", "ﬤ", "ﬠ", ],
    false: ["ℵ", "a", "x", "", "o"]
});

const uniIsLatin = uniInScript(UnicodeScript.Latin);

defineIndicatorTest("script - latin", uniIsLatin.char, {
    true: ["a", "A", "b", "z", "Z"],
    false: ["1", "ﬤ", "ﬠ"]
});

const uniIsBasicLatin = uniInBlock(UnicodeBlock.BasicLatin);

// basic latin == ascii
defineIndicatorTest("block - basic latin", uniIsBasicLatin.char, {
    true: ["a", "B", "-", " ", "~", " "],
    false: ["Ṛ", "¶", "Ä", "Ÿ", "", "ѥ"]
});

const uniIsGreekCoptic = uniInBlock(UnicodeBlock.GreekAndCoptic);

defineIndicatorTest("block - greek and coptic", uniIsGreekCoptic.char, {
    true: ["ͷ", "Ύ", "Ι", "ή", "Ͽ", "Ͱ"],
    false: ["a", "b", "c", " ", "'", "", "Ѐ"]
});

const getScriptNames = x => uniGetScripts.char(x).map(x => x.name);

test("identify script", t => {
    t.deepEqual(getScriptNames("a"), [UnicodeScript.Latin]);
    t.deepEqual(getScriptNames("A"), [UnicodeScript.Latin]);
    t.deepEqual(getScriptNames("."), [UnicodeScript.Common]);
    t.deepEqual(getScriptNames("ﬠ"), [UnicodeScript.Hebrew]);
    t.deepEqual(getScriptNames("1"), [UnicodeScript.Common]);
    t.deepEqual(getScriptNames("Ͽ"), [UnicodeScript.Greek]);
});

const getCategoryNames = x => uniGetCategories.char(x).map(x => x.name);

test("identify categories", t => {
    t.deepEqual(getCategoryNames("-"), [UnicodeCategory.Punctuation, UnicodeCategory.PunctuationDash]);
    t.deepEqual(getCategoryNames("&"), [UnicodeCategory.Punctuation, UnicodeCategory.PunctuationOther]);
    t.deepEqual(getCategoryNames("h"), [UnicodeCategory.Letter, UnicodeCategory.LetterLowercase]);
    t.deepEqual(getCategoryNames("~"), [UnicodeCategory.Symbol, UnicodeCategory.SymbolMath]);
    t.deepEqual(getCategoryNames("ﬠ"), [UnicodeCategory.Letter, UnicodeCategory.LetterOther]);
});

const getBlockName = x => uniGetBlock.char(x).displayName;
test("identify blocks", t => {
    t.is(getBlockName("a"), UnicodeBlock.BasicLatin);
    t.is(getBlockName(","), UnicodeBlock.BasicLatin);
    t.is(getBlockName("ב"), UnicodeBlock.Hebrew);
    t.is(getBlockName("Ͽ"), UnicodeBlock.GreekAndCoptic);
});
