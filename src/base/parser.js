"use strict";
var action_1 = require("./action");
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
    BaseParjsParser.prototype.parse = function (input) {
        var _a = this, action = _a.action, isLoud = _a.isLoud;
        var ps = new action_1.BasicParsingState(input);
        if (action.apply(ps) && ps.position === input.length) {
            if (isLoud) {
                return {
                    result: ps.value,
                    state: ps.state,
                    hasResult: true
                };
            }
            else {
                return {
                    state: ps.state,
                    hasResult: false
                };
            }
        }
        else {
            return undefined;
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
