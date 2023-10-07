import { UserState, string } from "../../../lib";
import { manyBetween, manyTill } from "../../../lib/combinators";
import { ResultKind } from "../../../lib/internal/result";
import { expectFailure, expectSuccess } from "../../helpers/custom-matchers";

describe("the manyTill combinator", () => {
    const parser = string("a").pipe(manyTill("b"));

    it("succeeds when the given parser succeeds", () => {
        expectSuccess(parser.parse("aaab"), ["a", "a", "a"]);
    });

    it("fails softly if original fails softly", () => {
        expectFailure(parser.parse("c"), ResultKind.SoftFail);
    });

    it("fails hard if the 'till' parser fails", () => {
        expectFailure(parser.parse("ax"), ResultKind.HardFail);
    });
});

describe("the manyBetween combinator", () => {
    describe("without a projection function", () => {
        it("succeeds when all parsers succeed", () => {
            const parser = string("a").pipe(manyBetween("(", ")"));
            expectSuccess(parser.parse("(aaa)"), ["a", "a", "a"]);
        });

        it("fails softly when the source parser fails softly", () => {
            const parser = string("a").pipe(manyBetween("(", ")"));
            expectFailure(parser.parse("a"), ResultKind.SoftFail);
        });

        it("defaults the 'till' parser to 'start'", () => {
            const parser = string("a").pipe(manyBetween("_"));
            expectSuccess(parser.parse("_a_"), ["a"]);
        });
    });

    describe("with a projection function", () => {
        const projection = (results: string[], till: string, state: UserState): string => {
            console.log(results);
            return [...results, till].join(",");
        };
        const parser = string("a").pipe(manyBetween("(", ")", projection));

        it("passes results to the projection function", () => {
            expectSuccess(parser.parse("(aaa)"), "a,a,a,)");
        });
    });
});
