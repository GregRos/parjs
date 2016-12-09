import { LoudParser } from "./loud";
import { AnyParserAction } from "../basics/action";
import { QuietParser } from "./quiet";
/**
 * Created by User on 21-Nov-16.
 */
export interface AnyParser {
    readonly displayName: string;
    /**
     * Exposes the internal parser action. This bit will generally contain the implementation of the parser instance.
     */
    readonly action: AnyParserAction;
    /**
     * P applies this parser, and if it succeeds, returns the given value.
     * @param result The value to return.
     */
    result<S>(result: S): LoudParser<S>;
    /**
     * P applies this parser and forgets the result (if any).
     */
    readonly quiet: QuietParser;
    /**
     * P applies this parser and succeeds without consuming input if this parser fails. P fails if this parser succeeds.
     */
    readonly not: QuietParser;
    readonly isLoud: boolean;
}
