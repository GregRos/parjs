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
    # @missing: 0000..10FFFF; Unknown

    0000..001F    ; Common # Cc  [32] <control-0000>..<control-001F>
    0020          ; Common # Zs       SPACE
    0021..0023    ; Common # Po   [3] EXCLAMATION MARK..NUMBER SIGN
    0024          ; Common # Sc       DOLLAR SIGN
    0025..0027    ; Common # Po   [3] PERCENT SIGN..APOSTROPHE
    0028          ; Common # Ps       LEFT PARENTHESIS
*/
const dataRow = pCodepointOrRange // 0: codepoint range or range
    .pipe(
        thenq(pFieldSeparator),
        then(pAnyFieldText), // 1: script name
        thenq(pUntilLineBreak)
    );

export const pScripts = pUcdRowParser(dataRow, ([range, name]) => ({ range, name }));
