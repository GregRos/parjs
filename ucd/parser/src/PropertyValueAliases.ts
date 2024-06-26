import { then, thenq } from "parjs/combinators";
import { pAnyFieldText, pFieldSeparator, pUcdRowParser, pUntilLineBreak } from "./common.js";
/*
  Example Input:

    # ASCII_Hex_Digit (AHex)

    AHex; N     ; No        ; F       ; False
    AHex; Y     ; Yes       ; T       ; True
 
  pUcdRowParser will consume rows starting with whitespace, # or @.
*/

const propertyValueAliasesRow = pAnyFieldText.pipe(
    thenq(pFieldSeparator),
    then(pAnyFieldText),
    thenq(pFieldSeparator),
    then(pAnyFieldText),
    thenq(pUntilLineBreak)
);

export const pPropertyValueAliases = pUcdRowParser(
    propertyValueAliasesRow,
    ([[type, shortValue], longValue]) => ({
        type,
        shortValue,
        longValue
    })
);
