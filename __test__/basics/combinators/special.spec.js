"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const custom_matchers_1 = require("../../custom-matchers");
const dist_1 = require("../../../dist");
let goodInput = "abcd";
describe("special combinators", () => {
    describe("backtrack", () => {
        let parser = dist_1.Parjs.string("hi").then(dist_1.Parjs.eof).backtrack;
        it("fails soft if inner fails soft", () => {
            custom_matchers_1.expectFailure(parser.parse("x"), "SoftFail");
        });
        it("fails hard if inner fails hard", () => {
            custom_matchers_1.expectFailure(parser.parse("hiAQ"), "HardFail");
        });
        it("succeeds if inner succeeds, non-zero match", () => {
            let parseHi = dist_1.Parjs.string("hi");
            let redundantParser = parseHi.backtrack.then(dist_1.Parjs.string("his"));
            custom_matchers_1.expectSuccess(redundantParser.parse("his"), ["hi", "his"]);
        });
    });
});
//# sourceMappingURL=special.spec.js.map