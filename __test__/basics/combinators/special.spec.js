"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const custom_matchers_1 = require("../../custom-matchers");
const src_1 = require("../../../src");
let goodInput = "abcd";
describe("special combinators", () => {
    describe("backtrack", () => {
        let parser = src_1.Parjs.string("hi").then(src_1.Parjs.eof).backtrack;
        it("fails soft if inner fails soft", () => {
            custom_matchers_1.expectFailure(parser.parse("x"), "SoftFail");
        });
        it("fails hard if inner fails hard", () => {
            custom_matchers_1.expectFailure(parser.parse("hiAQ"), "HardFail");
        });
        it("succeeds if inner succeeds, non-zero match", () => {
            let parseHi = src_1.Parjs.string("hi");
            let redundantParser = parseHi.backtrack.then(src_1.Parjs.string("his"));
            custom_matchers_1.expectSuccess(redundantParser.parse("his"), ["hi", "his"]);
        });
    });
});
//# sourceMappingURL=special.spec.js.map