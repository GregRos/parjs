"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by lifeg on 10/12/2016.
 */
const custom_matchers_1 = require("../../custom-matchers");
const src_1 = require("../../../src");
const reply_1 = require("../../../src/reply");
let goodInput = "abcd";
let badInput = "";
let uState = {};
let loudParser = src_1.Parjs.stringLen(4);
describe("map combinators", () => {
    describe("map", () => {
        let parser = loudParser.map(x => 1);
        it("maps on success", () => {
            custom_matchers_1.expectSuccess(parser.parse(goodInput, uState), 1);
        });
        it("fails on failure", () => {
            custom_matchers_1.expectFailure(parser.parse(badInput, uState), reply_1.ReplyKind.SoftFail);
        });
    });
    describe("Parjs.result(1)", () => {
        let parser = loudParser.result(1);
        it("maps on success", () => {
            custom_matchers_1.expectSuccess(parser.parse(goodInput), 1);
        });
        it("fails on failure", () => {
            custom_matchers_1.expectFailure(parser.parse(badInput));
        });
    });
    describe("cast", () => {
        let parser = loudParser.cast();
        it("maps on success", () => {
            custom_matchers_1.expectSuccess(parser.parse(goodInput), "abcd");
        });
        it("fails on failure", () => {
            custom_matchers_1.expectFailure(parser.parse(badInput));
        });
    });
    describe("quiet", () => {
        let parser = loudParser.q;
        it("is quiet", () => {
            expect(parser.isLoud).toBe(false);
        });
        it("maps to undefined on success", () => {
            custom_matchers_1.expectSuccess(parser.parse(goodInput), undefined);
        });
        it("fails on failure", () => {
            custom_matchers_1.expectFailure(parser.parse(badInput));
        });
    });
    describe("str", () => {
        it("quiet", () => {
            let p = src_1.Parjs.eof.str;
            custom_matchers_1.expectSuccess(p.parse(""), "");
        });
        it("array", () => {
            let p = src_1.Parjs.result(["a", "b", "c"]).str;
            custom_matchers_1.expectSuccess(p.parse(""), "abc");
        });
        it("nested array", () => {
            let p = src_1.Parjs.result(["a", ["b", ["c"], "d"], "e"]).str;
            custom_matchers_1.expectSuccess(p.parse(""), "abcde");
        });
        it("null", () => {
            let p = src_1.Parjs.result(null).str;
            custom_matchers_1.expectSuccess(p.parse(""), "null");
        });
        it("undefined", () => {
            let p = src_1.Parjs.result(undefined).str;
            custom_matchers_1.expectSuccess(p.parse(""), "undefined");
        });
        it("string", () => {
            let p = src_1.Parjs.string("a").str;
            custom_matchers_1.expectSuccess(p.parse("a"), "a");
        });
        it("symbol", () => {
            let p = src_1.Parjs.result(Symbol("hi")).str;
            custom_matchers_1.expectSuccess(p.parse(""), "hi");
        });
        it("object", () => {
            let p = src_1.Parjs.result({}).str;
            custom_matchers_1.expectSuccess(p.parse(""), {}.toString());
        });
    });
    describe("act", () => {
        let tally = "";
        let p = src_1.Parjs.anyCharOf("abc").act((result, state) => {
            tally += result;
            state.char = result;
        });
        it("works", () => {
            custom_matchers_1.expectSuccess(p.parse("a"), "a");
            expect(tally).toBe("a");
        });
        it("works 2", () => {
            custom_matchers_1.expectSuccess(p.parse("b"), "b");
            expect(tally).toBe("ab");
        });
        it("fails", () => {
            custom_matchers_1.expectFailure(p.parse("d"), "SoftFail");
            expect(tally).toBe("ab");
        });
    });
});
//# sourceMappingURL=mappers.spec.js.map