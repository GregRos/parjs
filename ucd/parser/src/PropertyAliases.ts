import { then, thenq } from "parjs/combinators";
import { pAnyFieldText, pFieldSeparator, pUcdRowParser, pUntilLineBreak } from "./common.js";

/*
  Example Input:
    # ================================================
    # Numeric Properties
    # ================================================
    cjkAccountingNumeric     ; kAccountingNumeric
    cjkOtherNumeric          ; kOtherNumeric
    cjkPrimaryNumeric        ; kPrimaryNumeric
*/
const pPropertyAliasesRow = pAnyFieldText // 0: Short property name
    .pipe(
        thenq(pFieldSeparator),
        then(pAnyFieldText), // 1: Long property name
        thenq(pUntilLineBreak)
    );

export const pPropertyAliases = pUcdRowParser(pPropertyAliasesRow, ([shortName, longName]) => ({
    shortName,
    longName
}));
