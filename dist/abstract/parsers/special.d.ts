/**
 * Created by User on 20-Nov-16.
 */
interface SpecialParsers {
    /**
     * P succeeds without consuming input and returns the current position in the input.
     */
    readonly position: LoudParser<number>;
    /**
     * P succeeds without consuming input and returns the current user state.
     * The initial user state is undefined.
     */
    readonly state: LoudParser<any>;
}
