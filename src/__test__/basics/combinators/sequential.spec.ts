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
                let parser2 = Parjs.seq(Parjs.fail("", "HardFail"), Parjs.string("hi"));
                expectFailure(parser2.parse("hi"), "HardFail");
            });

            it("fails fatally on 2nd fatal fail", () => {
                let parser2 = Parjs.string("hi").then(Parjs.fail("", "FatalFail"));
                expectFailure(parser2.parse("hi"), "FatalFail");
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
            })
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
               expectSuccess(parser.parse("ababab"), ["ab", "ab", "ab"])
           });
           it("chains to EOF correctly", () => {
               let endEof = parser.then(Parjs.eof);
               expectSuccess(endEof.parse("abab"), ["ab", "ab"])
           });
           it("fails hard when many fails hard", () => {
               let parser2 = Parjs.fail("", "HardFail").many();
               expectFailure(parser2.parse(""), "HardFail");
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
           })
       })
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
        let parser = fstLoud.manySepBy(Parjs.string(", "));

        it("works with max iterations", () => {
            let parser2 = fstLoud.manySepBy(Parjs.string(", "), 2);
            let parser3 = parser2.then(Parjs.string(", ab").q);
            expectSuccess(parser3.parse("ab, ab, ab"))
        });

        it("succeeds with empty input", () => {
            expectSuccess(parser.parse(""), []);
        });

        it("many fails hard on 1st application", () => {
            let parser2 = Parjs.fail("", "HardFail").manySepBy(Parjs.result(""));
            expectFailure(parser2.parse(""), "HardFail");
        });

        it("sep fails hard", () => {
            let parser2 = fstLoud.manySepBy(Parjs.fail("", "HardFail"));
            expectFailure(parser2.parse("ab, ab"), "HardFail");
        });

        it("sep+many that don't consume throw without max iterations", () => {
            let parser2 = Parjs.string("").manySepBy(Parjs.string(""));
            expect(() => parser2.parse("")).toThrow();
        });

        it("sep+many that don't consume succeed with max iterations", () => {
            let parser2 = Parjs.string("").manySepBy(Parjs.string(""), 2);
            expectSuccess(parser2.parse(""), ["", ""]);
        });

        it("many that fails hard on 2nd iteration", () => {
            let many = Parjs.string("a").then(Parjs.string("b")).str.manySepBy(Parjs.string(", "));
            expectFailure(many.parse("ab, ac"), "HardFail");
        });

        it("succeeds with non-empty input", () => {
            expectSuccess(parser.parse("ab, ab"), ["ab", "ab"]);
        });

        it("chains into terminating separator", () => {
            let parser2 = parser.then(Parjs.string(", ").q);
            expectSuccess(parser2.parse("ab, ab, "), ["ab", "ab"])
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
            let parser2 = Parjs.string("a").manyTill(Parjs.fail("", "HardFail"));
            expectFailure(parser2.parse("a"), "HardFail");
        });
        it("fails hard when many failed hard", () => {
            let parser2 = Parjs.fail("", "HardFail").manyTill(Parjs.string("a"));
            expectFailure(parser2.parse(""), "HardFail");
        });
        it("guards against zero-match in many", () => {
            let parser2 = Parjs.result("").manyTill(Parjs.string("a"));
            expect(() => parser2.parse(" a")).toThrow();
        });

        it("till optional mode", () => {
            let parser2 = Parjs.string("a").manyTill(Parjs.string("b"), true);
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
            let parser = Parjs.string("a").between(Parjs.string("("), Parjs.string(")"));
            it("succeeds", () => {
                expectSuccess(parser.parse("(a)"), "a");
            });
            it("fails soft if first between fails", () => {
                expectFailure(parser.parse("[a)"), ReplyKind.SoftFail);
            });
            it("fails hard if middle/last fails", () => {
                expectFailure(parser.parse("(b)"), ReplyKind.HardFail);
                expectFailure(parser.parse("(b]"), ReplyKind.HardFail);
            })
        });
        describe("one argument version", () => {
            let parser = Parjs.string("a").between(Parjs.string("!"));
            it("succeeds", () => {
                expectSuccess(parser.parse("!a!"), "a");
            })
        })
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
            expectFailure(p.parse("dd"), "SoftFail");
        });

        it("hard fail on bad 2nd", () => {
            expectFailure(p.parse("ba"), "HardFail");
        });

        it("properly chains to 3rd", () => {
            let q = p.then(Parjs.string("x")).str;
            expectSuccess(q.parse("aax"), "aax");
        });

        it("fails hard if failed to find parser", () => {
           expectFailure(p.parse("`"), "HardFail");
        });

        describe("uses cache", () => {
            let cache = new Map<string, any>();
            let calls = 0;
            let p = Parjs.anyCharOf("abc").thenChoose(x => {
                calls++;
                return Parjs.string(`${x}1`);
            }, cache);
            it("works first time", () => {
                expectSuccess(p.parse("aa1"), "a1");
                expect(calls).toBe(1);
            });
            it("goes through cache", () => {
                expectSuccess(p.parse("aa1"), "a1");
                expect(calls).toBe(1);
            });
            it("works second time not through cache", () => {
                expectSuccess(p.parse("bb1"), "b1");
                expect(calls).toBe(2);
            })

        })


    })
});

