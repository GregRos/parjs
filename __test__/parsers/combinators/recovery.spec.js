"use strict";
/**
 * Created by lifeg on 12/12/2016.
 */
var custom_matchers_1 = require("../../custom-matchers");
var parsers_1 = require("../../../dist/bindings/parsers");
var result_1 = require("../../../dist/abstract/basics/result");
function forParser(parser, f) {
    describe("Parjs." + parser.displayName, function () {
        f(parser);
    });
}
describe("or combinator", function () {
    it("guards against loud-quiet parser mixing", function () {
        expect(function () { return parsers_1.Parjs.any(parsers_1.Parjs.digit, parsers_1.Parjs.digit.quiet); }).toThrow();
    });
    it("guards against quiet-orVal", function () {
        expect(function () { return parsers_1.Parjs.eof.orVal(1); }).toThrow();
    });
    describe("empty or", function () {
        var parser = parsers_1.Parjs.any();
        it("fails on non-empty input", function () {
            custom_matchers_1.expectFailure(parser.parse("hi"), "SoftFail");
        });
        it("fails on empty input", function () {
            custom_matchers_1.expectFailure(parser.parse(""), "SoftFail");
        });
        it("is loud", function () {
            expect(parser.isLoud).toBe(true);
        });
    });
    describe("loud or loud", function () {
        var parser = parsers_1.Parjs.string("ab").or(parsers_1.Parjs.string("cd"));
        it("succeeds parsing 1st option", function () {
            custom_matchers_1.expectSuccess(parser.parse("ab"), "ab");
        });
        it("suceeds parsing 2nd option", function () {
            custom_matchers_1.expectSuccess(parser.parse("cd"), "cd");
        });
        it("fails parsing both", function () {
            custom_matchers_1.expectFailure(parser.parse("ef"), result_1.ResultKind.SoftFail);
        });
        it("fails hard when 1st fails hard", function () {
            var parser2 = parsers_1.Parjs.fail("fail", result_1.ResultKind.HardFail).result("x").or(parsers_1.Parjs.string("ab"));
            custom_matchers_1.expectFailure(parser2.parse("ab"), result_1.ResultKind.HardFail);
        });
        var parser2 = parsers_1.Parjs.string("ab").or(parsers_1.Parjs.fail("x", result_1.ResultKind.HardFail));
        it("succeeds with 2nd would've failed hard", function () {
            custom_matchers_1.expectSuccess(parser2.parse("ab"), "ab");
        });
        it("fails when 2nd fails hard", function () {
            custom_matchers_1.expectFailure(parser2.parse("cd"), result_1.ResultKind.HardFail);
        });
    });
    describe("quiet or quiet", function () {
        var parser = parsers_1.Parjs.string("ab").quiet.or(parsers_1.Parjs.string("cd").quiet);
        it("succeeds parsing 2nd, no return", function () {
            custom_matchers_1.expectSuccess(parser.parse("cd"), undefined);
        });
    });
});
describe("or val combinator", function () {
    var parser = parsers_1.Parjs.string("a").then(parsers_1.Parjs.string("b")).str.orVal("c");
    it("succeeds to parse", function () {
        custom_matchers_1.expectSuccess(parser.parse("ab"), "ab");
    });
    it("if first fails hard, then fail hard", function () {
        custom_matchers_1.expectFailure(parser.parse("ax"), result_1.ResultKind.HardFail);
    });
    it("if first fail soft, then return value", function () {
        custom_matchers_1.expectSuccess(parser.parse(""), "c");
    });
});
describe("not combinator", function () {
    var parser = parsers_1.Parjs.string("a").then(parsers_1.Parjs.string("b")).str.not;
    it("succeeds on empty input/soft fail", function () {
        custom_matchers_1.expectSuccess(parser.parse(""), undefined);
    });
    it("succeeds on hard fail if we take care of the rest", function () {
        var parser2 = parser.then(parsers_1.Parjs.rest);
        custom_matchers_1.expectSuccess(parser2.parse("a"));
    });
    it("soft fails on passing input", function () {
        custom_matchers_1.expectFailure(parser.parse("ab"), result_1.ResultKind.SoftFail);
    });
    it("fails fatally on fatal fail", function () {
        var parser2 = parsers_1.Parjs.fail("fatal", result_1.ResultKind.FatalFail).not;
        custom_matchers_1.expectFailure(parser2.parse(""), result_1.ResultKind.FatalFail);
    });
    it("fails on too much input", function () {
        custom_matchers_1.expectFailure(parser.parse("a"), result_1.ResultKind.SoftFail);
    });
});
describe("soft combinator", function () {
    var parser = parsers_1.Parjs.string("a").then(parsers_1.Parjs.string("b")).str.soft;
    it("succeeds", function () {
        custom_matchers_1.expectSuccess(parser.parse("ab"), "ab");
    });
    it("fails softly on soft fail", function () {
        custom_matchers_1.expectFailure(parser.parse("ba"), result_1.ResultKind.SoftFail);
    });
    it("fails softly on hard fail", function () {
        custom_matchers_1.expectFailure(parser.parse("a"), result_1.ResultKind.SoftFail);
    });
    it("fails fatally on fatal fail", function () {
        var parser2 = parsers_1.Parjs.fail("fatal", result_1.ResultKind.FatalFail).soft;
        custom_matchers_1.expectFailure(parser2.parse(""), result_1.ResultKind.FatalFail);
    });
});
//# sourceMappingURL=recovery.spec.js.map