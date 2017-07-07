"use strict";
/**
 * @module parjs/unicode
 */ /** */
//This module initializes the library with the char-info package, generating a require('char-info') statement.
Object.defineProperty(exports, "__esModule", { value: true });
const char_info_1 = require("char-info");
const static_1 = require("./internal/static");
static_1.InfoContainer.CharInfo = char_info_1.CharInfo;
static_1.InfoContainer.CodeInfo = char_info_1.CodeInfo;
//# sourceMappingURL=unicode.js.map