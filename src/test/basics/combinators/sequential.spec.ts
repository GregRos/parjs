

import {expectFailure, expectSuccess} from "../../helpers/custom-matchers";
import {ResultKind} from "../../../lib/internal/reply";
import range from "lodash/range";
import {string, fail, rest, eof, result, anyCharOf} from "../../../lib/internal/parsers";
import {
    between,
    each,
    exactly,
    many,
    manySepBy,
    manyTill,
    mapConst,
    qthen,
    stringify,
    then,
    thenq
} from "../../../lib/combinators";

let goodInput = "abcd";
let softBadInput = "a";
let hardBadInput = "ab";
let excessInput = "abcde";
let uState = {};

let fstLoud = string("ab");
let sndLoud = string("cd");

describe("sequential combinators", () => {
    describe("then combinators", () => {
        describe("loud then loud", () => {
            let parser = fstLoud.pipe(
                then(sndLoud)
            );
            it("succeeds", () => {
                expectSuccess(parser.parse(goodInput), ["ab", "cd"]);
            });
            it("fails softly on first fail", () => {
                expectFailure(parser.parse(softBadInput), ResultKind.SoftFail);
            });
            it("fails hard on 2nd fail", () => {
                expectFailure(parser.parse(hardBadInput), ResultKind.HardFail);
            });
            it("fails on excess input", () => {
                expectFailure(parser.parse(excessInput), ResultKind.SoftFail);
            });

            it("fails hard on first hard fail", () => {
                let parser2 = fail().pipe(
                    then("hi")
                );
                expectFailure(parser2.parse("hi"), "Hard");
            });

            it("fails fatally on 2nd fatal fail", () => {
                let parser2 = string("hi").pipe(
                    then(fail({
                        kind: "Fatal"
                    }))
                );
                expectFailure(parser2.parse("hi"), "Fatal");
            });

            it("chain zero-matching parsers", () => {
                let parser2 = string("hi").pipe(
                    then(rest(), rest())
                );
                expectSuccess(parser2.parse("hi"), ["hi", "", ""]);
            });

        });

        describe("loud then quiet", () => {
            let parser = fstLoud.pipe(
                thenq(sndLoud)
            );
            it("succeeds", () => {
                expectSuccess(parser.parse(goodInput), "ab");
            });
        });

        describe("quiet then loud", () => {
            let parser = fstLoud.pipe(
                qthen(sndLoud)
            );
            it("succeeds", () => {
                expectSuccess(parser.parse(goodInput), "cd");
            });
        });

        describe("loud then loud then zero-consuming quiet", () => {
            let parser = fstLoud.pipe(
                then(sndLoud),
                thenq(eof())
            );
            it("succeeds", () => {
                expectSuccess(parser.parse(goodInput), ["ab", "cd"]);
            });
            it("fails hard when 3rd fails", () => {
                expectFailure(parser.parse(excessInput), ResultKind.HardFail);
            });
        });

        describe("1 quiet using seq combinator", () => {
            // TODO: this test?
        });

        describe("empty seq combinator same as no match, return []", () => {
            // TODO: this test?
        });
    });

    describe("then array", () => {
        describe("this: loud", () => {
            it("loud ×3", () => {
                let p2 = string("b").pipe(
                    mapConst(1)
                );
                let p3 = string("c").pipe(
                    mapConst([])
                );

                let p4 = string("d").pipe(
                    mapConst(true)
                );

                let p = string("a").pipe(
                    then(p2, p3),
                    each(x => {
                        Math.log(x[1]);
                        x[0].toUpperCase();
                        x[2].map(x => x.toUpperCasfe());
                    })
                );

                expectSuccess(p.parse("abc"), ["a", 1, []]);
            });

            it("loud ×4", () => {
                let p2 = string("b").pipe(
                    mapConst(1)
                );
                let p3 = string("c").pipe(
                    mapConst([])
                );

                let p4 = string("d").pipe(
                    mapConst(true)
                );

                let p = string("a").pipe(
                    then(p2, p3, p4),
                    each(x => {
                        Math.log(x[1]);
                        x[0].toUpperCase();
                        x[2].map(x => x.toUpperCase());
                    })
                );

                expectSuccess(p.parse("abcd"), ["a", 1, [], true]);
            });
        });

    });

    describe("many combinators", () => {
        describe("regular many", () => {
            let parser = fstLoud.pipe(
                many()
            );
            it("success on empty input", () => {
                expectSuccess(parser.parse(""), []);
            });
            it("failure on non-empty input without any matches", () => {
                expectFailure(parser.parse("12"), ResultKind.SoftFail);
            });
            it("success on single match", () => {
                expectSuccess(parser.parse("ab"), ["ab"]);
            });
            it("success on N matches", () => {
                expectSuccess(parser.parse("ababab"), ["ab", "ab", "ab"]);
            });
            it("chains to EOF correctly", () => {
                let endEof = parser.pipe(
                    thenq(eof())
                );
                expectSuccess(endEof.parse("abab"), ["ab", "ab"]);
            });
            it("fails hard when many fails hard", () => {
                let parser2 = fail().pipe(many());
                expectFailure(parser2.parse(""), "Hard");
            });
        });

        describe("many with zero-length match", () => {
            let parser = result(0).pipe(many());
            it("guards against zero match in inner parser", () => {
                expect(() => parser.parse("")).toThrow();
            });

            it("ignores guard when given max iterations", () => {
                let parser = result(0).pipe(
                    many(10)
                );
                expectSuccess(parser.parse(""), range(0, 10).map(x => 0));
            });
        });


        describe("many with bounded iterations, min successes", () => {
            let parser = fstLoud.pipe(
                many(2)
            );
            it("succeeds when appropriate", () => {
                expectSuccess(parser.parse("abab"), ["ab", "ab"]);
            });
            it("fails when there is excess input", () => {
                expectFailure(parser.parse("ababab"), ResultKind.SoftFail);
            });
        });
    });

    describe("exactly combinator", () => {
        let parser = fstLoud.pipe(
            exactly(2)
        );
        it("succeeds with exact matches", () => {
            expectSuccess(parser.parse("abab"), ["ab", "ab"]);
        });

        it("hard fails with 0 < matches <= N", () => {
            expectFailure(parser.parse("ab"), ResultKind.HardFail);
        });
        it("soft fails with matches == 0", () => {
            expectFailure(parser.parse("a"), ResultKind.SoftFail);
        });
    });

    describe("manySepBy combinator", () => {
        let parser = fstLoud.pipe(
            manySepBy(", ")
        );

        it("works with max iterations", () => {
            let parser2 = fstLoud.pipe(
                manySepBy(", ", 2)
            );
            let parser3 = parser2.pipe(
                thenq(string(", ab"))
            );
            expectSuccess(parser3.parse("ab, ab, ab"));
        });

        it("succeeds with empty input", () => {
            expectSuccess(parser.parse(""), []);
        });

        it("many fails hard on 1st application", () => {
            let parser2 = fail().pipe(
                manySepBy(result(""))
            );
            expectFailure(parser2.parse(""), "Hard");
        });

        it("sep fails hard", () => {
            let parser2 = fstLoud.pipe(
                manySepBy(fail())
            );
            expectFailure(parser2.parse("ab, ab"), "Hard");
        });

        it("sep+many that don't consume throw without max iterations", () => {
            let parser2 = string("").pipe(
                manySepBy("")
            );
            expect(() => parser2.parse("")).toThrow();
        });

        it("sep+many that don't consume succeed with max iterations", () => {
            let parser2 = string("").pipe(
                manySepBy("", 2)
            );
            expectSuccess(parser2.parse(""), ["", ""]);
        });

        it("many that fails hard on 2nd iteration", () => {
            let many = string("a").pipe(
                then("b"),
                stringify(),
                manySepBy(", ")
            );
            expectFailure(many.parse("ab, ac"), "Hard");
        });

        it("succeeds with non-empty input", () => {
            expectSuccess(parser.parse("ab, ab"), ["ab", "ab"]);
        });

        it("chains into terminating separator", () => {
            let parser2 = parser.pipe(
                thenq(", ")
            );
            expectSuccess(parser2.parse("ab, ab, "), ["ab", "ab"]);
        });
        it("fails soft if first many fails", () => {
            expectFailure(parser.parse("xa"), ResultKind.SoftFail);
        });
    });

    describe("manyTill combinator", () => {
        let parser = fstLoud.pipe(
            manyTill(sndLoud)
        );
        it("succeeds matching 1 then till", () => {
            expectSuccess(parser.parse("abcd"), ["ab"]);
        });
        it("succeeds matching 1 then till, chains", () => {
            let parser2 = parser.pipe(
                thenq(fstLoud)
            );
            expectSuccess(parser2.parse("abcdab"), ["ab"]);
        });
        it("fails hard when till fails hard", () => {
            let parser2 = string("a").pipe(
                manyTill(fail())
            );
            expectFailure(parser2.parse("a"), "Hard");
        });
        it("fails hard when many failed hard", () => {
            let parser2 = fail().pipe(
                manyTill("a")
            );
            expectFailure(parser2.parse(""), "Hard");
        });
        it("guards against zero-match in many", () => {
            let parser2 = result("").pipe(
                manyTill("a")
            );
            expect(() => parser2.parse(" a")).toThrow();
        });

        it("till optional mode", () => {
            let parser2 = string("a").pipe(
                manyTill("b", true)
            );
            expectSuccess(parser2.parse("a"), ["a"]);
        });
        it("fails soft when many fails 1st time without till", () => {
            expectFailure(parser.parse("1"), ResultKind.SoftFail);
        });
        it("fails hard when many fails 2nd time without till", () => {
            expectFailure(parser.parse("ab1"), ResultKind.HardFail);
        });
    });

    describe("between combinators", () => {

        describe("two argument version", () => {
            let parser = string("a").pipe(
                between("(", string(")"))
            );
            it("succeeds", () => {
                expectSuccess(parser.parse("(a)"), "a");
            });
            it("fails soft if first between fails", () => {
                expectFailure(parser.parse("[a)"), ResultKind.SoftFail);
            });
            it("fails hard if middle/last fails", () => {
                expectFailure(parser.parse("(b)"), ResultKind.HardFail);
                expectFailure(parser.parse("(b]"), ResultKind.HardFail);
            });
        });
        describe("one argument version", () => {
            let parser = string("a").pipe(
                between("!")
            );
            it("succeeds", () => {
                expectSuccess(parser.parse("!a!"), "a");
            });
        });
    });

});

