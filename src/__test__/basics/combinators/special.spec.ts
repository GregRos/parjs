import {expectFailure, expectSuccess} from "../../helpers/custom-matchers";
import {Parjs} from "../../../lib";

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