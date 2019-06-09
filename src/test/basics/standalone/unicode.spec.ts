import {ResultKind, uniNewline} from "../../../lib/index";
import {expectFailure, expectSuccess} from "../../helpers/custom-matchers";
import {many} from "../../../lib/combinators";
import {uniDigit, uniLetter} from "../../../lib/internal/parsers/char-types";

describe("unicode strings", () => {

    describe("uniNewline", () => {
        let allNewlines = "\r\r\n\n\u0085\u2028\u2029";
        it("success on all newline string, incl unicode newline", () => {
            let unicodeNewline = uniNewline().pipe(
                many()
            );
            let result = unicodeNewline.parse(allNewlines);
            expect(result.kind).toBe(ResultKind.Ok);
            if (result.kind !== ResultKind.Ok) return;
            expect(result.value.length).toBe(allNewlines.length - 1);
        });
    });
    describe("uniLetter", () => {
        let pl = uniLetter();
        it("parse hebrew success", () => {
            expectSuccess(pl.parse("ש"), "ש");
        });
        it("parse english success", () => {
            expectSuccess(pl.parse("a"), "a");
        });
        it("parse symbol fail", () => {
            expectFailure(pl.parse(":"), ResultKind.SoftFail);
        });
        it("parse digit fail", () => {
            expectFailure(pl.parse("5"), ResultKind.SoftFail);
        });
    });

    describe("uniDigit", () => {
        let pd = uniDigit();
        it("succeeds on w-arabic", () => {
            expectSuccess(pd.parse("4"), "4");
        });
        it("succeeds on e-arabic", () => {
            expectSuccess(pd.parse("١"), "١");
        });
        it("fails on letter", () => {
            expectFailure(pd.parse("a"), ResultKind.SoftFail);
        });
    });
});
