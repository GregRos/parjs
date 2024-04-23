import type { ParjsCombinator } from "../parjser";
import { map } from "./map";

/**
 * Applies the source parser and yields the constant value `result`.
 *
 * @param result The constant value to yield.
 */
export function mapConst<T>(result: T): ParjsCombinator<unknown, T> {
    return map(() => result);
}
