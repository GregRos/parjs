import type { UserState } from "@lib";
import { ResultKind, string } from "@lib";
import { manyBetween } from "@lib/combinators";

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

    it("success", () => {
        const res = string("ab")
            .pipe(
                manyBetween("'", "'", (sources, till, state) => {
                    return { sources, till, state };
                })
            )
            .parse("'abab'");
        expect(res.kind).toEqual("OK");
        expect(res.value.sources).toEqual(["ab", "ab"]);
    });
});
