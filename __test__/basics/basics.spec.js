"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const reply_1 = require("../../src/reply");
const custom_matchers_1 = require("../custom-matchers");
describe("basics: anyChar example", () => {
    let parser = src_1.Parjs.anyChar;
    let successInput = "a";
    let tooMuchInput = "ab";
    let failInput = "";
    let uniqueState = {};
    it("single char input success", () => {
        let result = parser.parse(successInput, uniqueState);
    });
    it("empty input failure", () => {
        let result = parser.parse(failInput, uniqueState);
        custom_matchers_1.expectFailure(result, reply_1.ReplyKind.SoftFail);
    });
    it("fails on too much input", () => {
        let result = parser.parse(tooMuchInput);
        custom_matchers_1.expectFailure(result, reply_1.ReplyKind.SoftFail);
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
            expect(() => parser.parse(5)).toThrow();
        });
    });
});
//# sourceMappingURL=basics.spec.js.map