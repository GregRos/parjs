/**
 * Created by lifeg on 24/11/2016.
 */
interface LoudParser<T> {
    parse(input: string): ValueResult<T>;
}
