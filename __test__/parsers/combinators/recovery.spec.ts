/**
 * Created by lifeg on 12/12/2016.
 */
import {verifyFailure, verifySuccess} from '../../custom-matchers';
import {LoudParser} from "../../../src/abstract/combinators/loud";
import {Parjs} from "../../../src/bindings/parsers";
import {ResultKind} from "../../../src/abstract/basics/result";
import {AnyParser} from "../../../src/abstract/combinators/any";
import _ = require('lodash');

let goodInput = "abcd";
let badInput = "";
let uState = {};
let loudParser = Parjs.stringLen(4);



function forParser<TParser extends AnyParser>(parser : TParser, f : (action : TParser) => void) {
    describe(`Parjs.${parser.displayName}`, () => {
        f(parser);
    });
}

describe("or combinator", () => {
    it("guards against loud-quiet parser mixing", () => {
        expect(() => Parjs.any(Parjs.digit as any, Parjs.digit.quiet))
    });
    describe("loud or loud", () => {
        let parser = Parjs.string("ab").or(Parjs.string("cd"));
        it("succeeds parsing 1st option", () => {
            verifySuccess(parser.parse("ab"), "ab");
        });
        it("suceeds parsing 2nd option", () => {
            verifySuccess(parser.parse("cd"), "cd");
        });
        it("fails parsing both", () => {
            verifyFailure(parser.parse("ef"), ResultKind.SoftFail);
        });
        it("fails hard when 1st fails hard", () => {
            let parser2 = Parjs.fail("fail", ResultKind.HardFail).result("x").or(Parjs.string("ab"));
            verifyFailure(parser2.parse("ab"), ResultKind.HardFail);
        });
        let parser2 = Parjs.string("ab").or(Parjs.fail("x", ResultKind.HardFail));
        it("succeeds with 2nd would've failed hard", () => {
            verifySuccess(parser2.parse("ab"), "ab");
        });
        it("fails when 2nd fails hard", () => {
            verifyFailure(parser2.parse("cd"), ResultKind.HardFail);
        });
    });

    describe("quiet or quiet", () => {
        let parser = Parjs.string("ab").quiet.or(Parjs.string("cd").quiet);
        it("succeeds parsing 2nd, no return", () => {
            verifySuccess(parser.parse("cd"), undefined);
        });
    });
});

describe("or val combinator", () => {
    let parser = Parjs.string("a").then(Parjs.string("b")).str.orVal("c");
    it("succeeds to parse", () => {
        verifySuccess(parser.parse("ab"), "ab");
    });

    it("if first fails hard, then fail hard", () => {
        verifyFailure(parser.parse("ax"), ResultKind.HardFail);
    });

    it("if first fail soft, then return value", () => {
        verifySuccess(parser.parse(""), "c");
    });
});

describe("not combinator", () => {
    let parser = Parjs.string("a").then(Parjs.string("b")).str.not;
    it("succeeds on empty input/soft fail", () => {
        verifySuccess(parser.parse(""), undefined);
    });
    it("succeeds on hard fail if we take care of the rest", () => {
        let parser2 = parser.then(Parjs.rest);
        verifySuccess(parser2.parse("a"));
    });
    it("soft fails on passing input", () => {
        verifyFailure(parser.parse("ab"), ResultKind.SoftFail);
    });
    it("fails fatally on fatal fail", () => {
        let parser2 = Parjs.fail("fatal", ResultKind.FatalFail).not;
        verifyFailure(parser2.parse(""), ResultKind.FatalFail);
    });
    it("fails on too much input", () => {
        verifyFailure(parser.parse("a"), ResultKind.SoftFail);
    });
});

describe("soft combinator", () => {
    let parser = Parjs.string("a").then(Parjs.string("b")).str.soft;
    it("succeeds", () => {
        verifySuccess(parser.parse("ab"), "ab");
    });
    it("fails softly on soft fail", () => {
        verifyFailure(parser.parse("ba"), ResultKind.SoftFail);
    });
    it("fails softly on hard fail", () => {
        verifyFailure(parser.parse("a"), ResultKind.SoftFail);
    });
    it("fails fatally on fatal fail", () => {
        let parser2 = Parjs.fail("fatal", ResultKind.FatalFail).soft;
        verifyFailure(parser2.parse(""), ResultKind.FatalFail);
    });
});