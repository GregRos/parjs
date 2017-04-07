import {LoudParser} from "./loud";
import {QuietParser} from "./quiet";
import {AnyParser} from "./any";
/**
 * Created by lifeg on 19/11/2016.
 */
export interface StaticCombinators {
    /**
     * The first time P is invoked, it calls {resolver} with no arguments and caches the result. From that point, it acts like the parser returned by {resolver}.
     * This can be used to create certain kinds of recursive parsers.
     *
     * @param resolver
     */
    late<T>(resolver : () => LoudParser<T>) : LoudParser<T>;


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


}
