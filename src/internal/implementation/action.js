"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation
 */ /** */
const special_results_1 = require("./special-results");
const chai_1 = require("chai");
const reply_1 = require("../../reply");
function worseThan(a, b) {
    if (a === reply_1.ReplyKind.OK) {
        return b === reply_1.ReplyKind.OK;
    }
    if (a === reply_1.ReplyKind.SoftFail) {
        return b === reply_1.ReplyKind.SoftFail || b === reply_1.ReplyKind.OK;
    }
    if (a === reply_1.ReplyKind.HardFail) {
        return b !== reply_1.ReplyKind.FatalFail;
    }
    if (a === reply_1.ReplyKind.FatalFail) {
        return true;
    }
}
/**
 * Basic implementation of the ParsingState interface.
 */
class BasicParsingState {
    constructor(input) {
        this.input = input;
        this.position = 0;
        this.stack = [];
        this.state = undefined;
        this.value = undefined;
    }
    atLeast(kind) {
        return worseThan(this.kind, kind);
    }
    atMost(kind) {
        return worseThan(kind, this.kind);
    }
    get isOk() {
        return this.kind === reply_1.ReplyKind.OK;
    }
    get isSoft() {
        return this.kind === reply_1.ReplyKind.SoftFail;
    }
    get isHard() {
        return this.kind === reply_1.ReplyKind.HardFail;
    }
    get isFatal() {
        return this.kind === reply_1.ReplyKind.FatalFail;
    }
}
exports.BasicParsingState = BasicParsingState;
/**
 * A parsing action to perform. A parsing action is a fundamental operation that mutates a ParsingState.
 */
class ParjsAction {
    /**
     * Perform the action on the given ParsingState. This is a wrapper around a derived action's _apply method.
     * @param ps The parsing state.
     */
    apply(ps) {
        let { position, state } = ps;
        //we do this to verify that the ParsingState's fields have been correctly set by the action.
        ps.kind = reply_1.ReplyKind.Unknown;
        ps.expecting = undefined;
        ps.value = special_results_1.UNINITIALIZED_RESULT;
        this._apply(ps);
        chai_1.assert.notStrictEqual(ps.kind, reply_1.ReplyKind.Unknown, "the State's kind field must be set");
        if (!ps.isOk) {
            ps.value = special_results_1.FAIL_RESULT;
            ps.expecting = ps.expecting || this.expecting;
        }
        else if (!this.isLoud) {
            ps.value = special_results_1.QUIET_RESULT;
        }
        else {
            chai_1.assert.notStrictEqual(ps.value, special_results_1.UNINITIALIZED_RESULT, "a loud parser must set the State's return value if it succeeds.");
        }
        if (!ps.isOk) {
            chai_1.assert.notStrictEqual(ps.expecting, undefined, "if failure then there must be a reason");
            ps.stack.push(this);
        }
        else {
            ps.stack = [];
        }
    }
}
exports.ParjsAction = ParjsAction;
/**
 * Inherited by parser actions for basic parsers (e.g. string or numeric parsers), rather than combinators.
 */
class ParjsBasicAction extends ParjsAction {
    constructor() {
        super(...arguments);
        this.isLoud = true;
    }
}
exports.ParjsBasicAction = ParjsBasicAction;
//# sourceMappingURL=action.js.map