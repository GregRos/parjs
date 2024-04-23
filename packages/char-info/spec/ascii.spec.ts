import {
    isAscii,
    isDigit,
    isHex,
    isLetter,
    isLower,
    isNewline,
    isSpace,
    isUpper,
    isWordChar
} from "../../lib";
import {defineIndicatorTest} from "../helpers/indicator-test";

defineIndicatorTest("isLetter", isLetter, {
    true: ["G", "g"],
    false: ["4", ""]
});

defineIndicatorTest("isLower", isLower, {
    true: ["a", "c"],
    false: ["4", "", "A"]
});

defineIndicatorTest("isUpper", isUpper, {
    true: ["A", "C"],
    false: ["4", "c"]
});

defineIndicatorTest("isSpace", isSpace, {
    true: ["\t", " "],
    false: ["G", "\n", "\r", "", "4"]
});

defineIndicatorTest("isDigit - default base", x => isDigit(x), {
    true: ["4", "2", "9", "0"],
    false: ["g", "", "G", "a", "-"]
});

defineIndicatorTest("isDigit - base 4", x => isDigit(x, 4), {
    true: ["3", "0"],
    false: ["", "4", "a", "9"]
});

defineIndicatorTest("isDigit - base 13", x => isDigit(x, 13), {
    true: ["3", "c"],
    false: ["d", "f", ""]
});

defineIndicatorTest("isHex", isHex, {
    true: ["0", "1", "a", "f"],
    false: ["g", "z", " ", ""]
});

defineIndicatorTest("isWord", isWordChar, {
    true: ["a", "4", "_", "-"],
    false: ["", "+", " ", "("]
});

defineIndicatorTest("isNewline", isNewline, {
    true: ["\r", "\n"],
    false: [" ", "", "a"]
});

defineIndicatorTest("isAscii", isAscii, {
    true: ["a", "1", "-", "_", ";", "~", " "],
    false: ["Ṛ", "¶", "Ä", "Ÿ", "", "ѥ"]
});


