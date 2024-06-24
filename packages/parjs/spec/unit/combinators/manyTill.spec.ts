import type { UserState } from "@lib";
import { ResultKind, string } from "@lib";
import { manyBetween, manyTill } from "@lib/combinators";

describe("the manyTill combinator", () => {
    const parser = string("a").pipe(manyTill("b"));

    it("succeeds when the given parser succeeds", () => {
        expect(parser.parse("aaab")).toBeSuccessful(["a", "a", "a"]);
    });

    it("fails softly if original fails softly", () => {
        expect(parser.parse("c")).toBeFailure(ResultKind.SoftFail);
    });

    it("fails hard if the 'till' parser fails", () => {
        expect(parser.parse("ax")).toBeFailure(ResultKind.HardFail);
    });
});

describe("the manyBetween combinator", () => {
    describe("without a projection function", () => {
        it("succeeds when all parsers succeed", () => {
            const parser = string("a").pipe(manyBetween("(", ")"));
            expect(parser.parse("(aaa)")).toBeSuccessful(["a", "a", "a"]);
        });

        it("fails softly when the source parser fails softly", () => {
            const parser = string("a").pipe(manyBetween("(", ")"));
            expect(parser.parse("a")).toBeFailure(ResultKind.SoftFail);
        });

        it("defaults the 'till' parser to 'start'", () => {
            const parser = string("a").pipe(manyBetween("_"));
            expect(parser.parse("_a_")).toBeSuccessful(["a"]);
        });
    });

    describe("with a projection function", () => {
        const projection = (results: string[], till: string, state: UserState): string => {
            return [...results, till].join(",");
        };
        const parser = string("a").pipe(manyBetween("(", ")", projection));

        it("passes results to the projection function", () => {
            expect(parser.parse("(aaa)")).toBeSuccessful("a,a,a,)");
        });
    });
});
