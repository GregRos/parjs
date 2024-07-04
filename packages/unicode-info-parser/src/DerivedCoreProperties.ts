import { maybe, qthen, then, thenq } from "parjs/combinators";
import {
    pAnyFieldText,
    pCodepointOrRange,
    pFieldSeparator,
    pUcdRowParser,
    pUntilLineBreak
} from "./common.js";

/*
  Example Input:
    (string))
    #  NOTE: See UAX #31 for more information

    0041..005A    ; XID_Start # L&  [26] LATIN CAPITAL LETTER A..LATIN CAPITAL LETTER Z
    0061..007A    ; XID_Start # L&  [26] LATIN SMALL LETTER A..LATIN SMALL LETTER Z
    00AA          ; XID_Start # Lo       FEMININE ORDINAL INDICATOR
    00B5          ; XID_Start # L&       MICRO SIGN
    00BA          ; XID_Start # Lo       MASCULINE ORDINAL INDICATOR
    VISARGA
    11133..11134  ; InCB; Extend # Mn   [2] CHAKMA VIRAMA..CHAKMA MAAYYAA
    11173         ; InCB; Extend # Mn       MAHAJANI SIGN NUKTA
    111CA         ; InCB; Extend # Mn       SHARADA SIGN NUKTA
    11236         ; InCB; Extend # Mn       KHOJKI SIGN NUKTA
*/
const pDerivedCorePropertiesRow = pCodepointOrRange // 0: codepoint or range
    .pipe(
        thenq(pFieldSeparator),
        // 1: property name
        then(pAnyFieldText),
        // 2: sometimes, property value
        then(pFieldSeparator.pipe(qthen(pAnyFieldText), maybe())),
        thenq(pUntilLineBreak)
    );

export const pDerivedCoreProperties = pUcdRowParser(
    pDerivedCorePropertiesRow,
    ([[range, name], value]) => ({
        range,
        name,
        value: value
    })
);
