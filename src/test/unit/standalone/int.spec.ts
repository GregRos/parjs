import { int, rest } from "../../../lib";
import { thenq } from "../../../lib/combinators";
import { ResultKind } from "../../../lib/internal/result";

describe("int parser", () => {
    describe("default settings", () => {
        const parser = int({
            base: 10,
            allowSign: true
        });
        it("fails for empty input", () => {
            expect(parser.parse("")).toBeFailure(ResultKind.SoftFail);
        });
        it("fails for bad digits", () => {
            expect(parser.parse("a")).toBeFailure(ResultKind.SoftFail);
        });
        it("succeeds for sequence of with sign digits", () => {
            expect(parser.parse("-24")).toBeSuccessful(-24);
        });
        it("succeeds for sequence of digits without sign", () => {
            expect(parser.parse("24")).toBeSuccessful(24);
        });
        it("fails for extra letters", () => {
            expect(parser.parse("22a")).toBeFailure(ResultKind.SoftFail);
        });
        it("chains into rest", () => {
            expect(parser.pipe(thenq(rest())).parse("22a")).toBeSuccessful(22);
        });
        it("fails hard if there are no digits after sign", () => {
            expect(parser.parse("+a")).toBeFailure(ResultKind.HardFail);
        });
    });
    describe("no sign", () => {
        const parser = int({
            base: 16,
            allowSign: false
        });
        it("fails for sign start", () => {
            expect(parser.parse("-f")).toBeFailure(ResultKind.SoftFail);
        });
        it("succeeds without sign, higher base", () => {
            expect(parser.parse("f")).toBeSuccessful(15);
        });
    });
});
