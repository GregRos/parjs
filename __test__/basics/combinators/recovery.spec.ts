/**
 * Created by lifeg on 12/12/2016.
 */
import {expectFailure, expectSuccess} from '../../custom-matchers';
import {LoudParser} from "../../../dist/abstract/combinators/loud";
import {Parjs} from "../../../dist/bindings/parsers";
import {ResultKind} from "../../../dist/abstract/basics/result";
import {AnyParser} from "../../../dist/abstract/combinators/any";
import _ = require('lodash');

function forParser<TParser extends AnyParser>(parser : TParser, f : (action : TParser) => void) {
    describe(`Parjs.${parser.displayName}`, () => {
        f(parser);
    });
}

describe("or combinator", () => {
    it("guards against loud-quiet parser mixing", () => {
        expect(() => Parjs.any(Parjs.digit as any, Parjs.digit.q)).toThrow();
    });
    it("guards against quiet-orVal", () => {
        expect(() => (Parjs.eof as any as LoudParser<any>).orVal(1)).toThrow();
    });

    describe("empty or", () => {
        let parser = Parjs.any();
        it("fails on non-empty input", () => {
            expectFailure(parser.parse("hi"), "SoftFail");
        });
        it("fails on empty input", () => {
            expectFailure(parser.parse(""), "SoftFail");
        });
        it("is loud", () => {
            expect(parser.isLoud).toBe(true);
        })
    });
    describe("loud or loud", () => {
        let parser = Parjs.string("ab").or(Parjs.string("cd"));
        it("succeeds parsing 1st option", () => {
            expectSuccess(parser.parse("ab"), "ab");
        });
        it("suceeds parsing 2nd option", () => {
            expectSuccess(parser.parse("cd"), "cd");
        });
        it("fails parsing both", () => {
            expectFailure(parser.parse("ef"), ResultKind.SoftFail);
        });
        it("fails hard when 1st fails hard", () => {
            let parser2 = Parjs.fail("fail", ResultKind.HardFail).result("x").or(Parjs.string("ab"));
            expectFailure(parser2.parse("ab"), ResultKind.HardFail);
        });
        let parser2 = Parjs.string("ab").or(Parjs.fail("x", ResultKind.HardFail));
        it("succeeds with 2nd would've failed hard", () => {
            expectSuccess(parser2.parse("ab"), "ab");
        });
        it("fails when 2nd fails hard", () => {
            expectFailure(parser2.parse("cd"), ResultKind.HardFail);
        });
    });

    describe("quiet or quiet", () => {
        let parser = Parjs.string("ab").q.or(Parjs.string("cd").q);
        it("succeeds parsing 2nd, no return", () => {
            expectSuccess(parser.parse("cd"), undefined);
        });
    });
});

describe("or val combinator", () => {
    let parser = Parjs.string("a").then(Parjs.string("b")).str.orVal("c");
    it("succeeds to parse", () => {
        expectSuccess(parser.parse("ab"), "ab");
    });

    it("if first fails hard, then fail hard", () => {
        expectFailure(parser.parse("ax"), ResultKind.HardFail);
    });

    it("if first fail soft, then return value", () => {
        expectSuccess(parser.parse(""), "c");
    });
});

describe("not combinator", () => {
    let parser = Parjs.string("a").then(Parjs.string("b")).str.not;
    it("succeeds on empty input/soft fail", () => {
        expectSuccess(parser.parse(""), undefined);
    });
    it("succeeds on hard fail if we take care of the rest", () => {
        let parser2 = parser.then(Parjs.rest);
        expectSuccess(parser2.parse("a"));
    });
    it("soft fails on passing input", () => {
        expectFailure(parser.parse("ab"), ResultKind.SoftFail);
    });
    it("fails fatally on fatal fail", () => {
        let parser2 = Parjs.fail("fatal", ResultKind.FatalFail).not;
        expectFailure(parser2.parse(""), ResultKind.FatalFail);
    });
    it("fails on too much input", () => {
        expectFailure(parser.parse("a"), ResultKind.SoftFail);
    });
});

describe("soft combinator", () => {
    let parser = Parjs.string("a").then(Parjs.string("b")).str.soft;
    it("succeeds", () => {
        expectSuccess(parser.parse("ab"), "ab");
    });
    it("fails softly on soft fail", () => {
        expectFailure(parser.parse("ba"), ResultKind.SoftFail);
    });
    it("fails softly on hard fail", () => {
        expectFailure(parser.parse("a"), ResultKind.SoftFail);
    });
    it("fails fatally on fatal fail", () => {
        let parser2 = Parjs.fail("fatal", ResultKind.FatalFail).soft;
        expectFailure(parser2.parse(""), ResultKind.FatalFail);
    });
});