/**
 * Created by lifeg on 10/12/2016.
 */
/**
 * Created by lifeg on 10/12/2016.
 */
import {expectFailure, expectSuccess} from '../../custom-matchers';
import {LoudParser} from "../../../src/abstract/combinators/loud";
import {Parjs} from "../../../src/bindings/parsers";
import {ResultKind} from "../../../src/abstract/basics/result";
import {AnyParser} from "../../../src/abstract/combinators/any";
import _ = require('lodash');
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
                expectFailure(parser.parse(softBadInput), ResultKind.SoftFail);
            });
            it("fails hard on 2nd fail", () => {
                expectFailure(parser.parse(hardBadInput), ResultKind.HardFail);
            });
            it("fails on excess input", () => {
                expectFailure(parser.parse(excessInput), ResultKind.SoftFail);
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
                let parser2 = Parjs.string("hi").then(Parjs.rest, Parjs.rest);
                expectSuccess(parser2.parse("hi"), ["hi", "", ""]);
            });

        });

        describe("loud then quiet", () => {
            let parser = fstLoud.then(sndLoud.quiet);
            it("succeeds", () => {
                expectSuccess(parser.parse(goodInput), "ab");
            });
        });

        describe("quiet then loud", () => {
            let parser = fstLoud.quiet.then(sndLoud);
            it("succeeds", () => {
                expectSuccess(parser.parse(goodInput), "cd");
            });
        });

        describe("quiet then quiet", () => {
            let parser = fstLoud.quiet.then(sndLoud.quiet);
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
                expectFailure(parser.parse(excessInput), ResultKind.HardFail);
            });
        });

        describe("1 quiet using seq combinator", () => {
            let parser = Parjs.seq(fstLoud.quiet);
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
                expectFailure(parser.parse("a"), ResultKind.SoftFail);
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
               expectFailure(parser.parse("12"), ResultKind.SoftFail);
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

       });

       describe("many with zero-length match", () => {
           let parser = Parjs.result(0).many();
           it("guards against zero match in inner parser", () => {
               expect(() => parser.parse("abab")).toThrow();
           });

           it("ignores guard when given max iterations", () => {
               let parser = Parjs.result(0).many(undefined, 10);
               expectSuccess(parser.parse(""), _.range(0, 10).map(x => 0));
           });
       });

       describe("many with min successes", () => {
           let parser = fstLoud.many(2);
           it("succeeds when number of successes >= minimum", () => {
               expectSuccess(parser.parse("abab"), ["ab", "ab"]);
           });

           it("fails when number of successses < minimum", () => {
               expectFailure(parser.parse("ab"), ResultKind.HardFail);
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
               expectFailure(parser.parse("ababab"), ResultKind.SoftFail);
           });
       });

       describe("many on quiet parser", () => {
           let parser = fstLoud.quiet.many();
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
            let parser = fstLoud.quiet.exactly(2);
            expectSuccess(parser.parse("abab"), undefined);
        });
        it("hard fails with 0 < matches <= N", () => {
            expectFailure(parser.parse("ab"), ResultKind.HardFail);
        });
        it("soft fails with matches == 0", () => {
            expectFailure(parser.parse("a"), ResultKind.SoftFail);
        });
    });

    describe("manySepBy combinator", () => {
        let parser = fstLoud.manySepBy(Parjs.string(", "));
        it("succeeds with empty input", () => {
            expectSuccess(parser.parse(""), []);
        });

        it("succeeds with non-empty input", () => {
            expectSuccess(parser.parse("ab, ab"), ["ab", "ab"]);
        });

        it("chains into terminating separator", () => {
            let parser2 = parser.then(Parjs.string(", ").quiet);
            expectSuccess(parser2.parse("ab, ab, "), ["ab", "ab"])
        });
        it("fails soft if first many fails", () => {
            expectFailure(parser.parse("xa"), ResultKind.SoftFail);
        });
    });

    describe("manyTill combinator", () => {
        let parser = fstLoud.manyTill(sndLoud);
        it("succeeds matching 1 then till", () => {
            expectSuccess(parser.parse("abcd"), ["ab"]);
        });
        it("succeeds matching 1 then till, chains", () => {
            let parser2 = parser.then(fstLoud.quiet);
            expectSuccess(parser2.parse("abcdab"), ["ab"]);
        });
        it("fails hard when till fails hard", () => {
            let parser2 = Parjs.string("a").manyTill(Parjs.fail("", "HardFail"));
            expectFailure(parser2.parse("a"), "HardFail");
        });
        it("till optional mode", () => {
            let parser2 = Parjs.string("a").manyTill(Parjs.string("b"), true);
            expectSuccess(parser2.parse("a"), ["a"]);
        });
        it("fails soft when many fails 1st time without till", () => {
            expectFailure(parser.parse("1"), ResultKind.SoftFail);
        });
        it("fails hard when many fails 2nd time without till", () => {
            expectFailure(parser.parse("ab1"), ResultKind.HardFail);
        });
    });
});

