import {Parjs} from "../../dist";
import {ReplyKind, Reply} from "../../dist/reply";
import {expectSuccess, expectFailure} from '../custom-matchers';
import {FailureReply, SuccessReply} from "../../src/internal/reply";



describe("basics: anyChar example", () => {
    let parser = Parjs.anyChar;
    let successInput = "a";
    let tooMuchInput = "ab";
    let failInput = "";
    let uniqueState = {};
    it("single char input success", () => {
        let result = parser.parse(successInput, uniqueState) as SuccessReply<string>;
    });
    it("empty input failure", () => {
        let result = parser.parse(failInput, uniqueState) as FailureReply;
        expectFailure(result, ReplyKind.SoftFail);
    });

    it("fails on too much input", () => {
        let result = parser.parse(tooMuchInput);
        expectFailure(result, ReplyKind.SoftFail);
    });

    describe("resolve", () => {
        it("throws", () => {
            expect(() => parser.parse("").resolve()).toThrow()
        });
        it("doesn't throw", () => {
            expect(parser.parse("a").resolve()).toBe("a");
        })
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