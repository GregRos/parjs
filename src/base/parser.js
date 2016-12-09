"use strict";
var common_1 = require("../implementation/common");
var action_1 = require("./action");
var result_1 = require("../abstract/basics/result");
/**
 * Created by User on 22-Nov-16.
 */
/**
 * The base Parjs parser class, which supports only basic parsing operations. Should not be used in user code.
 */
var BaseParjsParser = (function () {
    function BaseParjsParser(action) {
        this.action = action;
    }
    Object.defineProperty(BaseParjsParser.prototype, "displayName", {
        get: function () {
            return this.action.displayName;
        },
        enumerable: true,
        configurable: true
    });
    BaseParjsParser.prototype.parse = function (input, initialState) {
        if (typeof input !== "string") {
            //catches input === undefined, null
            throw new Error("input must be a valid string");
        }
        var _a = this, action = _a.action, isLoud = _a.isLoud;
        var ps = new action_1.BasicParsingState(input);
        ps.state = initialState;
        action.apply(ps);
        if (ps.isOk) {
            if (ps.position !== input.length) {
                ps.kind = result_1.ResultKind.SoftFail;
                ps.expecting = "unexpected end of input";
            }
        }
        if (ps.kind === result_1.ResultKind.Unknown) {
            throw new Error("should not happen.");
        }
        if (ps.kind === result_1.ResultKind.OK) {
            return {
                value: ps.value === common_1.QUIET_RESULT ? undefined : ps.value,
                state: ps.state,
                kind: result_1.ResultKind.OK
            };
        }
        else {
            return {
                state: ps.state,
                kind: ps.kind,
                expecting: ps.expecting
            };
        }
    };
    Object.defineProperty(BaseParjsParser.prototype, "isLoud", {
        get: function () {
            return this.action.isLoud;
        },
        enumerable: true,
        configurable: true
    });
    return BaseParjsParser;
}());
exports.BaseParjsParser = BaseParjsParser;
//# sourceMappingURL=parser.js.map