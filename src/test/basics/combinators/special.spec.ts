import {expectFailure, expectSuccess} from "../../helpers/custom-matchers";
import {eof, string} from "../../../lib";
import {backtrack, then} from "../../../lib/combinators";

let goodInput = "abcd";
describe("special combinators", () => {
    describe("backtrack", () => {
        let parser = string("hi").pipe(
            then(eof()),
            backtrack()
        )

        it("fails soft if inner fails soft", () => {
            expectFailure(parser.parse("x"), "Soft");
        });

        it("fails hard if inner fails hard", () => {
            expectFailure(parser.parse("hiAQ"), "Hard");
        });

        it("succeeds if inner succeeds, non-zero match", () => {
            let parseHi = string("hi");
            let redundantParser = parseHi.pipe(
                backtrack(),
                then("his")
            );
            expectSuccess(redundantParser.parse("his"), ["hi", "his"]);
        });
    });
});
