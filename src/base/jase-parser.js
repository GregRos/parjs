"use strict";
/**
 * Created by User on 22-Nov-16.
 */
var JaseBaseParser = (function () {
    function JaseBaseParser(action) {
        this.action = action;
    }
    JaseBaseParser.prototype.parse = function (input) {
        var _a = this, action = _a.action, isLoud = _a.isLoud;
        var ps = {
            input: input,
            position: 0,
            state: undefined,
            result: undefined,
            signal: undefined
        };
        if (action.apply(ps) && ps.position === input.length) {
            if (isLoud) {
                return {
                    result: ps.result,
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
    Object.defineProperty(JaseBaseParser.prototype, "isLoud", {
        get: function () {
            return this.action.isLoud;
        },
        enumerable: true,
        configurable: true
    });
    return JaseBaseParser;
}());
exports.JaseBaseParser = JaseBaseParser;
//# sourceMappingURL=jase-parser.js.map