import { fail, rest, ResultKind, string } from "@lib";
import { not, stringify, thenceforth } from "@lib/combinators";

describe("not combinator", () => {
    const parser = string("a").pipe(thenceforth("b"), stringify(), not());
    it("succeeds on empty input/soft fail", () => {
        expect(parser.parse("")).toBeSuccessful(undefined);
    });
    it("succeeds on hard fail if we take care of the rest", () => {
        const parser2 = parser.pipe(thenceforth(rest()));
        expect(parser2.parse("a")).toBeSuccessful();
    });
    it("soft fails on passing input", () => {
        expect(parser.parse("ab")).toBeFailure(ResultKind.SoftFail);
    });
    it("fails fatally on fatal fail", () => {
        const parser2 = fail({
            kind: "Fatal",
            reason: "fatal"
        }).pipe(not());
        expect(parser2.parse("")).toBeFailure(ResultKind.FatalFail);
    });
    it("fails on too much input", () => {
        expect(parser.parse("a")).toBeFailure(ResultKind.SoftFail);
    });
});
