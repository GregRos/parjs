"use strict";
const result_1 = require("../../../dist/abstract/basics/result");
const custom_matchers_1 = require("../../custom-matchers");
const parsers_1 = require("../../../dist/bindings/parsers");
/**
 * Created by lifeg on 16/12/2016.
 */
function forParser(parser, f) {
    describe(`Parjs.${parser.displayName}`, () => {
        f(parser);
    });
}
describe("special parsers", () => {
    describe("Parjs.eof", () => {
        let parser = parsers_1.Parjs.eof;
        let fail = "a";
        let success = "";
        it("success on empty input", () => {
            custom_matchers_1.expectSuccess(parser.parse(success), undefined);
        });
        it("fail on non-empty input", () => {
            custom_matchers_1.expectFailure(parser.parse(fail), result_1.ResultKind.SoftFail);
        });
        it("chain multiple EOF succeeds", () => {
            let parser2 = parser.then(parsers_1.Parjs.eof);
            custom_matchers_1.expectSuccess(parser2.parse(""), undefined);
        });
    });
    describe("Parjs.state", () => {
        let parser = parsers_1.Parjs.state;
        let uState = { tag: 1 };
        let someInput = "abcd";
        let noInput = "";
        it("fails on non-empty input", () => {
            let result = parser.parse(someInput, uState);
            custom_matchers_1.expectFailure(result);
        });
    });
    describe("Parjs.position", () => {
        let parser = parsers_1.Parjs.position;
        let noInput = "";
        it("succeeds on empty input", () => {
            let result = parser.parse(noInput);
            custom_matchers_1.expectSuccess(result, 0);
        });
        it("fails on non-empty input", () => {
            let result = parser.parse("abc");
            custom_matchers_1.expectFailure(result);
        });
    });
    describe("Parjs.result(x)", () => {
        let parser = parsers_1.Parjs.result("x");
        let noInput = "";
        it("succeeds on empty input", () => {
            custom_matchers_1.expectSuccess(parser.parse(noInput), "x");
        });
        it("fails on non-empty input", () => {
            custom_matchers_1.expectFailure(parser.parse("a"));
        });
    });
    describe("Parjs.fail", () => {
        let parser = parsers_1.Parjs.fail("error", "FatalFail");
        let noInput = "";
        let input = "abc";
        it("fails on no input", () => {
            custom_matchers_1.expectFailure(parser.parse(noInput), result_1.ResultKind.FatalFail);
        });
        it("fails on non-empty input", () => {
            custom_matchers_1.expectFailure(parser.parse(input), result_1.ResultKind.FatalFail);
        });
    });
    describe("Parjs.nop", () => {
        let parser = parsers_1.Parjs.nop;
        it("succeeds on no input", () => {
            custom_matchers_1.expectSuccess(parser.parse(""));
        });
        it("fails on input", () => {
            custom_matchers_1.expectFailure(parser.parse(" "), "SoftFail");
        });
    });
    describe("Parjs.late", () => {
        let s = "";
        let parser = parsers_1.Parjs.late(() => {
            s += "a";
            return parsers_1.Parjs.string(s);
        });
        it("first success", () => {
            custom_matchers_1.expectSuccess(parser.parse("a"), "a");
        });
        it("second success", () => {
            custom_matchers_1.expectSuccess(parser.parse("a"), "a");
        });
        it("fail", () => {
            custom_matchers_1.expectFailure(parser.parse(""), "SoftFail");
        });
    });
});
//# sourceMappingURL=special.spec.js.map