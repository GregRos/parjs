"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by lifeg on 4/21/2017.
 */
const _1 = require("../");
const _ = require("lodash");
const helpers_1 = require("../internal/implementation/functions/helpers");
exports.infrastructure = Symbol("infrastructure");
let parseUntilPositionReached;
function buildParser() {
    if (parseUntilPositionReached)
        return;
    let protoState = {
        rowIndex: 0,
        colPrefix: ""
    };
    let parseLinebreak = _1.Parjs.newline.act((nl, st) => {
        st.colPrefix = "";
        st.rowIndex++;
        st.realPosition += nl.length;
    }).q;
    let parseOtherChar = _1.Parjs.anyChar.act((c, st) => {
        st.colPrefix += c;
        st.realPosition += c.length;
    }).q;
    parseUntilPositionReached = _1.Parjs.eof.q.or(parseLinebreak.or(parseOtherChar).manyTill(state => {
        return state.seekPosition - 1 >= state.realPosition;
    }).then(_1.Parjs.rest.q)).state.map(s => _.pickBy(s, (v, x) => x in protoState)).mixState(protoState);
    parseUntilPositionReached[exports.infrastructure] = true;
}
function getPositionLocation(text, position) {
    buildParser();
    return parseUntilPositionReached.parse(text, {
        seekPosition: position
    }).resolve();
}
exports.getPositionLocation = getPositionLocation;
function visualizeError(input, position, location) {
    let endline = /(\r\n|\n|\r)/g;
    let split = input.split(endline, location.rowIndex);
    let errorLine = location.colPrefix.split("").map(c => c === "\t" ? "    " : " ").join("") + "^";
    split.splice(location.rowIndex + 1);
    let endlIndex = input.length;
    endline.lastIndex = Math.max(0, position - 1);
    let r = endline.exec(input);
    if (r) {
        endlIndex = endline.lastIndex + r[0].length;
    }
    return helpers_1.StringHelpers.splice(input, endlIndex, errorLine);
}
exports.visualizeError = visualizeError;

//# sourceMappingURL=error.location.js.map
