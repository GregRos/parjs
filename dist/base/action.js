"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var common_1 = require("../implementation/common");
var chai_1 = require("chai");
var result_1 = require("../abstract/basics/result");
var BasicParsingState = (function () {
    function BasicParsingState(input) {
        this.input = input;
        this.position = 0;
        this.state = undefined;
        this.value = undefined;
    }
    Object.defineProperty(BasicParsingState.prototype, "isOk", {
        get: function () {
            return this.kind === result_1.ResultKind.OK;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasicParsingState.prototype, "isSoft", {
        get: function () {
            return this.kind === result_1.ResultKind.SoftFail;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasicParsingState.prototype, "isHard", {
        get: function () {
            return this.kind === result_1.ResultKind.HardFail;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasicParsingState.prototype, "isFatal", {
        get: function () {
            return this.kind === result_1.ResultKind.FatalFail;
        },
        enumerable: true,
        configurable: true
    });
    return BasicParsingState;
}());
exports.BasicParsingState = BasicParsingState;
/**
 * A parsing action to perform. A parsing action is a fundamental operation that mutates a ParsingState.
 */
var ParjsAction = (function () {
    function ParjsAction() {
    }
    /**
     * Perform the action on the given ParsingState. This is a wrapper around a derived action's _apply method.
     * @param ps The parsing state.
     */
    ParjsAction.prototype.apply = function (ps) {
        var position = ps.position, state = ps.state;
        //we do this to verify that the ParsingState's fields have been correctly set by the action.
        ps.kind = result_1.ResultKind.Unknown;
        ps.expecting = undefined;
        ps.value = common_1.UNINITIALIZED_RESULT;
        this._apply(ps);
        chai_1.assert.notStrictEqual(ps.kind, result_1.ResultKind.Unknown, "the State's result field must be set");
        if (!ps.isOk) {
            ps.value = common_1.FAIL_RESULT;
            ps.expecting = ps.expecting || this.expecting;
        }
        else if (!this.isLoud) {
            ps.value = common_1.QUIET_RESULT;
        }
        else {
            chai_1.assert.notStrictEqual(ps.value, common_1.UNINITIALIZED_RESULT, "a loud parser must set the State's return value if it succeeds.");
        }
        if (!ps.isOk) {
            chai_1.assert.notStrictEqual(ps.expecting, undefined, "if failure then there must be a reason");
        }
    };
    return ParjsAction;
}());
exports.ParjsAction = ParjsAction;
/**
 * Inherited by parser actions for basic parsers (e.g. string or numeric parsers), rather than combinators.
 */
var ParjsBasicAction = (function (_super) {
    __extends(ParjsBasicAction, _super);
    function ParjsBasicAction() {
        var _this = _super.apply(this, arguments) || this;
        _this.isLoud = true;
        return _this;
    }
    return ParjsBasicAction;
}(ParjsAction));
exports.ParjsBasicAction = ParjsBasicAction;

//# sourceMappingURL=action.js.map
