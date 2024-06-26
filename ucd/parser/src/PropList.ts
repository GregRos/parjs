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
    #   For documentation, see https://www.unicode.org/reports/tr44/

    # ================================================

    0009..000D    ; White_Space # Cc   [5] <control-0009>..<control-000D>
    0020          ; White_Space # Zs       SPACE
    0085          ; White_Space # Cc       <control-0085>
    00A0          ; White_Space # Zs       NO-BREAK SPACE
*/
const pPropListRow = pCodepointOrRange // 0: codepoint or range
    .pipe(
        thenq(pFieldSeparator),
        then(pAnyFieldText), // 1: Property name
        thenq(pUntilLineBreak)
    );

export const pPropList = pUcdRowParser(pPropListRow, ([range, name]) => ({ range, name }));
