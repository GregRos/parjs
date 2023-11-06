import { ParjsFailure, ResultKind, ParjsSuccess } from "../../lib/internal/result";
import { expectFailure } from "../helpers/custom-matchers";
import { anyChar } from "../../lib/internal/parsers";
import { ParjserBase } from "../../lib/internal";

describe("basics: anyChar example", () => {
    const parser = anyChar();
    const successInput = "a";
    const tooMuchInput = "ab";
    const failInput = "";
    const uniqueState = {};
    it("single char input success", () => {
        parser.parse(successInput, uniqueState) as ParjsSuccess<string>;
    });
    it("empty input failure", () => {
        const result = parser.parse(failInput, uniqueState) as ParjsFailure;
        expectFailure(result, ResultKind.SoftFail);
    });

    it("fails on too much input", () => {
        const result = parser.parse(tooMuchInput);
        expectFailure(result, ResultKind.SoftFail);
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

describe("expects", () => {
    it("is correct", () => {
        const base = anyChar().expects("a character") as ParjserBase<string>;
        const parser = anyChar().expects("a character of some sort") as ParjserBase<string>;
        expect(parser.expecting).toBe("a character of some sort");
        expect(base.expecting).toBe("a character");
    });
});
