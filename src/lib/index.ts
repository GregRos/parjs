/**
 * @module parjs
 * @preferred
 *
 * Contains publically visible code.
 */ /** iooi*/

import {ParjsStatic} from "./parjs";
import {ParjsParsers} from "./internal/static";
import {Template} from "typedoc/dist/lib/output/utils/resources/templates";
export {UserState} from "./internal/implementation/state";
export {LoudParser} from "./loud";
export {QuietParser} from "./quiet";
export {ParsingFailureError} from "./parsing-failure"
export {AnyParser} from "./any";
export {ReplyKind, Reply, QuietReply} from "./reply";


/**
 * The central API of the parjs library. Contains building block parsers and static combinators.
 */
export const Parjs = new ParjsParsers() as ParjsStatic;


declare function f(arr : TemplateStringsArray, lit1 : number) : [number];
declare function f(arr : TemplateStringsArray, lit1 : number, lit2 : string) : [number,string];

f`a${1}`;
f`a${2}fdggg${5}a`;


/**
 *
 */

