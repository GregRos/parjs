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
const error_location_1 = require("../../built.in.parsers/error.location");
const helpers_1 = require("./functions/helpers");
function getErrorLocation(ps) {
    let endln = /\r\n|\n|\r/g;
    let { input, position } = ps;
    let lastPos = 0;
    let oldPos = -1;
    let result;
    let line = 0;
    while (!!(result = endln.exec(ps.input)) && result.index <= position) {
        oldPos = lastPos;
        lastPos = result.index;
        line++;
    }
    result = endln.exec(ps.input);
    return {
        row: line,
        column: lastPos - oldPos,
        nextLinePosition: result ? result.index + result[0].length : ps.input.length
    };
}
function getVisualization(text, loc, reason) {
    let line = " ".repeat(loc.column - 1) + "^";
    helpers_1.StringHelpers.splice(text, loc.nextLinePosition, line);
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
            return Object.assign(new reply_2.SuccessReply(ps.value === special_results_1.QUIET_RESULT ? undefined : ps.value));
        }
        else {
            let advancedTracing;
            let trace = {
                state: ps.state,
                position: ps.position,
                expecting: ps.expecting,
                input: input
            };
            if (!(error_location_1.infrastructure in this)) {
                let location = getErrorLocation(ps);
                let visualization = getVisualization(ps.input, location, ps.expecting);
                trace.location = location;
                trace.visualization = visualization;
                trace.stackTrace = ps.stack.join(" > ");
            }
            return new reply_2.FailureReply(ps.kind, trace);
        }
    }
    get isLoud() {
        return this.action.isLoud;
    }
}
exports.BaseParjsParser = BaseParjsParser;

//# sourceMappingURL=parser.js.map
