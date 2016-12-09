import {LoudParser} from "./loud";
import {QuietParser} from "./quiet";
import {AnyParser} from "./any";
/**
 * Created by lifeg on 19/11/2016.
 */
export interface StaticCombinators {
    /**
     * P tries the given parsers, one after the other, and returns the value of the first one that succeeds.
     * @param pars The parsers.
     */
    any(...pars : LoudParser<any>[]) : LoudParser<any>;

    /**
     * P tries the given parsers, one after the other.
     * @param pars The quiet parsers to try.
     */
    any(...pars : QuietParser[]) : QuietParser;
    /**
     * P applies the specified parsers in sequence and returns the results in an array.
     * @param parsers The parser sequence.
     */
    seq(...parsers : AnyParser[]) : LoudParser<any[]>;

    /**
     * P applies the specified parsers in sequence and returns the results in an array.
     * @param parsers The parser sequence.
     */
    seq<T>(...parsers : (QuietParser | LoudParser<T>)[]) : LoudParser<T[]>;

}
