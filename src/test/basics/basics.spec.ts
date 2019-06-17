import {ParjsRejection, ResultKind, ParjsSuccess} from "../../lib/internal/result";
import {expectFailure} from "../helpers/custom-matchers";
import {anyChar} from "../../lib/internal/parsers";

describe("basics: anyChar example", () => {
    let parser = anyChar();
    let successInput = "a";
    let tooMuchInput = "ab";
    let failInput = "";
    let uniqueState = {};
    it("single char input success", () => {
        let result = parser.parse(successInput, uniqueState) as ParjsSuccess<string>;
    });
    it("empty input failure", () => {
        let result = parser.parse(failInput, uniqueState) as ParjsRejection;
        expectFailure(result, ResultKind.SoftFail);
    });

    it("fails on too much input", () => {
        let result = parser.parse(tooMuchInput);
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
            expect(() => parser.parse(null)).toThrow();
            expect(() => parser.parse(undefined)).toThrow();
        });
        it("throws on non-string", () => {
            expect(() => parser.parse(5 as any)).toThrow();
        });
    });
});
