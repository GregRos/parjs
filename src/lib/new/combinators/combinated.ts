import type { Parser } from "../parser";

/**
 * Represents a parser created as a result of applying a combinator.
 */
export abstract class Combinated<From, To> extends ParjserBase<To> implements Parser<To> {
    override type = this.constructor.name;
    constructor(protected source: Parser<From>) {
        super();
    }
}
