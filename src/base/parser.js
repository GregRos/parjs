"use strict";
const common_1 = require("../implementation/common");
const action_1 = require("./action");
const result_1 = require("../abstract/basics/result");
const parsing_failure_1 = require("./parsing-failure");
const _ = require("lodash");
/**
 * Created by User on 22-Nov-16.
 */
/**
 * The base Parjs parser class, which supports only basic parsing operations. Should not be used in user code.
 */
class BaseParjsParser {
    constructor(action) {
        this.action = action;
    }
    get displayName() {
        return this.action.displayName;
    }
    set displayName(name) {
        this.action.displayName = name;
    }
    parse(input, initialState) {
        if (typeof input !== "string") {
            //catches input === undefined, null
            throw new Error("input must be a valid string");
        }
        let { action, isLoud } = this;
        let ps = new action_1.BasicParsingState(input);
        ps.state = _.defaults({}, initialState);
        try {
            action.apply(ps);
        }
        catch (ex) {
            if (ex instanceof parsing_failure_1.ParsingFailureSignal) {
                ps.kind = ex.level;
                ps.expecting = ex.message;
            }
            else {
                throw ex;
            }
        }
        if (ps.isOk) {
            if (ps.position !== input.length) {
                ps.kind = result_1.ResultKind.SoftFail;
                ps.expecting = "unexpected end of input";
            }
        }
        if (ps.kind === result_1.ResultKind.Unknown) {
            throw new Error("should not happen.");
        }
        let ret;
        if (ps.kind === result_1.ResultKind.OK) {
            return Object.assign(new result_1.SuccessResult(ps.value === common_1.QUIET_RESULT ? undefined : ps.value));
        }
        else {
            return new result_1.FailResult(ps.kind, {
                state: ps.state,
                position: ps.position,
                expecting: ps.expecting
            });
        }
    }
    get isLoud() {
        return this.action.isLoud;
    }
}
exports.BaseParjsParser = BaseParjsParser;
//# sourceMappingURL=parser.js.map