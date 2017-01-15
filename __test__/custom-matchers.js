"use strict";
var result_1 = require("../dist/abstract/basics/result");
var CustomMatcherDefs = (function () {
    function CustomMatcherDefs() {
    }
    CustomMatcherDefs.prototype.toBeAnyOf = function (expecteds, failMessage) {
        var result;
        for (var i = 0, l = expecteds.length; i < l; i++) {
            if (this.actual === expecteds[i]) {
                result = true;
                break;
            }
        }
        return {
            pass: result,
            message: result ? undefined : failMessage
        };
    };
    CustomMatcherDefs.prototype.toHaveType = function (type, failMessage) {
        var pass = typeof this.actual === type;
        return {
            pass: pass,
            message: pass ? undefined : failMessage
        };
    };
    CustomMatcherDefs.prototype.toHaveMember = function (name, failMessage) {
        var pass = name in this.actual;
        return {
            pass: pass,
            message: pass ? undefined : failMessage
        };
    };
    return CustomMatcherDefs;
}());
exports.CustomMatchers = {};
var defs = new CustomMatcherDefs();
var _loop_1 = function (prop) {
    if (defs.hasOwnProperty(prop))
        return "continue";
    exports.CustomMatchers[prop] = function (a, b) {
        return {
            compare: function (actual) {
                var rest = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    rest[_i - 1] = arguments[_i];
                }
                defs.actual = actual;
                return defs[prop].apply(defs, rest);
            }
        };
    };
};
for (var prop in defs) {
    _loop_1(prop);
}
function expectFailure(result, failType, state) {
    expect(result.kind).toBeAnyOf([result_1.ResultKind.FatalFail, result_1.ResultKind.HardFail, result_1.ResultKind.SoftFail], "expected kind to be a Fail");
    if (result.kind === result_1.ResultKind.OK)
        return;
    if (failType !== undefined) {
        expect(result.kind).toBe(result_1.toResultKind(failType));
    }
    expect(result.expecting).toHaveType("string", "invaid 'expecting' value");
    if (state !== undefined) {
        expect(result.state).toBe(state);
    }
}
exports.expectFailure = expectFailure;
function expectSuccess(result, value, state) {
    expect(result.kind).toBe(result_1.ResultKind.OK, "kind wasn't OK");
    if (result.kind !== result_1.ResultKind.OK)
        return;
    expect(result).toHaveMember("value", "expecting value");
    expect(result).not.toHaveMember("expecting", "unexpected 'expecting' attribute");
    if (value !== undefined) {
        expect(result.value).toEqual(value);
    }
    if (state !== undefined) {
        expect(result.state).toBe(state);
    }
}
exports.expectSuccess = expectSuccess;
function expectResult(result) {
    return {
        toFail: function (args) {
            args = args || {};
            expectFailure(result, args.type, args.state);
        },
        toSucceed: function (args) {
            args = args || {};
            expectSuccess(result, args.value, args.state);
        }
    };
}
exports.expectResult = expectResult;
beforeEach(function () {
    jasmine.addMatchers(exports.CustomMatchers);
});
//# sourceMappingURL=custom-matchers.js.map