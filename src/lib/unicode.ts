/**
 * You must import this module to enable unicode support.
 * @module parjs/unicode
 */ /** */
//

import {CharInfo, CodeInfo} from "char-info";
import {ConditionalUnicode} from "./internal/static";

ConditionalUnicode.CharInfo = CharInfo;
ConditionalUnicode.CodeInfo = CodeInfo;

