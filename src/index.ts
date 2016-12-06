/**
 * Created by User on 27-Nov-16.
 */
import {Parjs, ParjsParsers} from './bindings/parsers';
import {ParjsAction} from './base/action';
import {ParjsParser} from './bindings/instance-combinators';

type QParser = QuietParser;
type LParser<T> = LoudParser<T>;

export {QParser as QuietParser, LParser as LoudParser, Parjs, ParjsParsers, ParjsParser, ParjsAction};
