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
            expect(parser.parse(goodInput)).toBeSuccessful("ab");
        });
    });

    describe("qthen", () => {
        const parser = prs.pipe(qthen(prs2));
        it("succeeds", () => {
            expect(parser.parse(goodInput)).toBeSuccessful("cd");
        });
    });

    describe("then", () => {
        describe("1 arg", () => {
            const parser = prs.pipe(then(prs2));
            it("succeeds", () => {
                expect(parser.parse(goodInput)).toBeSuccessful(["ab", "cd"]);
            });
            it("fails softly on first fail", () => {
                expect(parser.parse(softBadInput)).toBeFailure(ResultKind.SoftFail);
            });
            it("fails hard on 2nd fail", () => {
                expect(parser.parse(hardBadInput)).toBeFailure(ResultKind.HardFail);
            });
            it("fails on excess input", () => {
                expect(parser.parse(excessInput)).toBeFailure(ResultKind.SoftFail);
            });

            it("fails hard on first hard fail", () => {
                const parser2 = fail().pipe(then("hi"));
                expect(parser2.parse("hi")).toBeFailure("Hard");
            });

            it("fails fatally on 2nd fatal fail", () => {
                const parser2 = string("hi").pipe(
                    then(
                        fail({
                            kind: "Fatal"
                        })
                    )
                );
                expect(parser2.parse("hi")).toBeFailure("Fatal");
            });

            it("chain zero-matching parsers", () => {
                const parser2 = string("hi").pipe(then(rest(), rest()));
                expect(parser2.parse("hi")).toBeSuccessful(["hi", "", ""]);
            });
        });

        describe("1 arg, then zero consume", () => {
            const parser = prs.pipe(then(prs2), thenq(eof()));
            it("succeeds", () => {
                expect(parser.parse(goodInput)).toBeSuccessful(["ab", "cd"]);
            });
            it("fails hard when 3rd fails", () => {
                expect(parser.parse(excessInput)).toBeFailure(ResultKind.HardFail);
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

            expect(p.parse("abc")).toBeSuccessful(["a", 1, []]);
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

            expect(p.parse("abcd")).toBeSuccessful(["a", 1, [], true]);
        });
    });

    describe("many combinators", () => {
        describe("regular many", () => {
            const parser = prs.pipe(many());
            it("success on empty input", () => {
                expect(parser.parse("")).toBeSuccessful([]);
            });
            it("failure on non-empty input without any matches", () => {
                expect(parser.parse("12")).toBeFailure(ResultKind.SoftFail);
            });
            it("success on single match", () => {
                expect(parser.parse("ab")).toBeSuccessful(["ab"]);
            });
            it("success on N matches", () => {
                expect(parser.parse("ababab")).toBeSuccessful(["ab", "ab", "ab"]);
            });
            it("chains to EOF correctly", () => {
                const endEof = parser.pipe(thenq(eof()));
                expect(endEof.parse("abab")).toBeSuccessful(["ab", "ab"]);
            });
            it("fails hard when many fails hard", () => {
                const parser2 = fail().pipe(many());
                expect(parser2.parse("")).toBeFailure("Hard");
            });
        });

        describe("many with zero-length match", () => {
            it("guards against zero match in inner parser", () => {
                const parser = result(0).pipe(many());
                expect(() => parser.parse("")).toThrow();
            });

            it("ignores guard when given max iterations", () => {
                const parser = result(0).pipe(many(10));
                expect(parser.parse("")).toBeSuccessful(range(0, 10).map(() => 0));
            });
        });

        describe("many with bounded iterations, min successes", () => {
            const parser = prs.pipe(many(2));
            it("succeeds when appropriate", () => {
                expect(parser.parse("abab")).toBeSuccessful(["ab", "ab"]);
            });
            it("fails when there is excess input", () => {
                expect(parser.parse("ababab")).toBeFailure(ResultKind.SoftFail);
            });
        });
    });

    describe("exactly combinator", () => {
        const parser = prs.pipe(exactly(2));
        it("succeeds with exact matches", () => {
            expect(parser.parse("abab")).toBeSuccessful(["ab", "ab"]);
        });

        it("hard fails with 0 < matches <= N", () => {
            expect(parser.parse("ab")).toBeFailure(ResultKind.HardFail);
        });
        it("soft fails with matches == 0", () => {
            expect(parser.parse("a")).toBeFailure(ResultKind.SoftFail);
        });
    });

    describe("manySepBy combinator", () => {
        const parser = prs.pipe(manySepBy(", "));

        it("works with max iterations", () => {
            const parser2 = prs.pipe(manySepBy(", ", 2));
            const parser3 = parser2.pipe(thenq(string(", ab")));
            expect(parser3.parse("ab, ab, ab")).toBeSuccessful();
        });

        it("succeeds with empty input", () => {
            expect(parser.parse("")).toBeSuccessful(getArrayWithSeparators([], []));
        });

        it("many fails hard on 1st application", () => {
            const parser2 = fail().pipe(manySepBy(result("")));
            expect(parser2.parse("")).toBeFailure("Hard");
        });

        it("sep fails hard", () => {
            const parser2 = prs.pipe(manySepBy(fail()));
            expect(parser2.parse("ab, ab")).toBeFailure("Hard");
        });

        it("sep+many that don't consume throw without max iterations", () => {
            const parser2 = string("").pipe(manySepBy(""));
            expect(() => parser2.parse("")).toThrow();
        });

        it("sep+many that don't consume succeed with max iterations", () => {
            const parser2 = string("").pipe(manySepBy("", 2));
            expect(parser2.parse("")).toBeSuccessful(getArrayWithSeparators(["", ""], [""]));
        });

        it("many that fails hard on 2nd iteration", () => {
            const manyParser = string("a").pipe(then("b"), stringify(), manySepBy(", "));
            expect(manyParser.parse("ab, ac")).toBeFailure("Hard");
        });

        it("succeeds with non-empty input", () => {
            expect(parser.parse("ab, ab")).toBeSuccessful(
                getArrayWithSeparators(["ab", "ab"], [", "])
            );
        });

        it("chains into terminating separator", () => {
            const parser2 = parser.pipe(thenq(", "));
            expect(parser2.parse("ab, ab, ")).toBeSuccessful(
                getArrayWithSeparators(["ab", "ab"], [", ", ", "])
            );
        });
        it("fails soft if first many fails", () => {
            expect(parser.parse("xa")).toBeFailure(ResultKind.SoftFail);
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
            expect(parser.parse("abcd")).toBeSuccessful(["ab"]);
        });
        it("succeeds matching 1 then till, chains", () => {
            const parser2 = parser.pipe(thenq(prs));
            expect(parser2.parse("abcdab")).toBeSuccessful(["ab"]);
        });
        it("fails hard when till fails hard", () => {
            const parser2 = string("a").pipe(manyTill(fail()));
            expect(parser2.parse("a")).toBeFailure("Hard");
        });
        it("fails hard when many failed hard", () => {
            const parser2 = fail().pipe(manyTill("a"));
            expect(parser2.parse("")).toBeFailure("Hard");
        });
        it("guards against zero-match in many", () => {
            const parser2 = result("").pipe(manyTill("a"));
            expect(() => parser2.parse(" a")).toThrow();
        });

        it("fails soft when many fails 1st time without till", () => {
            expect(parser.parse("1")).toBeFailure(ResultKind.SoftFail);
        });
        it("fails hard when many fails 2nd time without till", () => {
            expect(parser.parse("ab1")).toBeFailure(ResultKind.HardFail);
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

            expect(parser.parse("aa")).toBeSuccessful("a");
            expect(parser.parse("bb")).toBeSuccessful("b");
            expect(parser.parse("ab")).toBeFailure(ResultKind.HardFail);
        });
    });

    describe("between combinators", () => {
        describe("two argument version", () => {
            const parser = string("a").pipe(between("(", string(")")));
            it("succeeds", () => {
                expect(parser.parse("(a)")).toBeSuccessful("a");
            });
            it("fails soft if first between fails", () => {
                expect(parser.parse("[a)")).toBeFailure(ResultKind.SoftFail);
            });
            it("fails hard if middle/last fails", () => {
                expect(parser.parse("(b)")).toBeFailure(ResultKind.HardFail);
                expect(parser.parse("(b]")).toBeFailure(ResultKind.HardFail);
            });
        });
        describe("one argument version", () => {
            const parser = string("a").pipe(between("!"));
            it("succeeds", () => {
                expect(parser.parse("!a!")).toBeSuccessful("a");
            });
        });

        describe("two argument version with different types", () => {
            const parser = string("a").pipe(between("_", float()));
            it("succeeds", () => {
                expect(parser.parse("_a3.14")).toBeSuccessful("a");
            });
        });
    });
});
