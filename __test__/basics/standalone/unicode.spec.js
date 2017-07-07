"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../../src/unicode");
const index_1 = require("../../../src/index");
const custom_matchers_1 = require("../../custom-matchers");
describe("unicode strings", () => {
    describe("uniNewline", () => {
        let allNewlines = "\r\r\n\n\u0085\u2028\u2029";
        it("success on all newline string, incl unicode newline", () => {
            let unicodeNewline = index_1.Parjs.uniNewline.many();
            let result = unicodeNewline.parse(allNewlines);
            expect(result.kind).toBe(index_1.ReplyKind.OK);
            if (result.kind !== index_1.ReplyKind.OK)
                return;
            expect(result.value.length).toBe(allNewlines.length - 1);
        });
    });
    describe("uniLetter", () => {
        let pl = index_1.Parjs.uniLetter;
        it("parse hebrew success", () => {
            custom_matchers_1.expectSuccess(pl.parse("ש"), "ש");
        });
        it("parse english success", () => {
            custom_matchers_1.expectSuccess(pl.parse("a"), "a");
        });
        it("parse symbol fail", () => {
            custom_matchers_1.expectFailure(pl.parse(":"), index_1.ReplyKind.SoftFail);
        });
        it("parse digit fail", () => {
            custom_matchers_1.expectFailure(pl.parse("5"), index_1.ReplyKind.SoftFail);
        });
    });
    describe("uniDigit", () => {
        let pd = index_1.Parjs.uniDigit;
        it("succeeds on w-arabic", () => {
            custom_matchers_1.expectSuccess(pd.parse("4"), "4");
        });
        it("succeeds on e-arabic", () => {
            custom_matchers_1.expectSuccess(pd.parse("١"), "١");
        });
        it("fails on letter", () => {
            custom_matchers_1.expectFailure(pd.parse("a"), index_1.ReplyKind.SoftFail);
        });
    });
    describe("uniUpper", () => {
        let pu = index_1.Parjs.uniUpper;
        it("succeeds on latin upper", () => {
            custom_matchers_1.expectSuccess(pu.parse("A"), "A");
        });
        it("suceeds on cyrilic upper", () => {
            custom_matchers_1.expectSuccess(pu.parse("Б"), "Б");
        });
        it("fails on latin lower", () => {
            custom_matchers_1.expectFailure(pu.parse("a"), index_1.ReplyKind.SoftFail);
        });
        it("fails on hebrew", () => {
            custom_matchers_1.expectFailure(pu.parse("א"), index_1.ReplyKind.SoftFail);
        });
        it("fails on digit", () => {
            custom_matchers_1.expectFailure(pu.parse("4"), index_1.ReplyKind.SoftFail);
        });
    });
    describe("uniLower", () => {
        let pl = index_1.Parjs.uniLower;
        it("succeeds on latin lower", () => {
            custom_matchers_1.expectSuccess(pl.parse("a"), "a");
        });
        it("succeeds on cyrilic lower", () => {
            custom_matchers_1.expectSuccess(pl.parse("б"), "б");
        });
        it("fails on hebrew", () => {
            custom_matchers_1.expectFailure(pl.parse("א"), index_1.ReplyKind.SoftFail);
        });
        it("fails on digit", () => {
            custom_matchers_1.expectFailure(pl.parse("4"), index_1.ReplyKind.SoftFail);
        });
    });
    describe("uniSpace", () => {
        let ps = index_1.Parjs.uniSpace;
        it("succeeds on space", () => {
            custom_matchers_1.expectSuccess(ps.parse(" "), " ");
        });
        it("succeeds on tab", () => {
            custom_matchers_1.expectSuccess(ps.parse("\t"), "\t");
        });
        it("succeeds on em space", () => {
            custom_matchers_1.expectSuccess(ps.parse(" "), " ");
        });
        it("fails on newline", () => {
            custom_matchers_1.expectFailure(ps.parse("\n"), index_1.ReplyKind.SoftFail);
        });
        it("fails on letter", () => {
            custom_matchers_1.expectFailure(ps.parse("f"), index_1.ReplyKind.SoftFail);
        });
    });
});
//# sourceMappingURL=unicode.spec.js.map