import { then, thenq } from "parjs/combinators";
import {
    pAnyFieldText,
    pFieldSeparator,
    pRange,
    pUcdRowParser,
    pUntilLineBreak
} from "./common.js";
/*
    Example Input:
        # @missing: 0000..10FFFF; No_Block
        0590..05FF; Hebrew
        0600..06FF; Arabic
        0700..074F; Syriac
*/
const blockRow = pRange.pipe(
    // 0: block range
    thenq(pFieldSeparator),
    then(pAnyFieldText), // 1: name
    thenq(pUntilLineBreak)
);

export const pBlocks = pUcdRowParser(blockRow, ([range, name]) => ({ range, name }));
