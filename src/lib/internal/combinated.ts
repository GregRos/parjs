import { ParjserBase } from "./parser";
import type { Parjser } from "./parjser";

export abstract class Combinated<From, To> extends ParjserBase<To> implements Parjser<To> {
    constructor(protected source: CombinatorInput<From>) {
        super();
    }
}

export type CombinatorInput<T> = ParjserBase<T> & Parjser<T>;
