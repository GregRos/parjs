import { ParjsResult, ResultKind } from "../../lib/internal/result";
import matches from "lodash/matches";
import isPlainObject from "lodash/isPlainObject";

declare global {
    namespace jasmine {
        interface Matchers<T> {
            toBeAnyOf(options: any[], failMessage?: string);

            toHaveType(type: string, failMessage?: string);

            toHaveMember(name: string, failMessage?: string);

            toBeLike(obj: object);
        }
    }
}

class CustomMatcherDefs {
    actual: any;

    toBeAnyOf(expecteds, failMessage) {
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

    toBeLike(o, failMessage) {
        const pass = matches(o)(this.actual);
        return {
            pass,
            message: pass ? undefined : failMessage
        };
    }

    toHaveType(type, failMessage) {
        const pass = typeof this.actual === type;
        return {
            pass,
            message: pass ? undefined : failMessage
        };
    }

    toHaveMember(name, failMessage) {
        const pass = name in this.actual;
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

    CustomMatchers[prop] = function (a, b) {
        return {
            compare(actual, ...rest) {
                defs.actual = actual;
                return defs[prop](...rest);
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
