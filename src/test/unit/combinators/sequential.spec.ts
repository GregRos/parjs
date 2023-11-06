import { expectFailure, expectSuccess } from "../../helpers/custom-matchers";
import { ResultKind } from "../../../lib/internal/result";
import range from "lodash/range";
import { string, fail, rest, eof, result, anyCharOf, float } from "../../../lib/internal/parsers";
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
    thenq,
    thenPick,
    manyBetween
} from "../../../lib/combinators";
import { getArrayWithSeparators } from "../../../lib/internal/combinators/many-sep-by";

const goodInput = "abcd";
const softBadInput = "a";
const hardBadInput = "ab";
const excessInput = "abcde";
const prs = string("ab");
const prs2 = string("cd");

describe("sequential combinators", () => {
    describe("thenq", () => {
        const parser = prs.pipe(thenq(prs2));
        it("succeeds", () => {
            expectSuccess(parser.parse(goodInput), "ab");
        });
    });

    describe("qthen", () => {
        const parser = prs.pipe(qthen(prs2));
        it("succeeds", () => {
            expectSuccess(parser.parse(goodInput), "cd");
        });
    });

    describe("then", () => {
        describe("1 arg", () => {
            const parser = prs.pipe(then(prs2));
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
                const parser2 = fail().pipe(then("hi"));
                expectFailure(parser2.parse("hi"), "Hard");
            });

            it("fails fatally on 2nd fatal fail", () => {
                const parser2 = string("hi").pipe(
                    then(
                        fail({
                            kind: "Fatal"
                        })
                    )
                );
                expectFailure(parser2.parse("hi"), "Fatal");
            });

            it("chain zero-matching parsers", () => {
                const parser2 = string("hi").pipe(then(rest(), rest()));
                expectSuccess(parser2.parse("hi"), ["hi", "", ""]);
            });
        });

        describe("1 arg, then zero consume", () => {
            const parser = prs.pipe(then(prs2), thenq(eof()));
            it("succeeds", () => {
                expectSuccess(parser.parse(goodInput), ["ab", "cd"]);
            });
            it("fails hard when 3rd fails", () => {
                expectFailure(parser.parse(excessInput), ResultKind.HardFail);
            });
        });

        it("2 args", () => {
            const p2 = string("b").pipe(mapConst(1));
            const p3 = string("c").pipe(mapConst([] as string[]));

            const p = string("a").pipe(
                then(p2, p3),
                each(x => {
                    Math.log(x[1]);
                    x[0].toUpperCase();
                    x[2].map(xx => xx.toUpperCase());
                })
            );

            expectSuccess(p.parse("abc"), ["a", 1, []]);
        });

        it("3 args", () => {
            const p2 = string("b").pipe(mapConst(1));
            const p3 = string("c").pipe(mapConst([] as string[]));

            const p4 = string("d").pipe(mapConst(true));

            const p = string("a").pipe(
                then(p2, p3, p4),
                each(x => {
                    Math.log(x[1]);
                    x[0].toUpperCase();
                    x[2].map(xx => xx.toUpperCase());
                })
            );

            expectSuccess(p.parse("abcd"), ["a", 1, [], true]);
        });
    });

    describe("many combinators", () => {
        describe("regular many", () => {
            const parser = prs.pipe(many());
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
                const endEof = parser.pipe(thenq(eof()));
                expectSuccess(endEof.parse("abab"), ["ab", "ab"]);
            });
            it("fails hard when many fails hard", () => {
                const parser2 = fail().pipe(many());
                expectFailure(parser2.parse(""), "Hard");
            });
        });

        describe("many with zero-length match", () => {
            it("guards against zero match in inner parser", () => {
                const parser = result(0).pipe(many());
                expect(() => parser.parse("")).toThrow();
            });

            it("ignores guard when given max iterations", () => {
                const parser = result(0).pipe(many(10));
                expectSuccess(
                    parser.parse(""),
                    range(0, 10).map(() => 0)
                );
            });
        });

        describe("many with bounded iterations, min successes", () => {
            const parser = prs.pipe(many(2));
            it("succeeds when appropriate", () => {
                expectSuccess(parser.parse("abab"), ["ab", "ab"]);
            });
            it("fails when there is excess input", () => {
                expectFailure(parser.parse("ababab"), ResultKind.SoftFail);
            });
        });
    });

    describe("exactly combinator", () => {
        const parser = prs.pipe(exactly(2));
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
        const parser = prs.pipe(manySepBy(", "));

        it("works with max iterations", () => {
            const parser2 = prs.pipe(manySepBy(", ", 2));
            const parser3 = parser2.pipe(thenq(string(", ab")));
            expectSuccess(parser3.parse("ab, ab, ab"));
        });

        it("succeeds with empty input", () => {
            expectSuccess(parser.parse(""), getArrayWithSeparators([], []));
        });

        it("many fails hard on 1st application", () => {
            const parser2 = fail().pipe(manySepBy(result("")));
            expectFailure(parser2.parse(""), "Hard");
        });

        it("sep fails hard", () => {
            const parser2 = prs.pipe(manySepBy(fail()));
            expectFailure(parser2.parse("ab, ab"), "Hard");
        });

        it("sep+many that don't consume throw without max iterations", () => {
            const parser2 = string("").pipe(manySepBy(""));
            expect(() => parser2.parse("")).toThrow();
        });

        it("sep+many that don't consume succeed with max iterations", () => {
            const parser2 = string("").pipe(manySepBy("", 2));
            expectSuccess(parser2.parse(""), getArrayWithSeparators(["", ""], [""]));
        });

        it("many that fails hard on 2nd iteration", () => {
            const manyParser = string("a").pipe(then("b"), stringify(), manySepBy(", "));
            expectFailure(manyParser.parse("ab, ac"), "Hard");
        });

        it("succeeds with non-empty input", () => {
            expectSuccess(parser.parse("ab, ab"), getArrayWithSeparators(["ab", "ab"], [", "]));
        });

        it("chains into terminating separator", () => {
            const parser2 = parser.pipe(thenq(", "));
            expectSuccess(
                parser2.parse("ab, ab, "),
                getArrayWithSeparators(["ab", "ab"], [", ", ", "])
            );
        });
        it("fails soft if first many fails", () => {
            expectFailure(parser.parse("xa"), ResultKind.SoftFail);
        });
    });

    describe("manyBetween", () => {
        it("success", () => {
            const parser = prs.pipe(
                manyBetween("'", "'", (sources, till, state) => {
                    return { sources, till, state };
                })
            );
            const res = parser.parse("'abab'");
            expect(res.kind).toEqual("OK");
            expect(res.value.sources).toEqual(["ab", "ab"]);
        });
    });

    describe("manyTill combinator", () => {
        const parser = prs.pipe(manyTill(prs2));
        it("succeeds matching 1 then till", () => {
            expectSuccess(parser.parse("abcd"), ["ab"]);
        });
        it("succeeds matching 1 then till, chains", () => {
            const parser2 = parser.pipe(thenq(prs));
            expectSuccess(parser2.parse("abcdab"), ["ab"]);
        });
        it("fails hard when till fails hard", () => {
            const parser2 = string("a").pipe(manyTill(fail()));
            expectFailure(parser2.parse("a"), "Hard");
        });
        it("fails hard when many failed hard", () => {
            const parser2 = fail().pipe(manyTill("a"));
            expectFailure(parser2.parse(""), "Hard");
        });
        it("guards against zero-match in many", () => {
            const parser2 = result("").pipe(manyTill("a"));
            expect(() => parser2.parse(" a")).toThrow();
        });

        it("fails soft when many fails 1st time without till", () => {
            expectFailure(parser.parse("1"), ResultKind.SoftFail);
        });
        it("fails hard when many fails 2nd time without till", () => {
            expectFailure(parser.parse("ab1"), ResultKind.HardFail);
        });
    });

    describe("conditional seq combinators", () => {
        it("thenPick", () => {
            const parser = anyCharOf("ab").pipe(
                thenPick(x => {
                    if (x === "a") {
                        return string("a");
                    } else {
                        return string("b");
                    }
                })
            );

            expectSuccess(parser.parse("aa"), "a");
            expectSuccess(parser.parse("bb"), "b");
            expectFailure(parser.parse("ab"), ResultKind.HardFail);
        });
    });

    describe("between combinators", () => {
        describe("two argument version", () => {
            const parser = string("a").pipe(between("(", string(")")));
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
            const parser = string("a").pipe(between("!"));
            it("succeeds", () => {
                expectSuccess(parser.parse("!a!"), "a");
            });
        });

        describe("two argument version with different types", () => {
            const parser = string("a").pipe(between("_", float()));
            it("succeeds", () => {
                expectSuccess(parser.parse("_a3.14"), "a");
            });
        });
    });
});
