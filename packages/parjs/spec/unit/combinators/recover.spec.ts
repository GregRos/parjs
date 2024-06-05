import { fail, ResultKind, string } from "@lib";
import { recover, stringify, then } from "@lib/combinators";

describe("recover combinator", () => {
    const parser = string("a").pipe(
        then("b"),
        stringify(),
        recover(() => ({ kind: "Soft" }))
    );
    it("succeeds", () => {
        expect(parser.parse("ab")).toBeSuccessful("ab");
        expect(parser.parse("ab")).toBeSuccessful("ab");
    });
    it("fails softly on soft fail", () => {
        expect(parser.parse("ba")).toBeFailure(ResultKind.SoftFail);
    });
    it("fails softly on hard fail", () => {
        expect(parser.parse("a")).toBeFailure(ResultKind.SoftFail);
    });
    it("fails fatally on fatal fail", () => {
        const parser2 = fail({
            kind: "Fatal"
        }).pipe(recover(() => ({ kind: "Soft" })));
        expect(parser2.parse("")).toBeFailure(ResultKind.FatalFail);
    });
});
