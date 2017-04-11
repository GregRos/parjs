/**
 * @module parjs
 * @preferred
 *
 * Contains publically visible code.
 */ /** iooi*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const static_1 = require("./internal/static");
var parsing_failure_1 = require("./parsing-failure");
exports.ParsingFailureError = parsing_failure_1.ParsingFailureError;
var reply_1 = require("./reply");
exports.ReplyKind = reply_1.ReplyKind;
/**
 * The central API of the parjs library. Contains building block parsers and static combinators.
 */
exports.Parjs = new static_1.ParjsParsers();
/**
 *
 */

//# sourceMappingURL=index.js.map
