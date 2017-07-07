/**
 * @module parjs/unicode
 */ /** */
//This module initializes the library with the char-info package, generating a require('char-info') statement.

import {CodeInfo, CharInfo} from 'char-info';
import {InfoContainer} from './internal/static';
InfoContainer.CharInfo = CharInfo;
InfoContainer.CodeInfo = CodeInfo;

