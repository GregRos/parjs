"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module parjs/internal/implementation
 */ /** */
const common_1 = require("./common");
const action_1 = require("./action");
const reply_1 = require("../../reply");
const reply_2 = require("../reply");
const _ = require("lodash");
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
                ps.expecting = "unexpected end of input";
            }
        }
        if (ps.kind === reply_1.ReplyKind.Unknown) {
            throw new Error("should not happen.");
        }
        let ret;
        if (ps.kind === reply_1.ReplyKind.OK) {
            return Object.assign(new reply_2.SuccessReply(ps.value === common_1.QUIET_RESULT ? undefined : ps.value));
        }
        else {
            return new reply_2.FailureReply(ps.kind, {
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