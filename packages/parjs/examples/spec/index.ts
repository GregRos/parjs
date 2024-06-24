import { expect } from "@jest/globals";
import type { MatcherFunction, SyncExpectationResult } from "expect";
import type { ResultKind } from "parjs";
import { isParjsFailure, isParjsResult, isParjsSuccess } from "parjs/internal";

// helper
const fail = (message: string): SyncExpectationResult => ({
    pass: false,
    message: () => message
});

export const toBeSuccessful: MatcherFunction<[value: unknown]> =
    // jest recommends to type the parameters as `unknown` and to validate the values
    function (actual: unknown, expected: unknown): SyncExpectationResult {
        if (!isParjsResult(actual)) {
            throw new Error(
                `toBeSuccessful must be called on a ParjsResult, but was called on ${typeof actual}`
            );
        }

        if (!isParjsSuccess(actual)) {
            return fail(`expected the parse result to be a ParjsSuccess instance:\n\n${actual}`);
        }

        const actualString = JSON.stringify(actual, null, 2);
        if (actual.kind !== "OK") {
            return fail(
                `expected the parse result ${actualString} to have kind 'OK' but it had kind '${actual.kind}'`
            );
        }

        if (expected !== undefined) {
            try {
                // check the structure of the objects, not their references
                expect(actual.value).toEqual(expected);
            } catch (error) {
                return fail(`Unexpected parser result value. \n\n${error}`);
            }
        }

        return {
            pass: true,
            message() {
                return `toBeSuccessful succeeded 👍`;
            }
        };
    };

export const toBeFailure: MatcherFunction<[kind?: string]> = function (
    actual: unknown,
    expected: unknown
): SyncExpectationResult {
    if (!isParjsResult(actual)) {
        throw new Error("toBeFailure must be called on a ParjsResult");
    }

    const actualString = JSON.stringify(actual, null, 2);

    if (!isParjsFailure(actual)) {
        return fail(
            `expected the parse result ${actualString} to be a ParjsFailure instance, but its type is '${typeof actual}'`
        );
    }

    // if a kind was specified, check it
    if (expected !== undefined && actual.kind !== expected) {
        return fail(
            `expected the parse result ${actualString} to have kind '${expected}' but it had kind '${actual.kind}'`
        );
    }

    return {
        pass: true,
        message() {
            return `toBeFailure succeeded 👍`;
        }
    };
};

expect.extend({
    toBeSuccessful,
    toBeFailure
});

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    export namespace jest {
        export interface Matchers<R> {
            toBeSuccessful<T>(value?: T): R;
            toBeFailure(kind?: ResultKind): R;
        }
    }
}
