import { ResultKind } from "../../../lib/internal/result";
import { float, int, rest } from "../../../lib/";
import { thenq } from "../../../lib/combinators";

describe("numeric parsers", () => {
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

    describe("float parser", () => {
        describe("default settings", () => {
            const parser = float();
            it("regular float", () => {
                expect(parser.parse("0.11")).toBeSuccessful(0.11);
            });
            it("integer", () => {
                expect(parser.parse("15")).toBeSuccessful(15);
            });
            it("float without whole part", () => {
                expect(parser.parse(".1")).toBeSuccessful(0.1);
            });
            it("float without fractional part", () => {
                expect(parser.parse("1.")).toBeSuccessful(1);
            });
            it("integer with positive exponent", () => {
                expect(parser.parse("52e+12")).toBeSuccessful(52e12);
            });
            it("float with negative exponent", () => {
                expect(parser.parse("5.1e-2")).toBeSuccessful(5.1e-2);
            });
            it("float without whole part and exponent", () => {
                expect(parser.parse(".5e+5")).toBeSuccessful(0.5e5);
            });
            it("float without fractional and exponent", () => {
                expect(parser.parse("5.e+2")).toBeSuccessful(5e2);
            });
            it("integer with negative exponent", () => {
                expect(parser.parse("52e-12")).toBeSuccessful(52e-12);
            });
            it("fails soft on dot", () => {
                expect(parser.parse(".")).toBeFailure(ResultKind.SoftFail);
            });
            it("fails on empty input", () => {
                expect(parser.parse("")).toBeFailure(ResultKind.SoftFail);
            });

            it("fails hard on dot after sign", () => {
                expect(parser.parse("+.")).toBeFailure(ResultKind.HardFail);
            });
            it("fails hard on sign and invalid char", () => {
                expect(parser.parse("+a")).toBeFailure(ResultKind.HardFail);
            });
            it("fails soft on invalid char", () => {
                expect(parser.parse("a")).toBeFailure(ResultKind.SoftFail);
            });
            it("fails hard on invalid exponent after sign", () => {
                expect(parser.parse("1.0e+a")).toBeFailure(ResultKind.HardFail);
            });
            it("fails hard on exponent without sign", () => {
                expect(parser.parse("1.0e+")).toBeFailure(ResultKind.HardFail);
            });
            it("fails softly for just exponent", () => {
                expect(parser.parse("e+12")).toBeFailure(ResultKind.SoftFail);
            });
            it("fails when E appears without exponent", () => {
                expect(parser.parse("1.0e")).toBeFailure("Hard");
            });
        });
        describe("no sign", () => {
            const parser = float({
                allowSign: false
            });
            it("fails on sign", () => {
                expect(parser.parse("+1")).toBeFailure(ResultKind.SoftFail);
            });
            it("succeeds on exp without sign", () => {
                expect(parser.parse("1.0e-12")).toBeSuccessful(1.0e-12);
            });
        });
        describe("no implicit zero", () => {
            const parser = float({
                allowImplicitZero: false
            });
            it("fails on implicit zero whole", () => {
                expect(parser.parse(".1")).toBeFailure(ResultKind.SoftFail);
            });
            it("fails hard on sign and then no implicit zero", () => {
                expect(parser.parse("+.1")).toBeFailure("Hard");
            });

            it("succeeds on implicit zero fraction when chained into rest", () => {
                expect(parser.pipe(thenq(rest())).parse("1.")).toBeSuccessful(1);
            });
            it("succeeds on regular", () => {
                expect(parser.parse("1.0")).toBeSuccessful(1.0);
            });
            it("succeeds on exponent", () => {
                expect(parser.parse("1.0e+2")).toBeSuccessful(1.0e2);
            });
            it("asaa", () => {
                expect(parser.parse("1.0e2")).toBeSuccessful(1.0e2);
            });
        });
        describe("no decimal point", () => {
            const parser = float({
                allowFloatingPoint: false
            });
            it("succeeds on integer", () => {
                expect(parser.parse("123")).toBeSuccessful(123);
            });
            it("fails on floating point due to excess input", () => {
                expect(parser.parse("1.0")).toBeFailure(ResultKind.SoftFail);
            });
            it("succeeds on floating point with chained rest", () => {
                expect(parser.pipe(thenq(rest())).parse("1.5")).toBeSuccessful(1);
            });
            it("succeeds on exponent integer", () => {
                expect(parser.parse("23e+2")).toBeSuccessful(23e2);
            });
        });
        describe("no exponent", () => {
            const parser = float({
                allowExponent: false
            });
            it("succeeds on floating point", () => {
                expect(parser.parse("23.12")).toBeSuccessful(23.12);
            });
            it("succeeds on exponent with trailing rest", () => {
                expect(parser.pipe(thenq(rest())).parse("12e+2", { x: 12 })).toBeSuccessful();
            });
        });
    });
});
