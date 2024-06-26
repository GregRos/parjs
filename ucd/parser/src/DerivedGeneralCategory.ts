import { then, thenq } from "parjs/combinators";
import {
    pAnyFieldText,
    pCodepointOrRange,
    pFieldSeparator,
    pUcdRowParser,
    pUntilLineBreak
} from "./common.js";

/*
  Example Input:
    # General_Category=Unassigned

    0378..0379    ; Cn #   [2] <reserved-0378>..<reserved-0379>
    0380..0383    ; Cn #   [4] <reserved-0380>..<reserved-0383>
    038B          ; Cn #       <reserved-038B>
*/
const pDerivedGeneralCategoryRow = pCodepointOrRange // 0: codepoint or range
    .pipe(
        thenq(pFieldSeparator),
        then(pAnyFieldText), // 1: Category name
        thenq(pUntilLineBreak)
    );

export const pDerivedGeneralCategory = pUcdRowParser(
    pDerivedGeneralCategoryRow,
    ([range, name]) => ({
        range,
        name
    })
);
