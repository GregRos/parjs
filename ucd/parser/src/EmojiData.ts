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
    # All omitted code points have Emoji=No

    0023          ; Emoji                # E0.0   [1] (#️)       hash sign
    002A          ; Emoji                # E0.0   [1] (*️)       asterisk
    0030..0039    ; Emoji                # E0.0  [10] (0️..9️)    digit zero..digit nine
*/
const pEmojiDataRow = pCodepointOrRange // 0: codepoint or range
    .pipe(
        thenq(pFieldSeparator),
        then(pAnyFieldText), // 1: Binary property name
        thenq(pUntilLineBreak)
    );

export const pEmojiData = pUcdRowParser(pEmojiDataRow, ([range, name]) => ({
    range,
    name
}));
