"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by lifeg on 12/12/2016.
 */
const custom_matchers_1 = require("../../custom-matchers");
const dist_1 = require("../../../dist");
const reply_1 = require("../../../dist/reply");
function forParser(parser, f) {
    describe(`Parjs.${parser.displayName}`, () => {
        f(parser);
    });
}
describe("or combinator", () => {
    it("guards against loud-quiet parser mixing", () => {
        expect(() => dist_1.Parjs.any(dist_1.Parjs.digit, dist_1.Parjs.digit.q)).toThrow();
    });
    it("guards against quiet-orVal", () => {
        expect(() => dist_1.Parjs.eof.orVal(1)).toThrow();
    });
    describe("empty or", () => {
        let parser = dist_1.Parjs.any();
        it("fails on non-empty input", () => {
            custom_matchers_1.expectFailure(parser.parse("hi"), "SoftFail");
        });
        it("fails on empty input", () => {
            custom_matchers_1.expectFailure(parser.parse(""), "SoftFail");
        });
        it("is loud", () => {
            expect(parser.isLoud).toBe(true);
        });
    });
    describe("loud or loud", () => {
        let parser = dist_1.Parjs.string("ab").or(dist_1.Parjs.string("cd"));
        it("succeeds parsing 1st option", () => {
            custom_matchers_1.expectSuccess(parser.parse("ab"), "ab");
        });
        it("suceeds parsing 2nd option", () => {
            custom_matchers_1.expectSuccess(parser.parse("cd"), "cd");
        });
        it("fails parsing both", () => {
            custom_matchers_1.expectFailure(parser.parse("ef"), reply_1.ReplyKind.SoftFail);
        });
        it("fails hard when 1st fails hard", () => {
            let parser2 = dist_1.Parjs.fail("fail", reply_1.ReplyKind.HardFail).result("x").or(dist_1.Parjs.string("ab"));
            custom_matchers_1.expectFailure(parser2.parse("ab"), reply_1.ReplyKind.HardFail);
        });
        let parser2 = dist_1.Parjs.string("ab").or(dist_1.Parjs.fail("x", reply_1.ReplyKind.HardFail));
        it("succeeds with 2nd would've failed hard", () => {
            custom_matchers_1.expectSuccess(parser2.parse("ab"), "ab");
        });
        it("fails when 2nd fails hard", () => {
            custom_matchers_1.expectFailure(parser2.parse("cd"), reply_1.ReplyKind.HardFail);
        });
    });
    describe("quiet or quiet", () => {
        let parser = dist_1.Parjs.string("ab").q.or(dist_1.Parjs.string("cd").q);
        it("succeeds parsing 2nd, no return", () => {
            custom_matchers_1.expectSuccess(parser.parse("cd"), undefined);
        });
    });
});
describe("or val combinator", () => {
    let parser = dist_1.Parjs.string("a").then(dist_1.Parjs.string("b")).str.orVal("c");
    it("succeeds to parse", () => {
        custom_matchers_1.expectSuccess(parser.parse("ab"), "ab");
    });
    it("if first fails hard, then fail hard", () => {
        custom_matchers_1.expectFailure(parser.parse("ax"), reply_1.ReplyKind.HardFail);
    });
    it("if first fail soft, then return value", () => {
        custom_matchers_1.expectSuccess(parser.parse(""), "c");
    });
});
describe("not combinator", () => {
    let parser = dist_1.Parjs.string("a").then(dist_1.Parjs.string("b")).str.not;
    it("succeeds on empty input/soft fail", () => {
        custom_matchers_1.expectSuccess(parser.parse(""), undefined);
    });
    it("succeeds on hard fail if we take care of the rest", () => {
        let parser2 = parser.then(dist_1.Parjs.rest);
        custom_matchers_1.expectSuccess(parser2.parse("a"));
    });
    it("soft fails on passing input", () => {
        custom_matchers_1.expectFailure(parser.parse("ab"), reply_1.ReplyKind.SoftFail);
    });
    it("fails fatally on fatal fail", () => {
        let parser2 = dist_1.Parjs.fail("fatal", reply_1.ReplyKind.FatalFail).not;
        custom_matchers_1.expectFailure(parser2.parse(""), reply_1.ReplyKind.FatalFail);
    });
    it("fails on too much input", () => {
        custom_matchers_1.expectFailure(parser.parse("a"), reply_1.ReplyKind.SoftFail);
    });
});
describe("soft combinator", () => {
    let parser = dist_1.Parjs.string("a").then(dist_1.Parjs.string("b")).str.soft;
    it("succeeds", () => {
        custom_matchers_1.expectSuccess(parser.parse("ab"), "ab");
    });
    it("fails softly on soft fail", () => {
        custom_matchers_1.expectFailure(parser.parse("ba"), reply_1.ReplyKind.SoftFail);
    });
    it("fails softly on hard fail", () => {
        custom_matchers_1.expectFailure(parser.parse("a"), reply_1.ReplyKind.SoftFail);
    });
    it("fails fatally on fatal fail", () => {
        let parser2 = dist_1.Parjs.fail("fatal", reply_1.ReplyKind.FatalFail).soft;
        custom_matchers_1.expectFailure(parser2.parse(""), reply_1.ReplyKind.FatalFail);
    });
});
//# sourceMappingURL=recovery.spec.js.map