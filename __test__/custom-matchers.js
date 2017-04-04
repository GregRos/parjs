"use strict";
const result_1 = require("../dist/abstract/basics/result");
class CustomMatcherDefs {
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
        };
    }
}
exports.CustomMatchers = {};
let defs = new CustomMatcherDefs();
for (let prop in defs) {
    if (defs.hasOwnProperty(prop))
        continue;
    exports.CustomMatchers[prop] = function (a, b) {
        return {
            compare: function (actual, ...rest) {
                defs.actual = actual;
                return defs[prop](...rest);
            }
        };
    };
}
function expectFailure(result, failType, state) {
    expect(result.kind).toBeAnyOf([result_1.ResultKind.FatalFail, result_1.ResultKind.HardFail, result_1.ResultKind.SoftFail], "expected kind to be a Fail");
    if (result.kind === result_1.ResultKind.OK)
        return;
    if (failType !== undefined) {
        expect(result.kind).toBe(failType);
    }
    expect(result.trace.expecting).toHaveType("string", "invaid 'expecting' value");
    if (state !== undefined) {
        expect(result.trace.state).toBe(state);
    }
}
exports.expectFailure = expectFailure;
function expectSuccess(result, value) {
    expect(result.kind).toBe(result_1.ResultKind.OK, "kind wasn't OK");
    if (result.kind !== result_1.ResultKind.OK)
        return;
    expect(result).toHaveMember("value", "expecting value");
    expect(result).not.toHaveMember("expecting", "unexpected 'expecting' attribute");
    if (value !== undefined) {
        expect(result.value).toEqual(value);
    }
}
exports.expectSuccess = expectSuccess;
function expectResult(result) {
    return {
        toFail(args) {
            args = args || {};
            expectFailure(result, args.type, args.state);
        },
        toSucceed(args) {
            args = args || {};
            expectSuccess(result, args.value);
        }
    };
}
exports.expectResult = expectResult;
beforeEach(() => {
    jasmine.addMatchers(exports.CustomMatchers);
});
//# sourceMappingURL=custom-matchers.js.map