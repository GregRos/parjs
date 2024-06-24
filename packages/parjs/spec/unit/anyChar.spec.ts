import type { ParjsFailure, ParjsSuccess } from "@lib";
import { ResultKind, anyChar } from "@lib";

describe("anyChar", () => {
    const parser = anyChar();
    const successInput = "a";
    const tooMuchInput = "ab";
    const failInput = "";
    const uniqueState = {};
    it("single char input success", () => {
        const result = parser.parse(successInput, uniqueState) as ParjsSuccess<string>;
        expect(result).toBeSuccessful("a");
    });
    it("empty input failure", () => {
        const result = parser.parse(failInput, uniqueState) as ParjsFailure;
        expect(result).toBeFailure(ResultKind.SoftFail);
    });

    it("fails on too much input", () => {
        const result = parser.parse(tooMuchInput);
        expect(result).toBeFailure(ResultKind.SoftFail);
    });

    describe("resolve", () => {
        it("throws", () => {
            expect(() => parser.parse("").value).toThrow();
        });
        it("doesn't throw", () => {
            expect(parser.parse("a").value).toBe("a");
        });
    });

    describe("non-string inputs", () => {
        it("throws on null, undefined", () => {
            expect(() => parser.parse(null as never)).toThrow();
            expect(() => parser.parse(undefined as never)).toThrow();
        });
        it("throws on non-string", () => {
            expect(() => parser.parse(5 as never)).toThrow();
        });
    });
});
