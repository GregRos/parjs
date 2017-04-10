import { CharParsers } from "../abstract/parsers/char";
import { StringParsers } from "../abstract/parsers/string";
import { PrimitiveParsers } from "../abstract/parsers/primitives";
import { SpecialParsers } from "../abstract/parsers/special";
import { StaticCombinators } from "../abstract/combinators/static";
import { NumericParsers } from "../abstract/parsers/numeric";
export declare type ParjsType = CharParsers & NumericParsers & StringParsers & PrimitiveParsers & SpecialParsers & StaticCombinators;
export declare const Parjs: ParjsType;
