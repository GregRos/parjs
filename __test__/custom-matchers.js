"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reply_1 = require("../src/reply");
const _matches = require("lodash/matches");
const _isPlainObject = require("lodash/isPlainObject");
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
    toBeLike(o, failMessage) {
        let pass = _matches(o)(this.actual);
        return {
            pass: pass,
            message: pass ? undefined : failMessage
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
let defs = CustomMatcherDefs.prototype;
for (let prop of Reflect.ownKeys(defs)) {
    if (prop === "constructor")
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
function expectFailure(result, failType) {
    expect(result.kind).toBeAnyOf([reply_1.ReplyKind.FatalFail, reply_1.ReplyKind.HardFail, reply_1.ReplyKind.SoftFail], "expected kind to be a Fail");
    if (result.kind === reply_1.ReplyKind.OK)
        return;
    if (failType !== undefined) {
        expect(result.kind).toBe(failType);
    }
    expect(result.trace.reason).toHaveType("string", "invaid 'reason' value");
}
exports.expectFailure = expectFailure;
function expectSuccess(result, value, state) {
    expect(result.kind).toBe(reply_1.ReplyKind.OK, "kind wasn't OK");
    if (result.kind !== reply_1.ReplyKind.OK)
        return;
    expect(result).toHaveMember("value", "reason value");
    expect(result).not.toHaveMember("expecting", "unexpected 'reason' attribute");
    if (value !== undefined) {
        if (!_isPlainObject(value)) {
            expect(result.value).toEqual(value);
        }
        else {
            expect(result.value).toBeLike(value);
        }
    }
}
exports.expectSuccess = expectSuccess;
function expectResult(result) {
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
exports.expectResult = expectResult;
beforeEach(() => {
    jasmine.addMatchers(exports.CustomMatchers);
});
//# sourceMappingURL=custom-matchers.js.map