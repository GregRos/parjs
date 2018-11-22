import "../../../lib/unicode";
import {Parjs, ReplyKind} from "../../../lib/index";
import {expectFailure, expectSuccess} from "../../helpers/custom-matchers";

describe("unicode strings", () => {

    describe("uniNewline", () => {
        let allNewlines = "\r\r\n\n\u0085\u2028\u2029";
        it("success on all newline string, incl unicode newline", () => {
            let unicodeNewline = Parjs.uniNewline.many();
            let result = unicodeNewline.parse(allNewlines);
            expect(result.kind).toBe(ReplyKind.Ok);
            if (result.kind !== ReplyKind.Ok) return;
            expect(result.value.length).toBe(allNewlines.length - 1);
        });
    });
    describe("uniLetter", () => {
        let pl = Parjs.uniLetter;
        it("parse hebrew success", () => {
            expectSuccess(pl.parse("ש"), "ש");
        });
        it("parse english success", () => {
            expectSuccess(pl.parse("a"), "a");
        });
        it("parse symbol fail", () => {
            expectFailure(pl.parse(":"), ReplyKind.SoftFail);
        });
        it("parse digit fail", () => {
            expectFailure(pl.parse("5"), ReplyKind.SoftFail);
        });
    });

    describe("uniDigit", () => {
        let pd = Parjs.uniDigit;
        it("succeeds on w-arabic", () => {
            expectSuccess(pd.parse("4"), "4");
        });
        it("succeeds on e-arabic", () => {
            expectSuccess(pd.parse("١"), "١");
        });
        it("fails on letter", () => {
            expectFailure(pd.parse("a"), ReplyKind.SoftFail);
        });
    });

    describe("uniUpper", () => {
        let pu = Parjs.uniUpper;
        it("succeeds on latin upper", () => {
            expectSuccess(pu.parse("A"), "A");
        });
        it("suceeds on cyrilic upper", () => {
            expectSuccess(pu.parse("Б"), "Б");
        });
        it("fails on latin lower", () => {
            expectFailure(pu.parse("a"), ReplyKind.SoftFail);
        });
        it("fails on hebrew", () => {
            expectFailure(pu.parse("א"), ReplyKind.SoftFail);
        });
        it("fails on digit", () => {
            expectFailure(pu.parse("4"), ReplyKind.SoftFail);
        })
    });

    describe("uniLower", () => {
        let pl = Parjs.uniLower;
        it("succeeds on latin lower", () => {
            expectSuccess(pl.parse("a"), "a");
        });
        it("succeeds on cyrilic lower", () => {
            expectSuccess(pl.parse("б"), "б");
        });
        it("fails on hebrew", () => {
            expectFailure(pl.parse("א"), ReplyKind.SoftFail);
        });
        it("fails on digit", () => {
            expectFailure(pl.parse("4"), ReplyKind.SoftFail);
        });
    });

    describe("uniSpace", () => {
        let ps = Parjs.uniSpace;
        it("succeeds on space", () => {
            expectSuccess(ps.parse(" "), " ");
        });
        it("succeeds on tab", () => {
            expectSuccess(ps.parse("\t"), "\t");
        });
        it("succeeds on em space", () => {
            expectSuccess(ps.parse(" "), " ");
        });
        it("fails on newline", () => {
            expectFailure(ps.parse("\n"), ReplyKind.SoftFail);
        });
        it("fails on letter", () => {
            expectFailure(ps.parse("f"), ReplyKind.SoftFail);
        });
    })
});