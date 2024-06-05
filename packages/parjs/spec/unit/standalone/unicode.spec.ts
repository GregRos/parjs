import { ResultKind, uniDecimal, uniLetter, uniNewline } from "@lib";
import { many } from "@lib/combinators";

describe("unicode strings", () => {
    describe("uniNewline", () => {
        const allNewlines = "\r\r\n\n\u0085\u2028\u2029";
        it("success on all newline string, incl unicode newline", () => {
            const unicodeNewline = uniNewline().pipe(many());
            const result = unicodeNewline.parse(allNewlines);
            expect(result.kind).toBe(ResultKind.Ok);
            if (result.kind !== ResultKind.Ok) return;
            expect(result.value.length).toBe(allNewlines.length - 1);
        });
    });
    describe("uniLetter", () => {
        const pl = uniLetter();
        it("parse hebrew success", () => {
            expect(pl.parse("ש")).toBeSuccessful("ש");
        });
        it("parse english success", () => {
            expect(pl.parse("a")).toBeSuccessful("a");
        });
        it("parse symbol fail", () => {
            expect(pl.parse(":")).toBeFailure(ResultKind.SoftFail);
        });
        it("parse digit fail", () => {
            expect(pl.parse("5")).toBeFailure(ResultKind.SoftFail);
        });
    });

    describe("uniDecimal", () => {
        const pd = uniDecimal();
        it("succeeds on w-arabic", () => {
            expect(pd.parse("4")).toBeSuccessful("4");
        });
        it("succeeds on e-arabic", () => {
            expect(pd.parse("١")).toBeSuccessful("١");
        });
        it("fails on letter", () => {
            expect(pd.parse("a")).toBeFailure(ResultKind.SoftFail);
        });
    });
});
