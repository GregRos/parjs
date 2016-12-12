/**
 * Created by lifeg on 12/12/2016.
 */
import {verifyFailure, verifySuccess} from './custom-matchers';
import {LoudParser} from "../src/abstract/combinators/loud";
import {Parjs} from "../src/bindings/parsers";
import {ResultKind} from "../src/abstract/basics/result";
import {AnyParser} from "../src/abstract/combinators/any";
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
if (false) {
    let s = verifySuccess;
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
});