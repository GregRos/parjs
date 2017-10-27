/**
 * @module parjs/unicode
 */ /** */
//This module initializes the library with the char-info package, generating a require('char-info') statement.

import {CodeInfo, CharInfo} from 'char-info';
import {ConditionalUnicode} from './internal/static';
ConditionalUnicode.CharInfo = CharInfo;
ConditionalUnicode.CodeInfo = CodeInfo;

