/**
 * @module parjs
 */
/** */
import {LoudParser} from "./loud";
import {AnyParserAction} from "./internal/action";
import {QuietParser} from "./quiet";
import {UserState} from "./internal/implementation/state";

/**
 * Common interface that unites parsers that produce values and ones that don't.
 * @see {@link LoudParser}
 * @see {@link QuietParser}
 *
 * @group functional
 */
export interface AnyParser {
    /**
     * Exposes the display name of the parser. Userful when debugging.
     *
     * @group informational
     */
    readonly displayName: string;

    pipe<T1>(
        t1: (a: this) => T1
    ): T1;

    pipe<T1, T2>(
        t1: (a: this) => T1,
        t2: (a: T1) => T2
    ): T2;

    pipe<T1, T2, T3>(
        t1: (a: this) => T1,
        t2: (a: T1) => T2,
        t3: (a: T2) => T3
    ): T3;

    pipe<T1, T2, T3, T4>(
        t1: (a: this) => T1,
        t2: (a: T1) => T2,
        t3: (a: T2) => T3,
        t4: (a: T3) => T4
    ): T4;

}
