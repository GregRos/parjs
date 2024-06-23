/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReplaceProperty } from "type-plus";
import type { Parser } from "./parser";
import type { Result } from "./state/result";
export interface ParserImplementation<Output> {
    apply(state: Result<Output>): void;
}

export interface Applicable<Input, Default> {
    apply(subject: Parser<Input>): Parser<Default>;
}

export interface Configurable<Input, Outputs extends Record<keyof Outputs | "default", unknown>>
    extends Applicable<Input, Outputs["default"]> {
    select<NewDefault>(
        fn: (outputs: Outputs) => NewDefault
    ): Configurable<Input, ReplaceProperty<Outputs, "default", NewDefault>>;
}

export type MaybeParser<Output> = Parser<Output> | null;
