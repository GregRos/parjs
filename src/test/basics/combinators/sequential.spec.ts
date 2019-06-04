/**
 * Created by lifeg on 10/12/2016.
 */
/**
 * Created by lifeg on 10/12/2016.
 */
import {expectFailure, expectSuccess} from "../../helpers/custom-matchers";
import {Parjs} from "../../../lib";
import {ReplyKind} from "../../../lib/reply";
import _range = require("lodash/range");

let goodInput = "abcd";
let softBadInput = "a";
let hardBadInput = "ab";
let excessInput = "abcde";
let uState = {};

let fstLoud = Parjs.string("ab");
let sndLoud = Parjs.string("cd");

describe("sequential combinators", () => {
    describe("then combinators", () => {
        describe("loud then loud", () => {
            let parser = fstLoud.then(sndLoud);
            it("succeeds", () => {
                expectSuccess(parser.parse(goodInput), ["ab", "cd"]);
            });
            it("fails softly on first fail", () => {
                expectFailure(parser.parse(softBadInput), ReplyKind.SoftFail);
            });
            it("fails hard on 2nd fail", () => {
                expectFailure(parser.parse(hardBadInput), ReplyKind.HardFail);
            });
            it("fails on excess input", () => {
                expectFailure(parser.parse(excessInput), ReplyKind.SoftFail);
            });

            it("fails hard on first hard fail", () => {
                let parser2 = Parjs.seq(Parjs.fail("", "Hard"), Parjs.string("hi"));
                expectFailure(parser2.parse("hi"), "Hard");
            });

            it("fails fatally on 2nd fatal fail", () => {
                let parser2 = Parjs.string("hi").then(Parjs.fail("", "Fatal"));
                expectFailure(parser2.parse("hi"), "Fatal");
            });

            it("chain zero-matching parsers", () => {
                let parser2 = Parjs.string("hi").then([Parjs.rest, Parjs.rest]);
                expectSuccess(parser2.parse("hi"), ["hi", "", ""]);
            });

        });

        describe("loud then quiet", () => {
            let parser = fstLoud.then(sndLoud.q);
            it("succeeds", () => {
                expectSuccess(parser.parse(goodInput), "ab");
            });
        });

        describe("quiet then loud", () => {
            let parser = fstLoud.q.then(sndLoud);
            it("succeeds", () => {
                expectSuccess(parser.parse(goodInput), "cd");
            });
        });

        describe("quiet then quiet", () => {
            let parser = fstLoud.q.then(sndLoud.q);
            it("succeeds", () => {
                expectSuccess(parser.parse(goodInput), undefined);
            });
        });

        describe("loud then loud then zero-consuming quiet", () => {
            let parser = fstLoud.then(sndLoud).then(Parjs.eof);
            it("succeeds", () => {
                expectSuccess(parser.parse(goodInput), ["ab", "cd"]);
            });
            it("fails hard when 3rd fails", () => {
                expectFailure(parser.parse(excessInput), ReplyKind.HardFail);
            });
        });

        describe("1 quiet using seq combinator", () => {
            let parser = Parjs.seq(fstLoud.q);
            it("succeeds with empty array value", () => {
                expectSuccess(parser.parse("ab"), []);
            });
        });

        describe("empty seq combinator same as no match, return []", () => {
            let parser = Parjs.seq();
            it("succeeds on empty input", () => {
                expectSuccess(parser.parse(""), []);
            });

            it("fails on excess input", () => {
                expectFailure(parser.parse("a"), ReplyKind.SoftFail);
            });
        });
    });

    describe("then array", () => {
        describe("this: loud", () => {
            it("empty array", () => {
                let p = Parjs.string("a").then([]).each(arr => {
                    arr[0].toUpperCase();
                });
                expectSuccess(p.parse("a"), ["a"]);
                expectFailure(p.parse("b"), "Soft");
            });

            it("quiet array", () => {
                let pq = Parjs.string("b").q;
                let p = Parjs.string("a").then([pq, pq, pq]).each(x => {
                    x[0].toUpperCase();
                });
                expectSuccess(p.parse("abbb"), ["a"]);
                expectFailure(p.parse("aaa"), "Hard");
                expectFailure(p.parse("bbbb"), "Soft");
            });

            it("loud ×2", () => {
                let p = Parjs.string("a").then([Parjs.string("1").result(1)]).each(x => {
                    Math.log(x[1]);
                    x[0].toUpperCase();
                });

                expectSuccess(p.parse("a1"), ["a", 1]);
            });

            it("loud ×3", () => {
                let p2 = Parjs.string("b").result(1);
                let p3 = Parjs.string("c").result([]);
                let p = Parjs.string("a").then([p2, p3]).each(x => {
                    Math.log(x[1]);
                    x[0].toUpperCase();
                    x[2].map(x => x.toUpperCasfe());
                });

                expectSuccess(p.parse("abc"), ["a", 1, []]);
            });

            it("loud ×4", () => {
                let p2 = Parjs.string("b").result(1);
                let p3 = Parjs.string("c").result([]);
                let p4 = Parjs.string("d").result(true);
                let p = Parjs.string("a").then([p2, p3, p4]).each(x => {
                    Math.log(x[1]);
                    x[0].toUpperCase();
                    x[2].map(x => x.toUpperCasfe());
                    x[3];
                });
                expectSuccess(p.parse("abcd"), ["a", 1, [], true]);
            });

            it("loud > 4", () => {
                let qp = Parjs.string("a").q;
                let arr = ["a", "a", qp, "a", qp, qp, "a"];
                let p = Parjs.string("a").then(arr).each(x => {
                    x[0].toUpperCase();
                });
                let res = "a".repeat(8);
                expectSuccess(p.parse("a".repeat(8)), "a".repeat(5).split(""));
            });
        });

        describe("this: quiet", () => {
            let qp = Parjs.string("a").q;
            it("empty array", () => {
                let p = qp.q.then([]).each(r => {

                });
                expectSuccess(p.parse("a"), []);
            });

            it("loud ×1", () => {
                let p = qp.then(["a"]).each(r => {
                    r[0].toUpperCase();
                });

                expectSuccess(p.parse("aa"), ["a"]);
            });

            it("loud ×2", () => {
                let p = qp.then(["a", qp.result(1)]).each(r => {
                    r[0].toUpperCase();
                    r[1].toExponential();
                });
                expectSuccess(p.parse("aaa"), ["a", 1]);
            });

            it("loud ×3", () => {
                let p = qp.then(["a", qp.result(1), qp.result([])]).each(r => {
                    r[0].toUpperCase();
                    r[1].toExponential();
                    r[2].forEach(() => {
                    });
                });
                expectSuccess(p.parse("aaaa"), ["a", 1, []]);
            });

            it("loud > 3", () => {
                let arr = ["a", "a", qp, "a", qp, qp, "a"];
                let p = qp.then(arr).each(x => {
                    x[0].toUpperCase();
                });
                let res = "a".repeat(8);
                expectSuccess(p.parse("a".repeat(8)), "a".repeat(4).split(""));
            });


        });

    });

    describe("many combinators", () => {
        describe("regular many", () => {
            let parser = fstLoud.many();
            it("success on empty input", () => {
                expectSuccess(parser.parse(""), []);
            });
            it("failure on non-empty input without any matches", () => {
                expectFailure(parser.parse("12"), ReplyKind.SoftFail);
            });
            it("success on single match", () => {
                expectSuccess(parser.parse("ab"), ["ab"]);
            });
            it("success on N matches", () => {
                expectSuccess(parser.parse("ababab"), ["ab", "ab", "ab"]);
            });
            it("chains to EOF correctly", () => {
                let endEof = parser.then(Parjs.eof);
                expectSuccess(endEof.parse("abab"), ["ab", "ab"]);
            });
            it("fails hard when many fails hard", () => {
                let parser2 = Parjs.fail("", "Hard").many();
                expectFailure(parser2.parse(""), "Hard");
            });
        });

        describe("many with zero-length match", () => {
            let parser = Parjs.result(0).many();
            it("guards against zero match in inner parser", () => {
                expect(() => parser.parse("")).toThrow();
            });

            it("ignores guard when given max iterations", () => {
                let parser = Parjs.result(0).many(undefined, 10);
                expectSuccess(parser.parse(""), _range(0, 10).map(x => 0));
            });
        });

        describe("many with min successes", () => {
            let parser = fstLoud.many(2);
            it("succeeds when number of successes >= minimum", () => {
                expectSuccess(parser.parse("abab"), ["ab", "ab"]);
            });

            it("fails when number of successses < minimum", () => {
                expectFailure(parser.parse("ab"), ReplyKind.HardFail);
            });
        });

        describe("many with bounded iterations, min successes", () => {
            it("guards against impossible requirements", () => {
                expect(() => fstLoud.many(2, 1)).toThrow();
            });
            let parser = fstLoud.many(1, 2);
            it("succeeds when appropriate", () => {
                expectSuccess(parser.parse("abab"), ["ab", "ab"]);
            });
            it("fails when there is excess input", () => {
                expectFailure(parser.parse("ababab"), ReplyKind.SoftFail);
            });
        });

        describe("many on quiet parser", () => {
            let parser = fstLoud.q.many();
            it("succeeds without a value", () => {
                expectSuccess(parser.parse("abab"), undefined);
            });
        });
    });

    describe("exactly combinator", () => {
        let parser = fstLoud.exactly(2);
        it("succeeds with exact matches", () => {
            expectSuccess(parser.parse("abab"), ["ab", "ab"]);
        });
        it("quiet exactly succeeds without value", () => {
            let parser = fstLoud.q.exactly(2);
            expectSuccess(parser.parse("abab"), undefined);
        });
        it("hard fails with 0 < matches <= N", () => {
            expectFailure(parser.parse("ab"), ReplyKind.HardFail);
        });
        it("soft fails with matches == 0", () => {
            expectFailure(parser.parse("a"), ReplyKind.SoftFail);
        });
    });

    describe("manySepBy combinator", () => {
        let parser = fstLoud.manySepBy(", ");

        it("works with max iterations", () => {
            let parser2 = fstLoud.manySepBy(", ", 2);
            let parser3 = parser2.then(Parjs.string(", ab").q);
            expectSuccess(parser3.parse("ab, ab, ab"));
        });

        it("succeeds with empty input", () => {
            expectSuccess(parser.parse(""), []);
        });

        it("many fails hard on 1st application", () => {
            let parser2 = Parjs.fail("", "Hard").manySepBy(Parjs.result(""));
            expectFailure(parser2.parse(""), "Hard");
        });

        it("sep fails hard", () => {
            let parser2 = fstLoud.manySepBy(Parjs.fail("", "Hard"));
            expectFailure(parser2.parse("ab, ab"), "Hard");
        });

        it("sep+many that don't consume throw without max iterations", () => {
            let parser2 = Parjs.string("").manySepBy("");
            expect(() => parser2.parse("")).toThrow();
        });

        it("sep+many that don't consume succeed with max iterations", () => {
            let parser2 = Parjs.string("").manySepBy("", 2);
            expectSuccess(parser2.parse(""), ["", ""]);
        });

        it("many that fails hard on 2nd iteration", () => {
            let many = Parjs.string("a").then("b").str.manySepBy(", ");
            expectFailure(many.parse("ab, ac"), "Hard");
        });

        it("succeeds with non-empty input", () => {
            expectSuccess(parser.parse("ab, ab"), ["ab", "ab"]);
        });

        it("chains into terminating separator", () => {
            let parser2 = parser.then(Parjs.string(", ").q);
            expectSuccess(parser2.parse("ab, ab, "), ["ab", "ab"]);
        });
        it("fails soft if first many fails", () => {
            expectFailure(parser.parse("xa"), ReplyKind.SoftFail);
        });
    });

    describe("manyTill combinator", () => {
        let parser = fstLoud.manyTill(sndLoud);
        it("succeeds matching 1 then till", () => {
            expectSuccess(parser.parse("abcd"), ["ab"]);
        });
        it("succeeds matching 1 then till, chains", () => {
            let parser2 = parser.then(fstLoud.q);
            expectSuccess(parser2.parse("abcdab"), ["ab"]);
        });
        it("fails hard when till fails hard", () => {
            let parser2 = Parjs.string("a").manyTill(Parjs.fail("", "Hard"));
            expectFailure(parser2.parse("a"), "Hard");
        });
        it("fails hard when many failed hard", () => {
            let parser2 = Parjs.fail("", "Hard").manyTill("a");
            expectFailure(parser2.parse(""), "Hard");
        });
        it("guards against zero-match in many", () => {
            let parser2 = Parjs.result("").manyTill("a");
            expect(() => parser2.parse(" a")).toThrow();
        });

        it("till optional mode", () => {
            let parser2 = Parjs.string("a").manyTill("b", true);
            expectSuccess(parser2.parse("a"), ["a"]);
        });
        it("fails soft when many fails 1st time without till", () => {
            expectFailure(parser.parse("1"), ReplyKind.SoftFail);
        });
        it("fails hard when many fails 2nd time without till", () => {
            expectFailure(parser.parse("ab1"), ReplyKind.HardFail);
        });
    });

    describe("between combinators", () => {

        describe("two argument version", () => {
            let parser = Parjs.string("a").between("(", Parjs.string(")"));
            it("succeeds", () => {
                expectSuccess(parser.parse("(a)"), "a");
            });
            it("fails soft if first between fails", () => {
                expectFailure(parser.parse("[a)"), ReplyKind.SoftFail);
            });
            it("fails hard if middle/last fails", () => {
                expectFailure(parser.parse("(b)"), ReplyKind.HardFail);
                expectFailure(parser.parse("(b]"), ReplyKind.HardFail);
            });
        });
        describe("one argument version", () => {
            let parser = Parjs.string("a").between("!");
            it("succeeds", () => {
                expectSuccess(parser.parse("!a!"), "a");
            });
        });
    });

    describe("sequential func combinator", () => {
        let parse1 = Parjs.string("a");
        let parse2 = Parjs.string("b");
        let parse3 = Parjs.string("c");

        let p = Parjs.anyCharOf("`abc").thenChoose(x => {
            if (x === "`") return null;
            return Parjs.string(x).result(x + x);
        });

        it("matches 1", () => {
            expectSuccess(p.parse("aa"), "aa");
        });

        it("matches 2", () => {
            expectSuccess(p.parse("bb"), "bb");
        });

        it("soft fail on bad 1st", () => {
            expectFailure(p.parse("dd"), "Soft");
        });

        it("hard fail on bad 2nd", () => {
            expectFailure(p.parse("ba"), "Hard");
        });

        it("properly chains to 3rd", () => {
            let q = p.then("x").str;
            expectSuccess(q.parse("aax"), "aax");
        });

        it("fails hard if failed to find parser", () => {
            expectFailure(p.parse("`"), "Hard");
        });
    });
});

