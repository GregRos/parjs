/**
 * @module parjs
 * @preferred
 *
 * Contains publically visible code.
 */ /** iooi*/

import {ParjsStatic} from "./parjs";
import {ParjsParsers} from "./internal/static";
export {LoudParser} from './loud';
export {QuietParser} from './quiet';
export {ParsingFailureError} from './parsing-failure'
export {AnyParser} from './any';
export {ReplyKind, Reply, QuietReply} from './reply';
/**
 * The central API of the parjs library. Contains building block parsers and static combinators.
 */
export const Parjs = new ParjsParsers() as ParjsStatic;
/**
 *
 */

