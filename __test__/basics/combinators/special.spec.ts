/**
 * Created by User on 09-Jan-17.
 */
import _ = require('lodash');
import {expectFailure, expectSuccess} from '../../custom-matchers';
import {LoudParser} from "../../../dist/loud";
import {Parjs} from "../../../dist";
import {ReplyKind} from "../../../dist/reply";
import {AnyParser} from "../../../dist/any";
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
});