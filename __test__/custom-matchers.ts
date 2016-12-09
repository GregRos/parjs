import {ResultKind, ParserResult} from "../src/abstract/basics/result";
/**
 * Created by lifeg on 09/12/2016.
 */
type SuccessArgs = {
    value ?: any;
    state ?: any;
};
type FailArgs = {
    state ?: any;
    kind ?: ResultKind;
};

declare global {
    namespace jasmine {
        interface Matchers {
            toBeAnyOf(options : any[], failMessage ?: string);
            toHaveType(type : string, failMessage ?: string);
            toHaveMember(name : string, failMessage ?: string);
        }
    }

}

class CustomMatcherDefs {
    actual : any;
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
    toHaveType(type, failMessage) {
        let pass = typeof this.actual === type;
        return {
            pass: pass,
            message: pass ? undefined : failMessage
        };
    }

    toHaveMember(name, failMessage) {
        let pass = name in this.actual;
        return {
            pass: pass,
            message: pass ? undefined : failMessage
        }
    }
}

export const CustomMatchers = {

} as any;

let defs = new CustomMatcherDefs();
for (let prop in defs) {
    if (defs.hasOwnProperty(prop)) continue;

    CustomMatchers[prop] = function(a, b) {
        return {
            compare: function (actual, ...rest) {
                defs.actual = actual;
                return defs[prop](...rest);
            }
        }
    }
}

export function verifyFailure(result : ParserResult<any>, failType ?: ResultKind, state ?: any) {
    expect(result.kind).toBeAnyOf([ResultKind.FatalFail, ResultKind.HardFail, ResultKind.SoftFail], "expected kind to be a Fail");
    if (result.kind === ResultKind.OK) return;
    if (failType !== undefined){
        expect(result.kind).toBe(failType);
    }

    expect(result.expecting).toHaveType("string", "invaid 'expecting' value");
    if (state !== undefined) {
        expect(result.state).toBe(state);
    }
}

export function verifySuccess(result : ParserResult<any>, value ?: any, state ?: any) {
    expect(result.kind).toBe(ResultKind.OK, "kind wasn't OK");
    if (result.kind !== ResultKind.OK) return;
    expect(result).toHaveMember("value", "expecting value");
    expect(result).not.toHaveMember("expecting", "unexpected 'expecting' attribute");
    if (value !== undefined) {
        expect(result.value).toBe(value);
    }
    if (state !== undefined) {
        expect(result.state).toBe(state);
    }
}

beforeEach(() => {
    jasmine.addMatchers(CustomMatchers);
});