import { ResultKind, string } from "@lib";
import { exactly } from "@lib/combinators";

describe("exactly combinator", () => {
    const parser = string("ab").pipe(exactly(2));

    it("succeeds with exact matches", () => {
        expect(parser.parse("abab")).toBeSuccessful(["ab", "ab"]);
    });

    it("hard fails with 0 < matches <= N", () => {
        expect(parser.parse("ab")).toBeFailure(ResultKind.HardFail);
    });

    it("soft fails with matches == 0", () => {
        expect(parser.parse("a")).toBeFailure(ResultKind.SoftFail);
    });
});
