/**
 * Created by User on 09-Jan-17.
 */
import _ = require('lodash');
import {expectFailure, expectSuccess} from '../../custom-matchers';
import {LoudParser} from "../../../src/abstract/combinators/loud";
import {Parjs} from "../../../src/bindings/parsers";
import {ResultKind} from "../../../src/abstract/basics/result";
import {AnyParser} from "../../../src/abstract/combinators/any";
let goodInput = "abcd";
describe("special combinators", () => {
    describe("backtrack", () => {
        let parser = Parjs.string("hi").then(Parjs.eof).backtrack;

        it("fails soft if inner fails soft", () => {
            expectFailure(parser.parse("x"), "SoftFail");
        });

        it("fails hard if inner fails hard", () => {
            expectFailure(parser.parse("hiAQ"), "HardFail");
        });

        it("succeeds if inner succeeds, non-zero match", () => {
            let parseHi = Parjs.string("hi");
            let redundantParser = parseHi.backtrack.then(Parjs.string("his"));
            expectSuccess(redundantParser.parse("his"), ["hi", "his"]);
        })
    });

    describe("withState", () => {
        let parser = Parjs.string("hi").then(Parjs.string("hi")).str.withState(s => 12);
        it("fails soft if inner fails soft", () => {
            expectFailure(parser.parse("a"), "SoftFail");
        });
        it("fails hard if inner fails hard", () => {
            expectFailure(parser.parse("hi"), "HardFail");
        });
        it("succeeds if inner succeeds, changes state", () => {
            expectSuccess(parser.parse("hihi"), "hihi", 12);
        });

        let parser2 = parser.then(Parjs.eof);
        it("chains state correctly", () => {
            expectSuccess(parser.parse("hihi"), "hihi", 12);
        });

        it("two state changes", () => {
            let parser3 = parser2.withState(() => "abc");
            expectSuccess(parser3.parse("hihi"), "hihi", "abc");
        });

        it("value overload", () => {
            let parser3 = parser2.withState("def");
            expectSuccess(parser3.parse("hihi"), "hihi", "def");
        })

    })
});