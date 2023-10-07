import { ParjsResult, ResultKind } from "../../lib/internal/result";
import matches from "lodash/matches";
import isPlainObject from "lodash/isPlainObject";

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jasmine {
        interface Matchers<T> {
            toBeAnyOf(expecteds: Expected<T>[], failMessage?: string): void;

            toHaveType(type: string, failMessage?: string): void;

            toHaveMember(name: string, failMessage?: string): void;

            toBeLike(obj: Partial<Expected<T>>): void;
        }
    }
}

class CustomMatcherDefs {
    actual: unknown;

    toBeAnyOf(expecteds: unknown[], failMessage: string) {
        let result;
        for (let i = 0, l = expecteds.length; i < l; i++) {
            if (this.actual === expecteds[i]) {
                result = true;
                break;
            }
        }
        return {
            pass: result,
            message: result ? undefined : failMessage
        };
    }

    toBeLike(o: unknown, failMessage: string) {
        const pass = matches(o)(this.actual);
        return {
            pass,
            message: pass ? undefined : failMessage
        };
    }

    toHaveType(type: unknown, failMessage: string) {
        const pass = typeof this.actual === type;
        return {
            pass,
            message: pass ? undefined : failMessage
        };
    }

    toHaveMember(name: string, failMessage: string) {
        const pass = name in (this.actual as object);
        return {
            pass,
            message: pass ? undefined : failMessage
        };
    }
}

export const CustomMatchers = {} as any;

const defs = CustomMatcherDefs.prototype;

for (const prop of Object.getOwnPropertyNames(defs)) {
    if (prop === "constructor") continue;

    CustomMatchers[prop] = function (_a: unknown, _b: unknown) {
        return {
            compare(actual: unknown, ...rest: unknown[]) {
                defs.actual = actual;
                return (defs as any)[prop](...rest);
            }
        };
    };
}

/**
 * Expects a parjs result to be a failure.
 * @param result The Parjs result.
 * @param failType The type of failure to expect. Undefined for any.
 */
export function expectFailure(result: ParjsResult<any>, failType?: ResultKind.Fail) {
    expect(result.kind).toBeAnyOf(
        [ResultKind.FatalFail, ResultKind.HardFail, ResultKind.SoftFail],
        "expected kind to be a Fail"
    );
    if (result.kind === ResultKind.Ok) return;
    if (failType !== undefined) {
        expect(result.kind).toBe(failType);
    }

    expect(result.trace.reason).toHaveType("string", "invaid 'reason' value");
}

/**
 * Expects a parjs result to be a success.
 * @param result The result.
 * @param value The value to expect.
 * @param state An object to be deep-equal to the user state.
 */
export function expectSuccess<T>(result: ParjsResult<T>, value?: T, state?: object) {
    expect(result.kind).toBe(ResultKind.Ok, "kind wasn't OK");
    if (result.kind !== ResultKind.Ok) return;
    expect(result).toHaveMember("value", "reason value");
    expect(result).not.toHaveMember("reason", "unexpected 'reason' attribute");
    if (value !== undefined) {
        if (!isPlainObject(value)) {
            expect(result.value).toEqual(value);
        } else {
            expect(result.value).toBeLike(value as any);
        }
    }
}

beforeEach(() => {
    jasmine.addMatchers(CustomMatchers);
});
