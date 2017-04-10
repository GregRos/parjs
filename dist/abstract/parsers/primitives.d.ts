import { LoudParser } from "../combinators/loud";
import { QuietParser } from "../combinators/quiet";
import { FailKind } from "../basics/result";
/**
 * Created by User on 21-Nov-16.
 */
export interface PrimitiveParsers {
    /**
     * P succeeds without consuming input and returns the given value.
     * @param result The value to return.
     */
    result<T>(result: T): LoudParser<T>;
    /**
     * P succeeds without consuming input. Quiet parser.
     */
    readonly nop: QuietParser;
    /**
     * P succeeds there are no more characters to parse.
     */
    readonly eof: QuietParser;
    /**
     * P fails for any input.
     */
    fail(expecting?: string, kind?: FailKind): LoudParser<any>;
}
