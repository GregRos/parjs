/**
 * Created by User on 21-Nov-16.
 */
interface PrimitiveParsers {
    /**
     * P succeeds without consuming input and returns the given value.
     * @param result The value to return.
     */
    result<T>(result : T) : LoudParser<T>;

    /**
     * P succeeds there are no more characters to parse.
     */
    readonly eof : QuietParser;

    /**
     * P fails for any input.
     */
    readonly fail : QuietParser;
}