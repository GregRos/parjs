import type { Parjser } from "./parjser";
import { ParjserBase } from "./parser";
/**
 * Represents a parser created as a result of applying a combinator.
 */
export abstract class Combinated<From, To> extends ParjserBase<To> implements Parjser<To> {
    override type = this.constructor.name;
    constructor(protected source: CombinatorInput<From>) {
        super();
    }
}

export type CombinatorInput<T> = ParjserBase<T> & Parjser<T>;
