/**
 * Created by User on 27-Nov-16.
 */
import {Jase, JaseParsers} from './bindings/parsers';
import {JaseParserAction} from './base/parser-action';
import {JaseParser} from './bindings/combinators';

type QParser = QuietParser;
type LParser<T> = LoudParser<T>;

export {QParser as QuietParser, LParser as LoudParser, Jase, JaseParsers, JaseParser, JaseParserAction};
