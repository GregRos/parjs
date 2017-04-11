"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("../../dist");
const reply_1 = require("../../dist/reply");
const custom_matchers_1 = require("../custom-matchers");
describe("basics: anyChar example", () => {
    let parser = dist_1.Parjs.anyChar;
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
            expect(() => parser.parse("").resolve()).toThrow();
        });
        it("doesn't throw", () => {
            expect(parser.parse("a").resolve()).toBe("a");
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