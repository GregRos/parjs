import {Reply, ReplyKind} from "../../lib/reply";
import _matches = require("lodash/matches");
import _isPlainObject = require("lodash/isPlainObject");

/**
 * Created by lifeg on 09/12/2016.
 */

declare global {
    namespace jasmine {
        interface Matchers<T> {
            toBeAnyOf(options: any[], failMessage ?: string);

            toHaveType(type: string, failMessage ?: string);

            toHaveMember(name: string, failMessage ?: string);

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
        let pass = _matches(o)(this.actual);
        return {
            pass,
            message: pass ? undefined : failMessage
        };
    }

    toHaveType(type, failMessage) {
        let pass = typeof this.actual === type;
        return {
            pass,
            message: pass ? undefined : failMessage
        };
    }

    toHaveMember(name, failMessage) {
        let pass = name in this.actual;
        return {
            pass,
            message: pass ? undefined : failMessage
        };
    }
}

export const CustomMatchers = {} as any;

let defs = CustomMatcherDefs.prototype;

for (let prop of Object.getOwnPropertyNames(defs)) {
    if (prop === "constructor") continue;

    CustomMatchers[prop] = function(a, b) {
        return {
            compare(actual, ...rest) {
                defs.actual = actual;
                return defs[prop](...rest);
            }
        };
    };
}

export function expectFailure(result: Reply<any>, failType ?: ReplyKind.Fail) {
    expect(result.kind).toBeAnyOf([ReplyKind.FatalFail, ReplyKind.HardFail, ReplyKind.SoftFail], "expected kind to be a Fail");
    if (result.kind === ReplyKind.Ok) return;
    if (failType !== undefined) {
        expect(result.kind).toBe(failType);
    }

    expect(result.trace.reason).toHaveType("string", "invaid 'reason' value");
}

export function expectSuccess<T>(result: Reply<T>, value ?: T, state ?: object) {
    expect(result.kind).toBe(ReplyKind.Ok, "kind wasn't OK");
    if (result.kind !== ReplyKind.Ok) return;
    expect(result).toHaveMember("value", "reason value");
    expect(result).not.toHaveMember("expecting", "unexpected 'reason' attribute");
    if (value !== undefined) {
        if (!_isPlainObject(value)) {
            expect(result.value).toEqual(value);
        } else {
            expect(result.value).toBeLike(value as any);
        }

    }
}

export interface FailArgs {
    type?: ReplyKind.Fail;
    state?: any;
}

export interface SuccessArgs {
    value?: any;
    state?: any;
}

export interface ExpectResult {
    toFail(args ?: FailArgs);

    toSucceed(args ?: SuccessArgs);
}

export function expectResult(result: Reply<any>): ExpectResult {
    return {
        toFail(args) {
            args = args || {};
            expectFailure(result, args.type);
        },
        toSucceed(args) {
            args = args || {};
            expectSuccess(result, args.value);
        }
    };
}

beforeEach(() => {
    jasmine.addMatchers(CustomMatchers);
});