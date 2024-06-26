import { anyChar } from "parjs";
import { then, thenq } from "parjs/combinators";
import { pCodepoint, pCodepointName, pUcdRowParser, pUntilLineBreak } from "./common.js";

/*
  Example Input:
    @+		Alias names are those
    0000	<control>
        = NULL
    0001	<control>
        = START OF HEADING
    0002	<control>
        = START OF TEXT

  pUcdRowParser will consume rows starting with whitespace or @.        
 */
const dataRow = pCodepoint // 0: codepoint
    .pipe(
        thenq(anyChar()),
        then(pCodepointName), // 1: old name
        thenq(pUntilLineBreak)
    )
    .expects("NamesList row");

export const pNamesList = pUcdRowParser(dataRow, ([cp, name]) => {
    return {
        codepoint: cp,
        name
    };
});
