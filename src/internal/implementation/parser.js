"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation
 */ /** */
const special_results_1 = require("./special-results");
const action_1 = require("./action");
const reply_1 = require("../../reply");
const reply_2 = require("../reply");
const _ = require("lodash");
function getErrorLocation(ps) {
    let endln = /\r\n|\n|\r/g;
    let { input, position } = ps;
    let lastPos = 0;
    let oldPos = 0;
    let result;
    let line = 0;
    while (!!(result = endln.exec(ps.input)) && result.index <= position) {
        oldPos = lastPos;
        lastPos = result.index;
        line++;
    }
    result = !result ? null : endln.exec(ps.input);
    return {
        row: line,
        column: line === 0 ? position : lastPos - oldPos
    };
}
class ParserState {
}
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
        ps.state = _.defaults(new ParserState(), initialState);
        action.apply(ps);
        if (ps.isOk) {
            if (ps.position !== input.length) {
                ps.kind = reply_1.ReplyKind.SoftFail;
                ps.expecting = "parsers did not consume all input";
            }
        }
        if (ps.kind === reply_1.ReplyKind.Unknown) {
            throw new Error("should not happen.");
        }
        let ret;
        if (ps.kind === reply_1.ReplyKind.OK) {
            return new reply_2.SuccessReply(ps.value === special_results_1.QUIET_RESULT ? undefined : ps.value);
        }
        else {
            let location = getErrorLocation(ps);
            let trace = {
                state: ps.state,
                position: ps.position,
                expecting: ps.expecting,
                input: input,
                location: location,
                stackTrace: ps.stack,
                kind: ps.kind
            };
            return new reply_2.FailureReply(trace);
        }
    }
    get isLoud() {
        return this.action.isLoud;
    }
}
exports.BaseParjsParser = BaseParjsParser;
//# sourceMappingURL=parser.js.map