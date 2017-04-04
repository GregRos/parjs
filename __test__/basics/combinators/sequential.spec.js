"use strict";
/**
 * Created by lifeg on 10/12/2016.
 */
/**
 * Created by lifeg on 10/12/2016.
 */
const custom_matchers_1 = require("../../custom-matchers");
const parsers_1 = require("../../../dist/bindings/parsers");
const result_1 = require("../../../dist/abstract/basics/result");
const _ = require("lodash");
let goodInput = "abcd";
let softBadInput = "a";
let hardBadInput = "ab";
let excessInput = "abcde";
let uState = {};
let fstLoud = parsers_1.Parjs.string("ab");
let sndLoud = parsers_1.Parjs.string("cd");
describe("sequential combinators", () => {
    describe("then combinators", () => {
        describe("loud then loud", () => {
            let parser = fstLoud.then(sndLoud);
            it("succeeds", () => {
                custom_matchers_1.expectSuccess(parser.parse(goodInput), ["ab", "cd"]);
            });
            it("fails softly on first fail", () => {
                custom_matchers_1.expectFailure(parser.parse(softBadInput), result_1.ResultKind.SoftFail);
            });
            it("fails hard on 2nd fail", () => {
                custom_matchers_1.expectFailure(parser.parse(hardBadInput), result_1.ResultKind.HardFail);
            });
            it("fails on excess input", () => {
                custom_matchers_1.expectFailure(parser.parse(excessInput), result_1.ResultKind.SoftFail);
            });
            it("fails hard on first hard fail", () => {
                let parser2 = parsers_1.Parjs.seq(parsers_1.Parjs.fail("", "HardFail"), parsers_1.Parjs.string("hi"));
                custom_matchers_1.expectFailure(parser2.parse("hi"), "HardFail");
            });
            it("fails fatally on 2nd fatal fail", () => {
                let parser2 = parsers_1.Parjs.string("hi").then(parsers_1.Parjs.fail("", "FatalFail"));
                custom_matchers_1.expectFailure(parser2.parse("hi"), "FatalFail");
            });
            it("chain zero-matching parsers", () => {
                let parser2 = parsers_1.Parjs.string("hi").then(parsers_1.Parjs.rest, parsers_1.Parjs.rest);
                custom_matchers_1.expectSuccess(parser2.parse("hi"), ["hi", "", ""]);
            });
        });
        describe("loud then quiet", () => {
            let parser = fstLoud.then(sndLoud.q);
            it("succeeds", () => {
                custom_matchers_1.expectSuccess(parser.parse(goodInput), "ab");
            });
        });
        describe("quiet then loud", () => {
            let parser = fstLoud.q.then(sndLoud);
            it("succeeds", () => {
                custom_matchers_1.expectSuccess(parser.parse(goodInput), "cd");
            });
        });
        describe("quiet then quiet", () => {
            let parser = fstLoud.q.then(sndLoud.q);
            it("succeeds", () => {
                custom_matchers_1.expectSuccess(parser.parse(goodInput), undefined);
            });
        });
        describe("loud then loud then zero-consuming quiet", () => {
            let parser = fstLoud.then(sndLoud).then(parsers_1.Parjs.eof);
            it("succeeds", () => {
                custom_matchers_1.expectSuccess(parser.parse(goodInput), ["ab", "cd"]);
            });
            it("fails hard when 3rd fails", () => {
                custom_matchers_1.expectFailure(parser.parse(excessInput), result_1.ResultKind.HardFail);
            });
        });
        describe("1 quiet using seq combinator", () => {
            let parser = parsers_1.Parjs.seq(fstLoud.q);
            it("succeeds with empty array value", () => {
                custom_matchers_1.expectSuccess(parser.parse("ab"), []);
            });
        });
        describe("empty seq combinator same as no match, return []", () => {
            let parser = parsers_1.Parjs.seq();
            it("succeeds on empty input", () => {
                custom_matchers_1.expectSuccess(parser.parse(""), []);
            });
            it("fails on excess input", () => {
                custom_matchers_1.expectFailure(parser.parse("a"), result_1.ResultKind.SoftFail);
            });
        });
    });
    describe("many combinators", () => {
        describe("regular many", () => {
            let parser = fstLoud.many();
            it("success on empty input", () => {
                custom_matchers_1.expectSuccess(parser.parse(""), []);
            });
            it("failure on non-empty input without any matches", () => {
                custom_matchers_1.expectFailure(parser.parse("12"), result_1.ResultKind.SoftFail);
            });
            it("success on single match", () => {
                custom_matchers_1.expectSuccess(parser.parse("ab"), ["ab"]);
            });
            it("success on N matches", () => {
                custom_matchers_1.expectSuccess(parser.parse("ababab"), ["ab", "ab", "ab"]);
            });
            it("chains to EOF correctly", () => {
                let endEof = parser.then(parsers_1.Parjs.eof);
                custom_matchers_1.expectSuccess(endEof.parse("abab"), ["ab", "ab"]);
            });
            it("fails hard when many fails hard", () => {
                let parser2 = parsers_1.Parjs.fail("", "HardFail").many();
                custom_matchers_1.expectFailure(parser2.parse(""), "HardFail");
            });
        });
        describe("many with zero-length match", () => {
            let parser = parsers_1.Parjs.result(0).many();
            it("guards against zero match in inner parser", () => {
                expect(() => parser.parse("")).toThrow();
            });
            it("ignores guard when given max iterations", () => {
                let parser = parsers_1.Parjs.result(0).many(undefined, 10);
                custom_matchers_1.expectSuccess(parser.parse(""), _.range(0, 10).map(x => 0));
            });
        });
        describe("many with min successes", () => {
            let parser = fstLoud.many(2);
            it("succeeds when number of successes >= minimum", () => {
                custom_matchers_1.expectSuccess(parser.parse("abab"), ["ab", "ab"]);
            });
            it("fails when number of successses < minimum", () => {
                custom_matchers_1.expectFailure(parser.parse("ab"), result_1.ResultKind.HardFail);
            });
        });
        describe("many with bounded iterations, min successes", () => {
            it("guards against impossible requirements", () => {
                expect(() => fstLoud.many(2, 1)).toThrow();
            });
            let parser = fstLoud.many(1, 2);
            it("succeeds when appropriate", () => {
                custom_matchers_1.expectSuccess(parser.parse("abab"), ["ab", "ab"]);
            });
            it("fails when there is excess input", () => {
                custom_matchers_1.expectFailure(parser.parse("ababab"), result_1.ResultKind.SoftFail);
            });
        });
        describe("many on quiet parser", () => {
            let parser = fstLoud.q.many();
            it("succeeds without a value", () => {
                custom_matchers_1.expectSuccess(parser.parse("abab"), undefined);
            });
        });
    });
    describe("exactly combinator", () => {
        let parser = fstLoud.exactly(2);
        it("succeeds with exact matches", () => {
            custom_matchers_1.expectSuccess(parser.parse("abab"), ["ab", "ab"]);
        });
        it("quiet exactly succeeds without value", () => {
            let parser = fstLoud.q.exactly(2);
            custom_matchers_1.expectSuccess(parser.parse("abab"), undefined);
        });
        it("hard fails with 0 < matches <= N", () => {
            custom_matchers_1.expectFailure(parser.parse("ab"), result_1.ResultKind.HardFail);
        });
        it("soft fails with matches == 0", () => {
            custom_matchers_1.expectFailure(parser.parse("a"), result_1.ResultKind.SoftFail);
        });
    });
    describe("manySepBy combinator", () => {
        let parser = fstLoud.manySepBy(parsers_1.Parjs.string(", "));
        it("works with max iterations", () => {
            let parser2 = fstLoud.manySepBy(parsers_1.Parjs.string(", "), 2);
            let parser3 = parser2.then(parsers_1.Parjs.string(", ab").q);
            custom_matchers_1.expectSuccess(parser3.parse("ab, ab, ab"));
        });
        it("succeeds with empty input", () => {
            custom_matchers_1.expectSuccess(parser.parse(""), []);
        });
        it("many fails hard on 1st application", () => {
            let parser2 = parsers_1.Parjs.fail("", "HardFail").manySepBy(parsers_1.Parjs.result(""));
            custom_matchers_1.expectFailure(parser2.parse(""), "HardFail");
        });
        it("sep fails hard", () => {
            let parser2 = fstLoud.manySepBy(parsers_1.Parjs.fail("", "HardFail"));
            custom_matchers_1.expectFailure(parser2.parse("ab, ab"), "HardFail");
        });
        it("sep+many that don't consume throw without max iterations", () => {
            let parser2 = parsers_1.Parjs.string("").manySepBy(parsers_1.Parjs.string(""));
            expect(() => parser2.parse("")).toThrow();
        });
        it("sep+many that don't consume succeed with max iterations", () => {
            let parser2 = parsers_1.Parjs.string("").manySepBy(parsers_1.Parjs.string(""), 2);
            custom_matchers_1.expectSuccess(parser2.parse(""), ["", ""]);
        });
        it("many that fails hard on 2nd iteration", () => {
            let many = parsers_1.Parjs.string("a").then(parsers_1.Parjs.string("b")).str.manySepBy(parsers_1.Parjs.string(", "));
            custom_matchers_1.expectFailure(many.parse("ab, ac"), "HardFail");
        });
        it("succeeds with non-empty input", () => {
            custom_matchers_1.expectSuccess(parser.parse("ab, ab"), ["ab", "ab"]);
        });
        it("chains into terminating separator", () => {
            let parser2 = parser.then(parsers_1.Parjs.string(", ").q);
            custom_matchers_1.expectSuccess(parser2.parse("ab, ab, "), ["ab", "ab"]);
        });
        it("fails soft if first many fails", () => {
            custom_matchers_1.expectFailure(parser.parse("xa"), result_1.ResultKind.SoftFail);
        });
    });
    describe("manyTill combinator", () => {
        let parser = fstLoud.manyTill(sndLoud);
        it("succeeds matching 1 then till", () => {
            custom_matchers_1.expectSuccess(parser.parse("abcd"), ["ab"]);
        });
        it("succeeds matching 1 then till, chains", () => {
            let parser2 = parser.then(fstLoud.q);
            custom_matchers_1.expectSuccess(parser2.parse("abcdab"), ["ab"]);
        });
        it("fails hard when till fails hard", () => {
            let parser2 = parsers_1.Parjs.string("a").manyTill(parsers_1.Parjs.fail("", "HardFail"));
            custom_matchers_1.expectFailure(parser2.parse("a"), "HardFail");
        });
        it("fails hard when many failed hard", () => {
            let parser2 = parsers_1.Parjs.fail("", "HardFail").manyTill(parsers_1.Parjs.string("a"));
            custom_matchers_1.expectFailure(parser2.parse(""), "HardFail");
        });
        it("guards against zero-match in many", () => {
            let parser2 = parsers_1.Parjs.result("").manyTill(parsers_1.Parjs.string("a"));
            expect(() => parser2.parse(" a")).toThrow();
        });
        it("till optional mode", () => {
            let parser2 = parsers_1.Parjs.string("a").manyTill(parsers_1.Parjs.string("b"), true);
            custom_matchers_1.expectSuccess(parser2.parse("a"), ["a"]);
        });
        it("fails soft when many fails 1st time without till", () => {
            custom_matchers_1.expectFailure(parser.parse("1"), result_1.ResultKind.SoftFail);
        });
        it("fails hard when many fails 2nd time without till", () => {
            custom_matchers_1.expectFailure(parser.parse("ab1"), result_1.ResultKind.HardFail);
        });
    });
});
//# sourceMappingURL=sequential.spec.js.map